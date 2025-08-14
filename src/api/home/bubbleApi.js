import instance from "../instance.js";

// 말풍선 텍스트 조회
export const getBubbleText = async () => {
  try {
    console.log("말풍선 텍스트 조회 시작");
    const response = await instance.get(`/bubble`);
    console.log("말풍선 텍스트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("말풍선 텍스트 조회 에러:", error);
    throw error;
  }
};
