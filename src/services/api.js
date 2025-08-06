// API 기본 설정
const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:8080";

// 공통 헤더 설정
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// API 호출 유틸리티 함수
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    throw error;
  }
};

// 사용자 총 자산 조회
export const getUserLedger = async (userId) => {
  return await apiCall(`/api/users/${userId}/ledger`);
};

// 사용자 계좌 목록 조회
export const getUserAccounts = async (userId) => {
  return await apiCall(`/api/accounts/users/${userId}/accounts`);
};

// 사용자 카드 목록 조회
export const getUserCards = async (userId) => {
  return await apiCall(`/api/cards/users/${userId}/cards`);
};

// 사용자 정보 조회 (현재 로그인한 사용자)
export const getCurrentUser = async () => {
  return await apiCall("/api/users/me");
};

// 에러 처리 유틸리티
export const handleApiError = (error) => {
  console.error("API 에러:", error);

  if (error.message.includes("401")) {
    // 인증 실패 - 로그인 페이지로 리다이렉트
    window.location.href = "/login";
  } else if (error.message.includes("403")) {
    // 권한 없음
    alert("접근 권한이 없습니다.");
  } else if (error.message.includes("404")) {
    // 리소스 없음
    console.warn("요청한 데이터를 찾을 수 없습니다.");
  } else {
    // 기타 에러
    alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};
