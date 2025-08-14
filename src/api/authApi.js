import api from "./instance";

// 로그인 API
export const loginApi = (email, password) => {
  console.log("로그인 API 요청:", { email, password });
  return api
    .post("/auth/login", { email, password })
    .then((response) => {
      console.log("로그인 API 응답 데이터:", {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      });
      return response;
    })
    .catch((error) => {
      console.log("로그인 API 에러 응답 데이터:", {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
      throw error;
    });
};

// 토큰 재발급 API
export const refreshApi = () => api.post("/auth/refresh");

// 회원가입 API
export const signup = async (formData) => {
  try {
    const response = await api.post("/user/signup", formData);

    console.log("회원가입 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data; // { status, message, data }
  } catch (error) {
    if (error.response?.data) {
      console.log("회원가입 에러 응답 데이터:", {
        status: error.response.data.status,
        message: error.response.data.message,
        data: error.response.data.data,
      });
    }

    throw error;
  }
};

// 이메일 중복 확인 API
export const checkEmailDuplicate = async (email) => {
  try {
    const response = await api.get(`/user/email-check`, {
      params: { email }, // ?email=test@example.com
    });

    console.log("API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data; // { status, message, data }
  } catch (error) {
    // 409 Conflict도 catch로 떨어지므로 여기서 처리
    if (error.response?.status === 409) {
      console.log("409 에러 응답 데이터:", {
        status: error.response.data.status,
        message: error.response.data.message,
        data: error.response.data.data,
      });
      return error.response.data; // { status: 409, message: "...", data: null }
    }
    throw error;
  }
};


// 로그아웃 API
export const logoutApi = async () => {
  try {
    console.log("로그아웃 API 요청 시작");
    const response = await api.post("/auth/logout");

    console.log("로그아웃 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data;
  } catch (error) {
    console.log("로그아웃 API 에러 응답 데이터:", {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
    });
    throw error;
  }
};

//간편비밀번호 로그인 API
export const pinLogin = async (pin) => {
  try {
    console.log("간편비밀번호 로그인 API 요청 시작");
    const response = await api.post("/auth/pin/login",{pin});

    console.log("간편비밀번호 로그인 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data;
  } catch (error) {
    console.log("간편비밀번호 로그인 API 에러 응답 데이터:", {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
    });
    throw error;
  }
}

//간편비밀번호 생성 API
export const pinSet = async (pin) => {
  try {
    console.log("간편비밀번호 설정 API 요청 시작");
    const response = await api.post("/user/pin",{pin});

    console.log("간편비밀번호 설정 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data;
  } catch (error) {
    console.log("간편비밀번호 설정 API 에러 응답 데이터:", {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
    });
    throw error;
  }
}

//간편비밀번호 재설정 API
export const pinReset = async (pin) => {
  try {
    console.log("간편비밀번호 재설정 API 요청 시작");
    const response = await api.put("/user/pin/reset",{pin});

    console.log("간편비밀번호 재설정 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data;
  } catch (error) {
    console.log("간편비밀번호 로그인 API 에러 응답 데이터:", {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
    });
    throw error;
  }
}

//간편비밀번호 소유여부 조회 API
export const isPin = async () => {
  try {
    console.log("간편비밀번호 재설정 API 요청 시작");
    const response = await api.get("/user/pin/isCreated",{});

    console.log("간편비밀번호 재설정 API 응답 데이터:", {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    return response.data;
  } catch (error) {
    console.log("간편비밀번호 로그인 API 에러 응답 데이터:", {
      status: error.response?.data?.status,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
    });
    throw error;
  }
}