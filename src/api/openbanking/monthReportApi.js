import api from '../instance';

// 월간 리포트 초기 생성
export const initMonthReport = ({ month }) => {
  console.log('POST /monthreport/init 요청:', { month });
  return api
    .post('/monthreport/init', { month })
    .then((response) => {
      console.log('POST /monthreport/init 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /monthreport/init 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월간 리포트 수동 생성
export const createMonthReport = ({ month }) => {
  console.log('POST /monthreport 요청:', { month });
  return api
    .post('/monthreport', { month })
    .then((response) => {
      console.log('POST /monthreport 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('POST /monthreport 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월간 리포트 상세 조회
export const getMonthReport = (month) => {
  console.log('GET /monthreport/{month} 요청:', { month });
  return api
    .get(`/monthreport/${month}`)
    .then((response) => {
      console.log('GET /monthreport/{month} 응답:', {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /monthreport/{month} 에러:', {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 월간 리포트 PDF 다운로드
export const exportMonthReportPdf = (params = {}) => {
  console.log('GET /monthreport/export 요청:', params);
  return api
    .get('/monthreport/export', { params, responseType: 'blob' })
    .then((response) => {
      console.log('GET /monthreport/export 응답(blob):', {
        status: response.status,
        contentType: response.headers?.['content-type'],
        contentLength: response.headers?.['content-length'],
      });
      return response;
    })
    .catch((error) => {
      console.log('GET /monthreport/export 에러:', {
        status: error.response?.status ?? error.response?.data?.status,
        message:
          error.response?.data?.message ||
          error.message ||
          '월간 리포트 PDF 다운로드 실패',
      });
      throw error;
    });
};
