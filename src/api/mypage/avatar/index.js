import instance from "../../instance.js";

// 현재 포인트 조회
export const getCurrentCoin = async (userId) => {
  try {
    console.log("현재 포인트 조회 시작, userId:", userId);
    const response = await instance.get(`/avatar/getCurCoin`, {
      params: {
        userId: userId,
      },
    });
    console.log("현재 포인트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("현재 포인트 조회 에러:", error);
    throw error;
  }
};

// 월별 포인트 조회 (누적 포인트 대신 사용)
export const getMyMonthlyCoin = async (userId) => {
  try {
    console.log("월별 포인트 조회 시작, userId:", userId);
    const response = await instance.get(`/coin/monthly`, {
      params: {
        userId: userId,
      },
    });
    console.log("월별 포인트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("월별 포인트 조회 에러:", error);
    throw error;
  }
};

// 누적 포인트 조회 (getMyMonthlyCoin을 사용)
export const getCumulativeCoin = async (userId) => {
  try {
    console.log("누적 포인트 조회 시작 (월별 API 사용), userId:", userId);
    const response = await getMyMonthlyCoin(userId);
    console.log("누적 포인트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("누적 포인트 조회 에러:", error);
    throw error;
  }
};

// 퀴즈 정답 시 포인트 추가 (현재 사용자 포인트 업데이트)
export const addQuizPoints = async (userId, points = 10) => {
  try {
    console.log("퀴즈 포인트 추가 시작, userId:", userId, "points:", points);

    // 현재 사용자 포인트 조회
    const currentResponse = await getCurrentCoin(userId);
    console.log("현재 포인트 조회 결과:", currentResponse);

    let currentPoints = 0;
    if (currentResponse.data && currentResponse.data.data) {
      currentPoints = currentResponse.data.data.amount || 0;
    }

    // 새로운 포인트 계산
    const newPoints = currentPoints + points;

    // 포인트 업데이트 (PUT 요청으로 현재 포인트를 새로운 값으로 설정)
    const response = await instance.put(`/avatar/updateCoin`, {
      userId: userId,
      amount: newPoints,
    });

    console.log("퀴즈 포인트 추가 결과:", response);
    return response;
  } catch (error) {
    console.error("퀴즈 포인트 추가 에러:", error);
    throw error;
  }
};

// 의상 전체 조회
export const getClothes = async (userId) => {
  try {
    console.log("의상 전체 조회 시작, userId:", userId);
    const response = await instance.get(`/avatar/getClothes/userId=${userId}`);
    console.log("의상 전체 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("의상 전체 조회 에러:", error);
    throw error;
  }
};

// 의상 구매
export const insertClothe = async (clotheData) => {
  try {
    console.log("의상 구매 시작, 데이터:", clotheData);
    console.log("요청 URL:", `/avatar/insertClothe`);
    console.log("요청 메서드:", "POST");

    // API 명세에 따른 필수 파라미터만 전송
    const params = {
      userId: clotheData.userId,
      itemId: clotheData.itemId,
    };

    console.log("전송할 파라미터:", params);

    // query parameter로 요청
    const response = await instance.post(`/avatar/insertClothe`, null, {
      params: params,
    });
    console.log("의상 구매 성공:", response);
    return response;
  } catch (error) {
    console.error("의상 구매 에러:", error);
    console.error("에러 응답 데이터:", error.response?.data);
    console.error("에러 상태:", error.response?.status);
    console.error("에러 헤더:", error.response?.headers);

    // HTML 응답인 경우 텍스트로 출력
    if (
      typeof error.response?.data === "string" &&
      error.response.data.includes("<!doctype html>")
    ) {
      console.error(
        "서버가 HTML을 반환했습니다. API 엔드포인트가 올바른지 확인하세요."
      );
    }

    throw error;
  }
};

// 기프티콘 구매 (별도 API)
export const insertGifticon = async (gifticonData) => {
  try {
    console.log("기프티콘 구매 시작, 데이터:", gifticonData);
    console.log("요청 URL:", `/avatar/insertGifticon`);
    console.log("요청 메서드:", "POST");

    // 서버가 itemId를 request parameter로 요구하므로 query parameter로 전송
    const params = {
      userId: gifticonData.userId,
      itemId: gifticonData.itemId,
      itemType: gifticonData.itemType,
    };

    console.log("전송할 파라미터:", params);

    // query parameter로 요청
    const response = await instance.post(`/avatar/insertGifticon`, null, {
      params: params,
    });
    console.log("기프티콘 구매 성공:", response);
    return response;
  } catch (error) {
    console.error("기프티콘 구매 에러:", error);
    console.error("에러 응답 데이터:", error.response?.data);
    console.error("에러 상태:", error.response?.status);
    console.error("에러 헤더:", error.response?.headers);

    // HTML 응답인 경우 텍스트로 출력
    if (
      typeof error.response?.data === "string" &&
      error.response.data.includes("<!doctype html>")
    ) {
      console.error(
        "서버가 HTML을 반환했습니다. API 엔드포인트가 올바른지 확인하세요."
      );
    }

    throw error;
  }
};

// 코인 상태 조회 (새로운 API)
export const getMyCoinStatus = async () => {
  try {
    console.log("코인 상태 조회 시작");
    const response = await instance.get(`/coin/status`);
    console.log("코인 상태 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("코인 상태 조회 에러:", error);
    throw error;
  }
};

// 아바타 수정
export const updateAvatar = async (avatarData) => {
  try {
    console.log("아바타 수정 시작, 데이터:", avatarData);

    // 서버 에러 메시지에 따르면 사용 가능한 파라미터: [itemId, isWearing, param3, userId, param1, param2]
    // items 배열의 각 아이템을 개별 파라미터로 전송
    const itemsArray = avatarData.items || [];

    // 첫 번째 아이템을 itemId로, 나머지는 param1, param2, param3로 전송
    const params = {
      userId: avatarData.userId,
      itemId: itemsArray[0] || null,
      param1: itemsArray[1] || null,
      param2: itemsArray[2] || null,
      param3: itemsArray[3] || null,
      isWearing: true,
    };

    console.log("전송할 파라미터:", params);

    const response = await instance.put(`/avatar/updateAvatar`, null, {
      params: params,
    });
    console.log("아바타 수정 결과:", response);
    return response;
  } catch (error) {
    console.error("아바타 수정 에러:", error);
    console.error("에러 응답 데이터:", error.response?.data);
    console.error("에러 상태:", error.response?.status);
    throw error;
  }
};

// 아바타 상태 조회
export const getAvatarStatus = async (userId) => {
  try {
    console.log("아바타 상태 조회 시작, userId:", userId);
    const response = await instance.get(`/avatar/userId=${userId}`);
    console.log("아바타 상태 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("아바타 상태 조회 에러:", error);
    throw error;
  }
};
