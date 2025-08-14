import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // RT 쿠키 전송
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 중복 리프레시 방지용 간단한 락
let refreshingPromise = null;

// ===== 요청 인터셉터: 액세스 토큰 헤더 주입 =====
instance.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (!config.headers) config.headers = {};
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// ===== 응답 인터셉터: 로그인/재발급 응답 헤더에서 AT 저장 =====
instance.interceptors.response.use(
    (res) => {
      const auth = useAuthStore();
      const authHeader =
          res?.headers?.authorization ?? res?.headers?.Authorization;
      if (authHeader?.startsWith('Bearer ')) {
        auth.setTokens({ accessToken: authHeader.slice(7) });
      }
      return res;
    },
    async (error) => {
      const auth = useAuthStore();
      const original = error?.config || {};
      const status = error?.response?.status;

      // 로그인/리프레시 자체는 여기서 손대지 않음
      const isAuthCall =
          original?.url?.includes('/auth/login') ||
          original?.url?.includes('/auth/refresh');

      // 401이면: 리프레시 1회 시도 후 원요청 재시도
      if (status === 401 && !isAuthCall && !original._retry) {
        original._retry = true;

        try {
          // 이미 다른 요청이 리프레시 중이면 그걸 기다림
          if (!refreshingPromise) {
            // 글로벌 axios 사용 (인터셉터/오래된 AT 부착 방지)
            refreshingPromise = axios.post('/api/auth/refresh', null, {
              withCredentials: true,
              headers: { Authorization: '' }, // 혹시 모를 오래된 AT 제거
            });
          }

          const r = await refreshingPromise.finally(() => {
            refreshingPromise = null;
          });

          const hdr = r?.headers?.authorization ?? r?.headers?.Authorization;
          if (!hdr?.startsWith('Bearer ')) {
            throw new Error('No Authorization header in refresh response');
          }

          const newAT = hdr.slice(7);
          auth.setTokens({ accessToken: newAT });
    // 401이면 리프레시 시도 → 성공 시 원요청 재시도
    if (error.response?.status === 401 && !isAuthCall) {

      // 수정 1: 이미 재시도한 요청인지 확인하여 무한 루프 방지
      if (original._retry) {
        return Promise.reject(error); // 무한 재시도 방지
      }
      // 수정 2: 재시도한 요청이라고 꼬리표(플래그)를 붙임
      original._retry = true;

      try {
        const r = await instance.post('/auth/refresh'); // 바디 없음, 쿠키 자동 전송
        const authHeader = r.headers?.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          throw new Error('No Authorization header in refresh response');
        }
        const newAT = authHeader.slice(7);
        auth.setTokens({ accessToken: newAT });

          // 원 요청 재시도 시 최신 AT 부착
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newAT}`;
          return instance(original);
        } catch (e) {
          // 리프레시 실패 → 세션 종료(리다이렉트는 라우터 가드에서)
          auth.logout(false);
        }
      }

      // 그 외 에러는 그대로 던짐
      return Promise.reject(error);
    }
);


export default instance;
