import instance from "../instance.js";

// 오늘의 핀픽 키워드 조회
export const getTodayKeyword = async () => {
  try {
    console.log("오늘의 키워드 API 호출 시작: /news");
    const response = await instance.post("/news");
    console.log("오늘의 키워드 API 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("오늘의 키워드 조회 실패:", error);
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

// 뉴스 목록 조회
export const getNewsList = async () => {
  try {
    console.log("뉴스 목록 API 호출 시작: /news/SearchNews");
    const response = await instance.get("/news/SearchNews");
    console.log("뉴스 목록 API 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("뉴스 목록 조회 실패:", error);
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

// 본문에 삽입되는 뉴스 조회
export const getNewsContent = async () => {
  try {
    console.log("본문 뉴스 API 호출 시작: /news");
    const response = await instance.post("/news");
    console.log("본문 뉴스 API 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("본문 뉴스 조회 실패:", error);
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
