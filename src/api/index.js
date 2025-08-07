// src/api/index.js
// 모든 API 요청에 기본 설정 및 오류 핸들링 적용
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 프록시 설정 때문에 /api 붙이면 자동으로 http://52.79.124.217:8080으로 연결됨
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;
