import api from './index';

// 회원가입 API
export const signup = async (formData) => {
  const response = await api.post('/user/signup', formData);
  return response.data; // { status, message, data }
};

// 이메일 중복 확인 API
export const checkEmailDuplicate = async (email) => {
  try {
    const response = await api.get(`/user/email-check`, {
      params: { email }, // ?email=test@example.com
    });
    return response.data; // { status, message, data }
  } catch (error) {
    // 409 Conflict도 catch로 떨어지므로 여기서 처리
    if (error.response?.status === 409) {
      return error.response.data; // { status: 409, message: "...", data: null }
    }
    throw error;
  }
};
