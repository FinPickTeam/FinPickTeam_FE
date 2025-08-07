import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://52.79.124.217:8080',
        changeOrigin: true,
      },
    },
  },
  define: {
    // 환경 변수 정의
    'process.env.VUE_APP_API_BASE_URL': JSON.stringify(
      process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
    ),
  },
});
