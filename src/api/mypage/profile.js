import instance from "../instance.js";

// 투자성향 조회
export const getInvestmentPropensity = async () => {
  try {
    console.log("투자성향 조회 시작");
    const response = await instance.get(`/survey/userId`);
    console.log("투자성향 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("투자성향 조회 에러:", error);
    throw error;
  }
};
