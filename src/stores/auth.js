// src/stores/auth.js
import { defineStore } from 'pinia';
import { loginApi, logoutApi } from '@/api/authApi';
import router from '@/router';
import api from '@/api/instance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,   // AT: 메모리만
    user: null,          // { id, email, role, nickname, ... } → localStorage
    loading: false,
    error: null,
    _bootstrapped: false,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
    isAdmin: (s) => (s.user?.role || 'USER').toUpperCase() === 'ADMIN',
  },
  actions: {
    setTokens({ accessToken }) { this.accessToken = accessToken || null; },
    clearTokens() { this.accessToken = null; },

    async fetchMe() {
      try {
        const me = await api.get('/user/me').then((r) => r.data?.data);
        if (!me) return;
        this.user = {
          ...(this.user || {}),
          id: me.id,
          email: me.email,
          role: me.role || 'USER',
          authorities: me.authorities || [],
        };
      } catch {/* 조용히 패스 */}
    },

    async login({ email, password }) {
      try {
        this.loading = true;
        this.error = null;

        const res = await loginApi(email, password);
        const payload = res?.data?.data;

        // 1) 헤더에서 AT 파싱(백엔드가 헤더로 주는 경우)
        const hdr = res?.headers?.authorization || res?.headers?.Authorization;
        if (hdr?.startsWith('Bearer ')) {
          this.setTokens({ accessToken: hdr.slice(7) });
        }

        // 2) 사용자 표시 정보(닉네임 등)는 그대로 유지
        this.user = {
          ...(payload?.user ?? {}),
          ...(this.user ?? {}),
          nickname:
              payload?.nickname ??
              payload?.nickName ??
              payload?.NickName ??
              this.user?.nickname ??
              null,
        };

        // 3) 역할 동기화
        await this.fetchMe();

        // 4) 관리자면 바로 이동(원치 않으면 주석)
        if (this.isAdmin) router.replace('/admin');

        return true;
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || '로그인 실패';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async bootstrap() {
      if (this._bootstrapped) return;
      this._bootstrapped = true;

      try {
        const res = await api.post('/auth/refresh'); // RT 쿠키 자동 전송
        // 헤더에서 AT 파싱
        const hdr = res?.headers?.authorization || res?.headers?.Authorization;
        if (hdr?.startsWith('Bearer ')) {
          this.setTokens({ accessToken: hdr.slice(7) });
        }
        // 역할/권한 로드
        await this.fetchMe();
      } catch {
        // 실패 시 조용히 패스 → 라우터 가드가 로그인으로 유도
      }
    },

    async refreshTokens() {
      try {
        const res = await api.post('/auth/refresh');
        const hdr = res?.headers?.authorization || res?.headers?.Authorization;
        if (!hdr?.startsWith('Bearer ')) {
          throw new Error('리프레시 응답에 Authorization 헤더 없음');
        }
        const at = hdr.slice(7);
        this.setTokens({ accessToken: at });
        return at;
      } catch (e) {
        this.logout();
        throw e;
      }
    },

    async serverLogout() {
      try { await logoutApi(); } catch {/* 네트워크 실패는 무시 */}
    },

    async logout(redirect = true) {
      await this.serverLogout();
      this.clearTokens();
      this.user = null;
      if (redirect) router.push('/login');
    },
  },

  persist: {
    paths: ['user'],
    storage: window.localStorage,
  },
});
