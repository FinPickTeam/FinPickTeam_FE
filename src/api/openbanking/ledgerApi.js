import api from '../instance';

// 통합 거래내역(필터)
export const getLedger = (params) => {
  console.log('GET /ledger 요청:', { params });
  return api
    .get('/ledger', { params })
    .then((res) => {
      const r = res.data;
      console.log('GET /ledger 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /ledger 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 거래 상세
export const getLedgerDetail = (ledgerId) => {
  console.log('GET /ledger/{ledgerId} 요청:', { ledgerId });
  return api
    .get(`/ledger/${ledgerId}`)
    .then((res) => {
      const r = res.data;
      console.log('GET /ledger/{ledgerId} 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /ledger/{ledgerId} 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 거래 카테고리 수정 (204 대비)
export const patchLedgerCategory = (ledgerId, categoryId) => {
  console.log('PATCH /ledger/{ledgerId}/category 요청:', {
    ledgerId,
    categoryId,
  });
  return api
    .patch(`/ledger/${ledgerId}/category`, { categoryId })
    .then((res) => {
      const body = res.data ?? {
        status: res.status,
        message: 'NO_CONTENT',
        data: null,
      };
      console.log('PATCH /ledger/{ledgerId}/category 응답:', body);
      return body;
    })
    .catch((error) => {
      console.log('PATCH /ledger/{ledgerId}/category 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 거래 메모 수정 (204 대비)
export const patchLedgerMemo = (ledgerId, memo) => {
  console.log('PATCH /ledger/{ledgerId}/memo 요청:', { ledgerId, memo });
  return api
    .patch(`/ledger/${ledgerId}/memo`, { memo })
    .then((res) => {
      const body = res.data ?? {
        status: res.status,
        message: 'NO_CONTENT',
        data: null,
      };
      console.log('PATCH /ledger/{ledgerId}/memo 응답:', body);
      return body;
    })
    .catch((error) => {
      console.log('PATCH /ledger/{ledgerId}/memo 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
