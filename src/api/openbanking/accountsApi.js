import api from '../instance';

// 계좌 목록 + 총합 조회
export const getAccountsWithTotal = () => {
  console.log('GET /accounts/list 요청');
  return api
    .get('/accounts/list')
    .then((response) => {
      console.log('GET /accounts/list 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response; // { status, message, data }는 response.data에 있음
    })
    .catch((error) => {
      console.log('GET /accounts/list 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 계좌 등록
export const registerAccount = (payload) => {
  console.log('POST /accounts/register 요청:', payload);
  return api
    .post('/accounts/register', payload)
    .then((response) => {
      console.log('POST /accounts/register 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /accounts/register 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 계좌 삭제
export const deleteAccount = (accountId) => {
  console.log('DELETE /accounts/{accountId} 요청:', { accountId });
  return api
    .delete(`/accounts/${accountId}`)
    .then((response) => {
      console.log('DELETE /accounts/{accountId} 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('DELETE /accounts/{accountId} 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 전체 계좌 동기화
export const syncAllAccounts = () => {
  console.log('POST /accounts/sync-all 요청');
  return api
    .post('/accounts/sync-all')
    .then((response) => {
      console.log('POST /accounts/sync-all 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /accounts/sync-all 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 개별 계좌 동기화
export const syncAccountData = (accountId) => {
  console.log('POST /accounts/{accountId}/sync 요청:', { accountId });
  return api
    .post(`/accounts/${accountId}/sync`)
    .then((response) => {
      console.log('POST /accounts/{accountId}/sync 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /accounts/{accountId}/sync 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 계좌 거래내역 조회
export const getAccountTransactions = (
  accountId,
  { from, to, page, size } = {}
) => {
  console.log('GET /accounts/{accountId}/transactions 요청:', {
    accountId,
    params: { from, to, page, size },
  });
  return api
    .get(`/accounts/${accountId}/transactions`, {
      params: { from, to, page, size },
    })
    .then((response) => {
      console.log('GET /accounts/{accountId}/transactions 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /accounts/{accountId}/transactions 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
