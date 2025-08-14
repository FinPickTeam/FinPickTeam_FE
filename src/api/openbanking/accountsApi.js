import api from '../instance';

// 계좌 목록 + 총합
export const getAccountsWithTotal = () => {
  console.log('GET /accounts/list 요청');
  return api
    .get('/accounts/list')
    .then((res) => {
      const r = res.data;
      console.log('GET /accounts/list 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /accounts/list 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
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
    .then((res) => {
      const r = res.data;
      console.log('POST /accounts/register 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /accounts/register 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 계좌 삭제 (204 대비)
export const deleteAccount = (accountId) => {
  console.log('DELETE /accounts/{accountId} 요청:', { accountId });
  return api
    .delete(`/accounts/${accountId}`)
    .then((res) => {
      // 204면 res.data 없음
      const body = res.data ?? {
        status: res.status,
        message: 'NO_CONTENT',
        data: null,
      };
      console.log('DELETE /accounts/{accountId} 응답:', body);
      return body;
    })
    .catch((error) => {
      console.log('DELETE /accounts/{accountId} 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
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
    .then((res) => {
      const r = res.data;
      console.log('POST /accounts/sync-all 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /accounts/sync-all 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
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
    .then((res) => {
      const r = res.data;
      console.log('POST /accounts/{accountId}/sync 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /accounts/{accountId}/sync 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 계좌 거래내역 조회 (page/size는 백엔드가 무시할 수 있음)
export const getAccountTransactions = (
  accountId,
  { from, to, page, size } = {}
) => {
  const params = { from, to, page, size };
  console.log('GET /accounts/{accountId}/transactions 요청:', {
    accountId,
    params,
  });
  return api
    .get(`/accounts/${accountId}/transactions`, { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /accounts/{accountId}/transactions 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /accounts/{accountId}/transactions 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
