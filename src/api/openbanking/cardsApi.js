import api from '../instance';

// 카드 목록(+월별 사용액)
export const getCardsWithTotal = ({ month } = {}) => {
  const params = { month };
  console.log('GET /cards/list 요청:', params);
  return api
    .get('/cards/list', { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /cards/list 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /cards/list 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 카드 등록
export const registerCard = (payload) => {
  console.log('POST /cards/register 요청:', payload);
  return api
    .post('/cards/register', payload)
    .then((r) => {
      console.log('POST /cards/register 응답:', {
        status: r?.status,
        message: r?.message,
        data: r?.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /cards/register 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 카드 삭제 (204 대비)
export const deleteCard = (cardId) => {
  console.log('DELETE /cards/{cardId} 요청:', { cardId });
  return api
    .delete(`/cards/${cardId}`)
    .then((res) => {
      const body = res.data ?? {
        status: res.status,
        message: 'NO_CONTENT',
        data: null,
      };
      console.log('DELETE /cards/{cardId} 응답:', body);
      return body;
    })
    .catch((error) => {
      console.log('DELETE /cards/{cardId} 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 전체 카드 동기화
export const syncAllCards = () => {
  console.log('POST /cards/sync-all 요청');
  return api
    .post('/cards/sync-all')
    .then((res) => {
      const r = res.data;
      console.log('POST /cards/sync-all 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /cards/sync-all 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 개별 카드 동기화
export const syncCardData = (cardId) => {
  console.log('POST /cards/{cardId}/sync 요청:', { cardId });
  return api
    .post(`/cards/${cardId}/sync`)
    .then((res) => {
      const r = res.data;
      console.log('POST /cards/{cardId}/sync 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /cards/{cardId}/sync 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 카드 거래내역
export const getCardTransactions = (cardId, { from, to, page, size } = {}) => {
  const params = { from, to, page, size };
  console.log('GET /cards/{cardId}/transactions 요청:', { cardId, params });
  return api
    .get(`/cards/${cardId}/transactions`, { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /cards/{cardId}/transactions 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /cards/{cardId}/transactions 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
