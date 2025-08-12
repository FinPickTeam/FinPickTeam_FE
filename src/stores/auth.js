import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/authApi";
import router from "@/router";
import api from "@/api/instance";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    user: null,
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

    // 로그인: AT는 응답 헤더로, RT는 httpOnly 쿠키로 온다 (axios 응답 인터셉터가 AT 저장)
    async login({ email, password }) {
      try {
        this.loading = true;
        this.error = null;

        const res = await loginApi(email, password);
        const payload = res.data?.data;
        this.user = payload?.user ?? null; // 사용자 정보만 동기화
        return true;
      } catch (err) {
        this.error =
          err?.response?.data?.message || err?.message || "로그인 실패";
        return false;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 앱 부팅/새로고침 직후, 조용히 /auth/refresh 한 번 호출해서 AT를 복구
     * - 성공: 응답 인터셉터가 AT를 저장 → isAuthenticated=true
     * - 실패: 아무 것도 하지 않음 (라우터 가드가 로그인으로 리다이렉트)
     */
    async bootstrap() {
      if (this._bootstrapped) return;
      this._bootstrapped = true;
      try {
        await api.post("/auth/refresh"); // 바디 없음, 쿠키 자동 전송(withCredentials)
        // AT 저장은 응답 인터셉터(src/api/instance.js)가 처리
      } catch {
        // RT 만료/불일치면 조용히 실패
      }
    },

    /**
     * (선택) 수동 리프레시가 필요할 때 호출 가능
     */
    async refreshTokens() {
      try {
        const res = await api.post("/auth/refresh");
        const ok = !!res.headers?.authorization;
        if (!ok) throw new Error("리프레시 응답에 Authorization 헤더 없음");
        return res.headers.authorization.slice(7);
      } catch (e) {
        this.logout();
        throw e;
      }
    },

    async logout() {
      try {
        // 서버에 로그아웃 요청
        await logoutApi();
        console.log("로그아웃 API 호출 성공");
      } catch (error) {
        console.error("로그아웃 API 호출 실패:", error);
        // API 호출이 실패해도 클라이언트 상태는 정리
      } finally {
        // 클라이언트 상태 정리
        this.clearTokens();
        this.user = null;
        router.push("/login");
      }
    },
  },
});
