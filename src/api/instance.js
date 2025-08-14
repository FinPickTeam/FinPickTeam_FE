import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  baseURL: '/api', // Vite 프록시 경유
  withCredentials: true, // ★ 쿠키 자동 저장/전송
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ===== 요청 인터셉터: 액세스 토큰 헤더 주입 =====
instance.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// ===== 응답 인터셉터: 로그인/재발급 응답 헤더에서 AT 저장 =====
instance.interceptors.response.use(
  (res) => {
    const authHeader = res.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const at = authHeader.slice(7);
      const auth = useAuthStore();
      auth.setTokens({ accessToken: at }); // RT는 httpOnly 쿠키 → JS에서 다루지 않음
    }
    return res;
  },
  async (error) => {
    const auth = useAuthStore();
    const original = error.config;

    // 로그인/리프레시 자체 실패는 패스
    const isAuthCall =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/refresh');

    // 401이면 리프레시 시도 → 성공 시 원요청 재시도
    if (error.response?.status === 401 && !isAuthCall) {
      try {
        const r = await instance.post('/auth/refresh'); // 바디 없음, 쿠키 자동 전송
        const authHeader = r.headers?.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          throw new Error('No Authorization header in refresh response');
        }
        const newAT = authHeader.slice(7);
        auth.setTokens({ accessToken: newAT });

        // 원 요청 토큰 갱신 후 재시도
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAT}`;
        return instance(original);
      } catch (e) {
        auth.logout(false); // RT 만료/불일치 등 → 세션 종료 (리다이렉트 없이)
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
