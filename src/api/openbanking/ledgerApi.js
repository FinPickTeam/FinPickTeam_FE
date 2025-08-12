import instance from '@/api/instance';
export const getLedger = (params) => instance.get('/ledger', { params });
