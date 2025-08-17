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

// 비밀번호 변경
export const changePassword = async (passwordData) => {
  try {
    console.log("비밀번호 변경 시작");
    const response = await instance.put(`/user/password`, passwordData);
    console.log("비밀번호 변경 결과:", response);
    return response;
  } catch (error) {
    console.error("비밀번호 변경 에러:", error);
    throw error;
  }
};
