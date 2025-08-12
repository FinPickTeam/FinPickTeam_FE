import api from '../instance';

// 자산 총합 조회 (JWT 기반, 사용자 식별은 서버에서 처리)
export const getAssetTotal = (params = {}) => {
  console.log('GET /summary/asset-total 요청:', { params });
  return api
    .get('/summary/asset-total', { params })
    .then((response) => {
      console.log('GET /summary/asset-total 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /summary/asset-total 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 자산/소비 증감 비교 (이번 달 vs 지난 달)
export const getAssetSummaryCompare = (params = {}) => {
  console.log('GET /summary/compare 요청:', { params });
  return api
    .get('/summary/compare', { params })
    .then((response) => {
      console.log('GET /summary/compare 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /summary/compare 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월간 소비 합계 조회
// params: { month?: 'YYYY-MM' }
export const getMonthlySpending = (params = {}) => {
  console.log('GET /summary/monthly-spending 요청:', { params });
  return api
    .get('/summary/monthly-spending', { params })
    .then((response) => {
      console.log('GET /summary/monthly-spending 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /summary/monthly-spending 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
