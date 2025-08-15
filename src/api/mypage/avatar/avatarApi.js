import instance from "../../instance.js";

// 현재 포인트 조회 (coin/status API 사용)
export const getCurrentCoin = async (userId) => {
  try {
    console.log("현재 포인트 조회 시작, userId:", userId);
    // coin/status API에서 amount 필드를 현재 포인트로 사용
    const response = await instance.get(`/coin/status`);
    console.log("현재 포인트 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("현재 포인트 조회 에러:", error);
    console.error("에러 응답:", error.response?.data);
    console.error("에러 상태:", error.response?.status);
    throw error;
  }
};

// 아바타 상태 조회 (PUT 후 수정된 상태 조회용)
export const getAvatarStatus = async () => {
  try {
    console.log("아바타 상태 조회 시작");
    // 백엔드에서 @AuthenticationPrincipal을 사용하므로 userId 파라미터 없이 호출
    const response = await instance.get(`/avatar/userId=1`); // 경로 패턴을 맞추기 위해 임의의 값 사용
    console.log("아바타 상태 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("아바타 상태 조회 에러:", error);
    throw error;
  }
};

// 의상 전체 조회
export const getClothes = async () => {
  try {
    console.log("의상 전체 조회 시작");

    // 백엔드 컨트롤러의 @GetMapping("/getClothes/userId={userId}") 와 경로를 일치시킵니다.
    // {userId} 부분은 실제 값과 상관없이 경로 패턴을 맞추기 위해 임의의 값을 넣어줍니다 (예: 1).
    const response = await instance.get(`/avatar/getClothes/userId=1`); // ◀◀◀ 이렇게 수정하세요.

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

// 아바타 수정 (PUT /api/avatar/updateAvatar)
export const updateAvatar = async (items = []) => {
  try {
    console.log("아바타 수정 시작, items:", items);

    // items=4&items=31 형태로 만들기
    const qs = new URLSearchParams();
    items.forEach((id) => qs.append("items", id));

    const url = `/avatar/updateAvatar?${qs.toString()}`;
    console.log("요청 URL:", url);

    // 본문 없이 쿼리스트링만 전달 (PUT)
    const res = await instance.put(url);
    console.log("아바타 수정 성공:", res);
    return res;
  } catch (error) {
    console.error("아바타 수정 에러:", error.response?.data || error);
    throw error;
  }
};
// 아바타 조회 (GET /api/avatar/userId={userId})
export const getAvatar = async (userId) => {
  try {
    console.log("아바타 조회 시작, userId:", userId);
    const response = await instance.get(`/avatar/userId=${userId}`);
    console.log("아바타 조회 결과:", response);
    return response;
  } catch (error) {
    console.error("아바타 조회 에러:", error);
    throw error;
  }
};

// 아바타 생성 (POST /api/avatar/userId={userId})
export const createAvatar = async (userId) => {
  try {
    console.log("아바타 생성 시작, userId:", userId);
    const response = await instance.post(`/avatar/userId=${userId}`);
    console.log("아바타 생성 결과:", response);
    return response;
  } catch (error) {
    console.error("아바타 생성 에러:", error);
    throw error;
  }
};
