import api from '../instance';

// 카드 목록 + 총합 (month 옵셔널)
export const getCardsWithTotal = ({ month } = {}) => {
  console.log('GET /cards/list 요청:', { month });
  return api
    .get('/cards/list', { params: { month } })
    .then((response) => {
      console.log('GET /cards/list 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /cards/list 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
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
    .then((response) => {
      console.log('POST /cards/register 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /cards/register 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 카드 삭제
export const deleteCard = (cardId) => {
  console.log('DELETE /cards/{cardId} 요청:', { cardId });
  return api
    .delete(`/cards/${cardId}`)
    .then((response) => {
      console.log('DELETE /cards/{cardId} 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('DELETE /cards/{cardId} 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
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
    .then((response) => {
      console.log('POST /cards/sync-all 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /cards/sync-all 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
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
    .then((response) => {
      console.log('POST /cards/{cardId}/sync 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /cards/{cardId}/sync 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 카드 거래내역 조회
export const getCardTransactions = (cardId, { from, to, page, size } = {}) => {
  console.log('GET /cards/{cardId}/transactions 요청:', {
    cardId,
    params: { from, to, page, size },
  });
  return api
    .get(`/cards/${cardId}/transactions`, { params: { from, to, page, size } })
    .then((response) => {
      console.log('GET /cards/{cardId}/transactions 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /cards/{cardId}/transactions 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
