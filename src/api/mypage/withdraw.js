import api from "../instance";

// 회원탈퇴 API
export const withdrawUser = async () => {
  try {
    console.log("회원탈퇴 API 요청 시작");

    // 백엔드 API가 준비되지 않은 경우를 위한 임시 처리
    // 실제 API가 준비되면 아래 주석을 해제하고 위의 코드를 사용하세요
    /*
    const response = await api.put("/user/withdrawal");

    console.log("회원탈퇴 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data;
    */

    // 임시 성공 응답 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연
    return { status: 0, message: "회원 탈퇴가 완료되었습니다." };
  } catch (error) {
    console.log("회원탈퇴 API 에러 응답 데이터:", {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
    });
    throw error;
  }
};
