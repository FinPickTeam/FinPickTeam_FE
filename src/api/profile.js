import api from './instance.js';

// 회원가입 시 5단계 프로필 결과를 제출하는 API

export const submitSignupProfile = async (payload) => {
    console.log("5단계 프로필 제출 API 요청:", payload);
    try {
        const response = await api.post('/survey/submit-param', payload);

        console.log("5단계 프로필 제출 API 응답 데이터:", {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data,
        });

        return response.data;
    } catch (error) {
        console.log("5단계 프로필 제출 API 에러 응답 데이터:", {
            status: error.response?.data?.status,
            message: error.response?.data?.message,
            data: error.response?.data?.data,
        });
        throw error;
    }
};

//마이페이지에서 10단계 프로필 결과를 제출하는 API

export const submitFullProfile = async (payload) => {
    console.log("10단계 프로필 제출 API 요청:", payload);
    try {
        const response = await api.post('/survey/submit-fullSurvey', payload);

        console.log("10단계 프로필 제출 API 응답 데이터:", {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data,
        });

        return response.data;
    } catch (error) {
        console.log("10단계 프로필 제출 API 에러 응답 데이터:", {
            status: error.response?.data?.status,
            message: error.response?.data?.message,
            data: error.response?.data?.data,
        });
        throw error;
    }
};

// 사용자 ID로 투자 성향 결과를 조회하는 API

export const getProfileByUserId = async ( ) => {
    console.log(`투자 성향 조회 API 요청:`);
    try {
        const response = await api.get(`/survey/userId`);

        console.log("투자 성향 조회 API 응답 데이터:", {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data,
        });

        return response.data;
    } catch (error) {
        console.log("투자 성향 조회 API 에러 응답 데이터:", {
            status: error.response?.data?.status,
            message: error.response?.data?.message,
            data: error.response?.data?.data,
        });
        throw error;
    }

};

//10문항 설문 완료 여부를 조회하는 API

export const checkSurveyCompletion = async () => {
    console.log("설문 완료 여부 조회 API 요청");
    try {
        const response = await api.get('/survey/isSurvey');

        console.log("설문 완료 여부 조회 API 응답 데이터:", {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data,
        });

        return response.data; // { data: boolean, message, status }
    } catch (error) {
        console.log("설문 완료 여부 조회 API 에러 응답 데이터:", {
            status: error.response?.data?.status,
            message: error.response?.data?.message,
            data: error.response?.data?.data,
        });
        throw error;
    }
};