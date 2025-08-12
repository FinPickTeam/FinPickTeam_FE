import instance from "../instance.js";

// 오늘의 퀴즈 조회
export const getTodayQuiz = async () => {
  const url = "/Quiz/todaysQuiz";
  try {
    console.log("오늘의 퀴즈 API 호출 시작:", url);
    const res = await instance.get(url);
    console.log("오늘의 퀴즈 API 응답 성공:", res);
    return res.data;
  } catch (error) {
    console.error("퀴즈 조회 실패:", error);
    console.error("에러 상세 정보:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    throw error;
  }
};

// 퀴즈 응답 제출
export const submitQuiz = async (quizSubmitData) => {
  const url = "/Quiz/submit";
  try {
    console.log("퀴즈 제출 API 호출 시작:", url, quizSubmitData);
    const res = await instance.post(url, quizSubmitData);
    console.log("퀴즈 제출 API 응답 성공:", res);
    return res.data;
  } catch (error) {
    console.error("퀴즈 제출 실패:", error);
    console.error("에러 상세 정보:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    throw error;
  }
};

// 퀴즈 히스토리 내역 조회
export const getQuizHistoryList = async () => {
  const url = "/Quiz/HistoryList";
  try {
    console.log("퀴즈 히스토리 내역 조회 API 호출 시작:", url);
    const res = await instance.get(url);
    console.log("퀴즈 히스토리 내역 조회 API 응답 성공:", res);
    return res.data;
  } catch (error) {
    console.error("퀴즈 히스토리 내역 조회 실패:", error);
    console.error("에러 상세 정보:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    throw error;
  }
};

// 퀴즈 히스토리 상세 조회
export const getQuizHistoryDetail = async (quizId) => {
  const url = `/Quiz/HistoryDetail=${quizId}`;
  try {
    console.log("퀴즈 히스토리 상세 조회 API 호출 시작:", url);
    const res = await instance.get(url);
    console.log("퀴즈 히스토리 상세 조회 API 응답 성공:", res);
    return res.data;
  } catch (error) {
    console.error("퀴즈 히스토리 상세 조회 실패:", error);
    console.error("에러 상세 정보:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    throw error;
  }
};
