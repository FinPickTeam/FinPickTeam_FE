import api from '../instance';

// 총 자산
export const getAssetTotal = (params = {}) => {
  console.log('GET /summary/asset-total 요청:', { params });
  return api
    .get('/summary/asset-total', { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /summary/asset-total 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /summary/asset-total 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 현재/전월 비교
export const getAssetSummaryCompare = (params = {}) => {
  console.log('GET /summary/compare 요청:', { params });
  return api
    .get('/summary/compare', { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /summary/compare 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /summary/compare 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 특정 월 지출 합계
export const getMonthlySpending = (params = {}) => {
  console.log('GET /summary/monthly-spending 요청:', { params });
  return api
    .get('/summary/monthly-spending', { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /summary/monthly-spending 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /summary/monthly-spending 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
