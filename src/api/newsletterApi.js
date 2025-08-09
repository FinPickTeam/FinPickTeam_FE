import instance from "./instance.js";

// 전체 뉴스레터 목록 조회
export const getNewsletters = async () => {
  try {
    console.log("뉴스레터 API 호출 시작: /newsletters");
    const response = await instance.get("/newsletters");
    console.log("뉴스레터 API 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("뉴스레터 목록 조회 실패:", error);
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

// 특정 뉴스레터 상세 조회
export const getNewsletterById = async (id) => {
  try {
    console.log(`뉴스레터 상세 API 호출 시작: /newsletters/${id}`);
    const response = await instance.get(`/newsletters/${id}`);
    console.log("뉴스레터 상세 API 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("뉴스레터 상세 조회 실패:", error);
    console.error("에러 상세 정보:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};
