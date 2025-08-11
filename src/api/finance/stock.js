import api from '../instance.js';

/** 키움증권 토큰 발급
 * POST /v1/stock/token/user
 * @returns {Promise<any>} 서버 응답의 data
 */
export const issueUserStockToken = () => {
  return api
    .post('/v1/stock/token/user')
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/** 주식 계좌 수익률 조회
 * GET /v1/stock/account/user
 * @returns {Promise<Object>}
 */
export const getStockAccountReturn = () => {
  return api
    .get('/v1/stock/account/user')
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/** 주식 목록 조회
 *  GET /v1/stock/list
 * @returns {Promise<Object>}
 */
export const getStockList = () => {
  return api
    .get('/v1/stock/list')
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

// 나중에 requestParam으로 바꿔야 함
// stocks -> list로  수정 예정
/** 주식 상세정보 조회
 * GET v1/stcok/list
 * @param {string} stockCode  주식 코드
 * @returns {Promise<Object>} 주식 상세정보
 */
export const getStockDetail = (stockCode) => {
  return api
    .get(`/v1/stock/stocks/${encodeURIComponent(String(stockCode))}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/** 추천 주식 목록 조회
 * GET /v1/stock/recommend
 * @param {number} limit
 * @param {number} priceLimit
 * @returns {Promise<Array>} 추천 주식 리스트
 */
export const getStockRecommendedList = (limit, priceLimit) => {
  if (limit == null) {
    throw new Error('limit는 필수입니다.');
  }

  const params = { limit };
  if (priceLimit != null) {
    params.priceLimit = priceLimit;
  }
  return api
    .get('/v1/stock/recommend', { params })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
