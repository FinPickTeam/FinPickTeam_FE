import api from '../instance.js';

/**
 * 예금 리스트 조회
 * @param {Object} params
 * @param {string} [params.bankName]                - 은행명 (예: 'KB국민은행')
 * @param {number} [params.contractPeriodMonth]     - 계약 기간(월) (예: 12)
 * @param {number} [params.minSubscriptionAmount]   - 최소 가입 금액 (예: 1000000)
 * @param {'asc'|'desc'} [params.rateOrder]         - 금리 정렬 ('asc'|'desc')
 * @returns {Promise<Array>}                        - 예금 리스트 배열
 */
export const getDepositList = (params = {}) => {
  return api
    .get('/v1/deposit/list', {
      params: {
        bankName: params.bankName,
        contractPeriodMonth: params.contractPeriodMonth,
        minSubscriptionAmount: params.minSubscriptionAmount,
        rateOrder: params.rateOrder,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 예금 상세 조회
 * @param {string|number} productId - 상품 ID (필수)
 * @returns {Promise<Object>} 예금 상세 정보 객체
 */
export const getDepositDetail = (productId) => {
  if (!productId) {
    throw new Error('productId는 필수입니다.');
  }

  return api
    .get('/v1/deposit/depositDetail/', {
      params: { productId },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 예금 추천 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.amount - 투자 금액
 * @param {number} params.period - 투자 기간(개월)
 * @param {Object} body - Request Body
 * @returns {Promise<Array>} 추천 예금 리스트
 */
export const getDepositRecommendList = (params, body) => {
  if (!params?.amount || !params?.period) {
    throw new Error('amount와 period는 필수입니다.');
  }

  return api
    .post('/v1/deposit/recommend', body, { params })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
