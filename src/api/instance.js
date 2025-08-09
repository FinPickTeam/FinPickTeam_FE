import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  baseURL: '/api',
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

// ===== 응답 인터셉터: 401 처리 & 리프레시 =====
let isRefreshing = false;
let refreshPromise = null;

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const auth = useAuthStore();
    const original = error.config;

    // 로그인/리프레시 호출 자체의 401은 바로 실패로
    const isAuthCall =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !isAuthCall) {
      // 리프레시 토큰이 없으면 로그아웃
      const hasRT = !!Cookies.get('refreshToken');
      if (!hasRT) {
        auth.logout();
        return Promise.reject(error);
      }

      // 동시에 여러 요청이 401이면 한 번만 refresh
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = auth
          .refreshTokens()
          .catch((e) => {
            auth.logout();
            throw e;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      try {
        const newAccess = await refreshPromise;
        // 새 토큰으로 Authorization 갱신 후 재시도
        original.headers.Authorization = `Bearer ${newAccess}`;
        return instance(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
