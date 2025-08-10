import api from '../instance';

const pass = (v) => v;
const numOrOmit = (v) => (v === '' || v == null ? undefined : v);
const norm = (v) =>
  v === '' || v == null ? undefined : String(v).toLowerCase();

/**
 * 예금 리스트 조회
 * @param {Object} params
 * @param {string} [params.bankName]                - 은행명 (예: 'KB국민은행')
 * @param {number} [params.contractPeriodMonth]     - 계약 기간(월) (예: 12)
 * @param {number} [params.minSubscriptionAmount]   - 최소 가입 금액 (예: 1000000)
 * @param {string} [params.installmentType]         - 상품 타입 (예: '자유적립식')
 * @param {'asc'|'desc'} [params.sortByInstallmentProductName]         - 이름 정렬 ('asc'|'desc')
 * @param {'asc'|'desc'} [params.sortByInstallmentBasicRate]         - 금리 정렬 ('asc'|'desc')
 * @returns {Promise<Array>}                        - 적금 리스트 배열
 */
export const getInstallmentList = (params = {}) => {
  const query = {
    // 문자열 필터: 빈 문자열 허용
    bankName: pass(params.bankName ?? params.bankName ?? ''),
    installmentType: pass(params.installmentType ?? ''),

    // 숫자 필터: 빈값이면 아예 안 보냄(백엔드에서 null로 간주)
    contractPeriodMonth: numOrOmit(params.contractPeriodMonth),
    minSubscriptionAmount: numOrOmit(params.minSubscriptionAmount),

    // 정렬: 빈값이면 제외(ORDER BY 문법 오류 방지)
    sortByInstallmentProductName: norm(params.sortByInstallmentProductName),
    sortByInstallmentBasicRate: norm(params.sortByInstallmentBasicRate),
  };

  return api
    .get('/v1/installment/list', { params: query })
    .then((res) => res.data);
};

/**
 * 적금 상세 조회
 * @param {string|number} installmentProductId - 상품 ID (필수)
 * @returns {Promise<Object>} 적금 상세 정보 객체
 */
export const getInstallmentDetail = (installmentProductId) => {
  if (!installmentProductId) {
    throw new Error('productId는 필수입니다.');
  }

  return api
    .get('/v1/installment/installmentDetail/', {
      params: { installmentProductId },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 적금 추천 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.amount - 투자 금액
 * @param {number} params.period - 투자 기간(개월)
 * @param {Object} body - Request Body
 * @returns {Promise<Array>} 추천 적금 리스트
 */
export const getInstallmentRecommendList = (params, body) => {
  if (!params?.amount || !params?.period) {
    throw new Error('amount와 period는 필수입니다.');
  }

  return api
    .post('/v1/installment/recommend', body, { params })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
