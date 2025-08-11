import api from '../instance.js';

/**
 * 펀드 리스트 조회
 * GET /v1/fund/list
 * @param {Object|null} params
 * @param {string} [params.fundRiskLevel] - 위험등급 (예: '높은위험', '보통위험', '낮은위험')
 * @param {string} [params.fundType]      - 펀드 유형 (예: '채권형', '주식형', '혼합형')
 * @returns {Promise<Array>} 펀드 리스트
 */
export const getFundList = (params = null) => {
  const query =
    params == null
      ? undefined
      : {
          fundRiskLevel: params?.fundRiskLevel ?? '',
          fundType: params?.fundType ?? '',
        };

  return api
    .get('/v1/fund/list', { params: query })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/** 펀드 상세 조회
 * GET /v1/fun/fundDetail
 * @param {string|number} productId - 상품 ID (필수)
 * @returns {Promise<Object>} 펀드 상세 정보 객체
 *  */
export const getFundDetail = (productId) => {
  if (productId == null || productId === '') {
    throw new Error('productId는 필수입니다.');
  }
  return api
    .get('/v1/fund/fundDetail/', { params: { productId } })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/** 펀드 추천 리스트 조회
 * GET /v1/fund/recommend
 * @returns {Promise<Array>} 추천 펀드 리스트
 */
export const getFundRecommendedList = () => {
  return api
    .get('/v1/fund/recommend')
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
