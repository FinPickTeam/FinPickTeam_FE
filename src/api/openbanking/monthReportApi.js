import api from '../instance';

// 과거 리포트 초기 생성 (스펙상 바디 없음)
export const initMonthReport = () => {
  console.log('POST /monthreport/init 요청');
  return api
    .post('/monthreport/init')
    .then((res) => {
      const r = res.data;
      console.log('POST /monthreport/init 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /monthreport/init 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월 리포트 수동 생성 (스펙: Query month)
export const createMonthReport = ({ month }) => {
  console.log('POST /monthreport 요청:', { month });
  return api
    .post('/monthreport', null, { params: { month } })
    .then((res) => {
      const r = res.data;
      console.log('POST /monthreport 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('POST /monthreport 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월 리포트 상세
export const getMonthReport = (month) => {
  const safe = encodeURIComponent(month);
  console.log('GET /monthreport/{month} 요청:', { month });
  return api
    .get(`/monthreport/${safe}`)
    .then((res) => {
      const r = res.data;
      console.log('GET /monthreport/{month} 응답:', {
        status: r.status,
        message: r.message,
        data: r.data,
      });
      return r;
    })
    .catch((error) => {
      console.log('GET /monthreport/{month} 에러:', {
        status: error.response?.data?.status ?? error.response?.status,
        message: error.response?.data?.message ?? error.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월 리포트 내보내기 (blob)
export const exportMonthReportPdf = ({ month, format = 'pdf' } = {}) => {
  const params = { month, format };
  console.log('GET /monthreport/export 요청:', params);
  return api
    .get('/monthreport/export', { params, responseType: 'blob' })
    .then((res) => {
      console.log('GET /monthreport/export 응답(blob):', {
        status: res.status,
        contentType: res.headers?.['content-type'],
        contentLength: res.headers?.['content-length'],
      });
      return res; // blob은 원본 필요
    })
    .catch((error) => {
      console.log('GET /monthreport/export 에러:', {
        status: error.response?.status ?? error.response?.data?.status,
        message:
          error.response?.data?.message ??
          error.message ??
          '월간 리포트 PDF 다운로드 실패',
      });
      throw error;
    });
};
