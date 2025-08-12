import instance from "../../instance.js";

// 현재 포인트 조회
export const getCurrentCoin = async (userId) => {
  try {
    console.log("현재 포인트 조회 시작, userId:", userId);
    const response = await instance.get(`/avatar/getCurCoin/userId=${userId}`);
    console.log("현재 포인트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("현재 포인트 조회 에러:", error);
    throw error;
  }
};

// 누적 포인트 조회
export const getCumulativeCoin = async (userId) => {
  try {
    console.log("누적 포인트 조회 시작, userId:", userId);
    const response = await instance.get(
      `/avatar/getCumulativeAmount/userId=${userId}`
    );
    console.log("누적 포인트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("누적 포인트 조회 에러:", error);
    throw error;
  }
};

// 퀴즈 정답 시 포인트 추가
export const addQuizPoints = async (userId, points = 10) => {
  try {
    console.log("퀴즈 포인트 추가 시작, userId:", userId, "points:", points);
    const response = await instance.post(`/avatar/addQuizPoints`, {
      userId: userId,
      points: points,
    });
    console.log("퀴즈 포인트 추가 결과:", response);
    return response;
  } catch (error) {
    console.error("퀴즈 포인트 추가 에러:", error);
    throw error;
  }
};
