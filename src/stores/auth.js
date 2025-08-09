// src/stores/auth.js
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
// import api from '@/api'; // axios instance
import { loginApi, refreshApi } from '@/api/authApi'; // API 함수들 import
// 필요 시 라우터로 이동하려면 아래 임포트
import router from '@/router'; // 라우터 경로 맞춰서

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
  },
  actions: {
    setTokens({ accessToken, refreshToken }) {
      this.accessToken = accessToken || null;
      if (refreshToken) {
        // 보안: 실제로는 서버가 httpOnly 쿠키로 내려주는 게 베스트.
        Cookies.set('refreshToken', refreshToken, {
          sameSite: 'lax',
          secure: true,
        });
      }
    },
    clearTokens() {
      this.accessToken = null;
      Cookies.remove('refreshToken');
    },
    async login({ email, password }) {
      try {
        this.loading = true;
        this.error = null;

        const { data } = await loginApi(email, password);
        // 서버 포맷: { status, message, data: { accessToken, refreshToken, user? } }
        if (data?.data?.accessToken) {
          this.setTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          });
          this.user = data.data.user ?? null;
          return true;
        } else {
          throw new Error(data?.message || '로그인 실패');
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || '로그인 실패';
        return false;
      } finally {
        this.loading = false;
      }
    },
    async refreshTokens() {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('리프레시 토큰 없음');

      const { data } = await refreshApi(refreshToken);
      if (!data?.data?.accessToken) {
        throw new Error(data?.message || '토큰 재발급 실패');
      }
      this.setTokens({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken, // 서버가 새로 주면 교체
      });
      return data.data.accessToken;
    },
    logout() {
      this.clearTokens();
      this.user = null;
      router.push('/login');
    },
  },
});
