import instance from "../instance.js";

// 뉴스 목록 조회
export const getNewsList = async () => {
  try {
    console.log("뉴스 목록 API 호출 시작: /news/SearchNews");
    console.log("요청 URL:", instance.defaults.baseURL + "/news/SearchNews");
    console.log("요청 메서드: GET");

    const response = await instance.get("/news/SearchNews");
    console.log("뉴스 목록 API 응답 성공:", response);
    console.log("응답 상태:", response.status);
    console.log("응답 데이터:", response.data);
    return response;
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
