import instance from "../../instance.js";

// 현재 재화 조회
export const getCurrentCoin = async (userId) => {
  try {
    console.log(
      "현재 재화 API 호출 시작:",
      `/avatar/getCurCoin/userId=${userId}`
    );
    const response = await instance.get(`/avatar/getCurCoin/userId=${userId}`);
    console.log("현재 재화 API 응답 성공:", response);
    console.log("response.data 구조:", response.data);
    console.log("response.data.data 값:", response.data?.data);
    console.log("response.data.status 값:", response.data?.status);
    return response.data;
  } catch (error) {
    console.error("현재 재화 조회 실패:", error);
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

// 누적 포인트 조회
export const getCumulativeCoin = async (userId) => {
  try {
    console.log(
      "누적 포인트 API 호출 시작:",
      `/avatar/getCumulativeAmount/userId=${userId}`
    );
    const response = await instance.get(
      `/avatar/getCumulativeAmount/userId=${userId}`
    );
    console.log("누적 포인트 API 응답 성공:", response);
    return response.data;
  } catch (error) {
    console.error("누적 포인트 조회 실패:", error);
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
