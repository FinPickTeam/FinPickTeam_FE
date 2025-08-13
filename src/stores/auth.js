// src/stores/auth.js
import { defineStore } from 'pinia';
import { loginApi } from '@/api/authApi';
import router from '@/router';
import api from '@/api/instance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null, // AT는 메모리만 (새로고침 시 사라짐)
    user: null,        // 닉네임 포함한 사용자 정보 -> localStorage에 영구 저장
    loading: false,
    error: null,
    _bootstrapped: false, // 새로고침 직후 1회만 조용히 리프레시 시도
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
  },
  actions: {
    // RT는 httpOnly 쿠키로만 운용 → JS에서 만지지 않음
    setTokens({ accessToken }) {
      this.accessToken = accessToken || null;
    },
    clearTokens() {
      this.accessToken = null;
    },

    // 로그인: AT는 응답 헤더(Authorization)로, RT는 httpOnly 쿠키로 발급
    async login({ email, password }) {
      try {
        this.loading = true;
        this.error = null;

        const res = await loginApi(email, password);
        const payload = res.data?.data;

        // ★ 사용자 정보(닉네임 포함) localStorage에 보존됨(아래 persist 설정)
        this.user = {
          ...(payload?.user ?? {}),
          nickname: payload?.nickname ?? payload?.nickName ?? payload?.NickName ?? null,
        };

        // AT 저장은 axios 응답 인터셉터(src/api/instance.js)가 처리
        return true;
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || '로그인 실패';
        return false;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 앱 부팅/새로고침 직후, 조용히 /auth/refresh 한 번 호출해서 AT를 복구
     * - 성공: 응답 인터셉터가 AT 저장 → isAuthenticated=true
     * - 실패: 아무 것도 안 함(라우터 가드가 로그인으로 유도)
     *
     * 그리고 (선택) /user/me로 최신 사용자 정보 싱크.
     *  → 이건 백엔드 API가 있어야 동작함. 없으면 try 블록 생략/주석처리해도 됨.
     */
    async bootstrap() {
      if (this._bootstrapped) return;
      this._bootstrapped = true;

      try {
        // 쿠키(RT)만으로 재발급 시도 (withCredentials=true)
        await api.post('/auth/refresh');
        // AT 저장은 응답 인터셉터가 처리

        // ---- (선택) 최신 프로필 동기화 ----
        // 백엔드에 GET /api/user/me 가 있다면 주석 해제해서 사용하세요.
        // const me = await api.get('/user/me');
        // this.user = me.data?.data ?? this.user;
      } catch {
        // RT 만료/불일치면 조용히 실패 → 이후 보호 라우트 접근 시 가드가 로그인으로 이동
      }
    },

    /**
     * (선택) 수동 리프레시가 필요할 때 사용
     */
    async refreshTokens() {
      try {
        const res = await api.post('/auth/refresh'); // 바디 없음, 쿠키 자동 전송
        const ok = !!res.headers?.authorization;
        if (!ok) throw new Error('리프레시 응답에 Authorization 헤더 없음');
        return res.headers.authorization.slice(7);
      } catch (e) {
        this.logout();
        throw e;
      }
    },

    logout() {
      this.clearTokens();
      this.user = null; // localStorage의 user도 제거됨(플러그인이 반영)
      router.push('/login');
    },
  },

  // ★ user만 localStorage에 영구 저장
  persist: {
    paths: ['user'],
    storage: window.localStorage,
  },
});
