import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

// .env 혹은 .env.development 등에서 VITE_API_BASE_URL 세팅
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // 예: 'http://localhost:8080'
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// 요청 인터셉터: 토큰 자동 첨부
api.interceptors.request.use(
    (config) => {
        const auth = useAuthStore();
        const token = auth?.token; // Pinia에 저장된 액세스 토큰
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 공통 에러 처리
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { response } = error;
        if (!response) {
            // 네트워크 오류 등
            return Promise.reject(error);
        }

        if (response.status === 401) {
            // 만료/인증 실패 → 로그아웃 후 로그인으로
            const auth = useAuthStore();
            try { auth.logout?.(); } catch (_) {}
            router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
        }

        // 그 외엔 그대로 throw (각 화면에서 message 표시)
        return Promise.reject(error);
    }
);

export default api;
