import instance from '../instance';

// ───────────────────────────────────────────────────────────────
// 거래 상세 조회
// GET /ledger/{ledgerId}
// ───────────────────────────────────────────────────────────────
export const getLedgerDetail = (ledgerId) => {
  console.log('GET /ledger/{ledgerId} 요청:', { ledgerId });

  return instance
    .get(`/ledger/${ledgerId}`)
    .then((response) => {
      console.log('GET /ledger/{ledgerId} 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data, // Object
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /ledger/{ledgerId} 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// ───────────────────────────────────────────────────────────────
// 거래 카테고리 수정
// PATCH /ledger/{ledgerId}/category { categoryId }
// ───────────────────────────────────────────────────────────────
export const patchLedgerCategory = (ledgerId, category) => {
  console.log('PATCH /ledger/{ledgerId}/category 요청:', {
    ledgerId,
    category,
  });

  return instance
    .patch(`/ledger/${ledgerId}/category`, { category })
    .then((response) => {
      console.log('PATCH /ledger/{ledgerId}/category 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data, // updated object or null
      });
      return response;
    })
    .catch((error) => {
      console.log('PATCH /ledger/{ledgerId}/category 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// ───────────────────────────────────────────────────────────────
// 거래 메모 수정
// PATCH /ledger/{ledgerId}/memo { memo }
// ───────────────────────────────────────────────────────────────
export const patchLedgerMemo = (ledgerId, memo) => {
  console.log('PATCH /ledger/{ledgerId}/memo 요청:', { ledgerId, memo });

  return instance
    .patch(`/ledger/${ledgerId}/memo`, { memo })
    .then((response) => {
      console.log('PATCH /ledger/{ledgerId}/memo 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data, // updated object or null
      });
      return response;
    })
    .catch((error) => {
      console.log('PATCH /ledger/{ledgerId}/memo 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};
