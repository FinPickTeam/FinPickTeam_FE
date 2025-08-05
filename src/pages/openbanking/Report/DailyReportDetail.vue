<template>
  <div class="transaction-detail-container">
    <!-- 상단 헤더 -->
    <div class="diaryhome-header">
      <button class="diaryhome-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <div class="diaryhome-header-icons">
        <button class="diaryhome-icon-btn" @click="goToDictionary">
          <font-awesome-icon :icon="['fas', 'search']" />
        </button>
      </div>
    </div>

    <!-- 거래 요약 섹션 -->
    <div class="transaction-summary">
      <div class="merchant-info">
        <div class="merchant-icon">
          <img
            :src="getCategoryLogo(transaction.category)"
            :alt="transaction.category"
          />
        </div>
        <div class="merchant-details">
          <div class="merchant-name">{{ transaction.merchant }}</div>
          <div class="transaction-date">
            {{ transaction.date }} {{ transaction.time }}
          </div>
        </div>
      </div>
      <div class="transaction-amount">
        -{{ transaction.amount.toLocaleString() }}원
      </div>
    </div>

    <!-- 거래 상세 정보 -->
    <div class="transaction-details">
      <div class="detail-item">
        <span class="detail-label">결제수단</span>
        <span class="detail-value">{{ transaction.paymentMethod }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">카테고리</span>
        <div class="category-with-button">
          <span class="detail-value">{{ transaction.category }}</span>
          <button class="category-edit-btn" @click="goToCategorySelect">
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </button>
        </div>
      </div>
      <div class="detail-item">
        <span class="detail-label">사용자메모</span>
        <div class="memo-with-button">
          <span class="detail-value memo" @click="openMemoModal">{{
            transaction.memo
          }}</span>
          <button class="memo-edit-btn" @click="openMemoModal">
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </button>
        </div>
      </div>
    </div>

    <!-- 소비 피드백 섹션 -->
    <div class="consumption-feedback">
      <div class="feedback-header">
        <span class="feedback-title">소비 피드백</span>
        <div class="sparkle-icons">
          <font-awesome-icon :icon="['fas', 'star']" />
          <font-awesome-icon :icon="['fas', 'star']" />
        </div>
      </div>
      <div class="feedback-content">
        <p>{{ transaction.feedback.line1 }}</p>
        <p>{{ transaction.feedback.line2 }}</p>
      </div>
    </div>

    <!-- 메모 수정 모달 -->
    <div v-if="showMemoModal" class="modal-overlay" @click="closeMemoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>메모 수정</h3>
          <button class="modal-close-btn" @click="closeMemoModal">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <textarea
            v-model="memoText"
            class="memo-textarea"
            placeholder="메모를 입력하세요..."
            rows="4"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeMemoModal">
            취소
          </button>
          <button class="modal-btn save-btn" @click="saveMemo">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faSearch,
  faPlus,
  faStar,
  faAngleRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import transactionData from "../Transaction_dummy.json";

library.add(faAngleLeft, faSearch, faPlus, faStar, faAngleRight, faTimes);

const router = useRouter();
const route = useRoute();

// 모달 관련 상태
const showMemoModal = ref(false);
const memoText = ref("");

// 거래 데이터
const transaction = ref({
  merchant: "",
  date: "",
  time: "",
  amount: 0,
  paymentMethod: "",
  category: "",
  bankLogo: "", // 은행 로고 필드 추가
  memo: "",
  feedback: {
    line1: "",
    line2: "",
  },
});

// 거래 데이터에서 해당 ID의 거래 찾기
const findTransactionById = (
  id,
  transactions = transactionData.transactions
) => {
  const index = parseInt(id);

  if (index >= 0 && index < transactions.length) {
    const trans = transactions[index];

    // 날짜 형식 변환 (YYYY-MM-DD -> YYYY.MM.DD)
    const dateParts = trans.date.split("-");
    const formattedDate = `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;

    // 시간은 고정값으로 설정 (거래 데이터에 시간 정보가 없으므로 00:00으로 설정)
    const time = "00:00";

    return {
      merchant: trans.description,
      date: formattedDate,
      time: time,
      amount: trans.amount,
      paymentMethod: `${trans.bank} ${trans.account}`,
      category: trans.description,
      bankLogo: trans.logo,
      memo: `${trans.description} 관련 거래입니다. ${
        trans.type === "출금" ? "지출" : "수입"
      } 거래로 기록되었습니다.`,
      feedback: {
        line1:
          trans.type === "출금"
            ? "소비 지출로 기록되었습니다."
            : "수입 거래로 기록되었습니다.",
        line2:
          trans.type === "출금"
            ? "지출 패턴을 확인해보세요.😊"
            : "수입이 잘 관리되고 있습니다.👍",
      },
    };
  }

  return null;
};

// 카테고리 로고 가져오기 함수
const getCategoryLogo = (categoryName) => {
  // 카테고리에 따른 로고 매핑
  const categoryMapping = {
    식비: "식비.png",
    "카페, 간식": "카페, 간식.png",
    "쇼핑, 미용": "쇼핑, 미용.png",
    "편의점, 마트, 잡화": "편의점, 마트, 잡화.png",
    "교통, 자동차": "교통, 자동차.png",
    "주거, 통신": "주거, 통신.png",
    "취미, 여가": "취미, 여가.png",
    "보험, 기타 금융": "보험, 기타 금융.png",
    구독: "구독.png",
    이체: "이체.png",
    기타: "기타.png",
    "카테고리 없음": "카테고리 없음.png",
  };

  // 정확한 카테고리 매칭
  if (categoryMapping[categoryName]) {
    try {
      return new URL(
        `/src/assets/spending_logo/${categoryMapping[categoryName]}`,
        import.meta.url
      ).href;
    } catch (error) {
      console.error("카테고리 로고 로드 실패:", error);
    }
  }

  // 부분 매칭 (기존 호환성을 위해)
  for (const [category, logo] of Object.entries(categoryMapping)) {
    if (categoryName.includes(category) || category.includes(categoryName)) {
      try {
        return new URL(`/src/assets/spending_logo/${logo}`, import.meta.url)
          .href;
      } catch (error) {
        console.error("카테고리 로고 로드 실패:", error);
      }
    }
  }

  // 기본 로고 반환
  try {
    return new URL("/src/assets/spending_logo/기타.png", import.meta.url).href;
  } catch (error) {
    return new URL(
      "/src/assets/spending_logo/카테고리 없음.png",
      import.meta.url
    ).href;
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.back();
};

// 사전 페이지로 이동
const goToDictionary = () => {
  router.push("/dictionary");
};

// 카테고리 선택 페이지로 이동
const goToCategorySelect = () => {
  const transactionId = route.params.id;
  router.push(
    `/openbanking/daily-report-select?transactionId=${transactionId}`
  );
};

// 메모 모달 열기
const openMemoModal = () => {
  memoText.value = transaction.value.memo;
  showMemoModal.value = true;
};

// 메모 모달 닫기
const closeMemoModal = () => {
  showMemoModal.value = false;
  memoText.value = "";
};

// 메모 저장
const saveMemo = () => {
  transaction.value.memo = memoText.value;

  // localStorage에 저장
  const transactionId = route.params.id;
  localStorage.setItem(`transaction_${transactionId}_memo`, memoText.value);

  closeMemoModal();
};

onMounted(() => {
  const transactionId = route.params.id;
  console.log("전체 route.params:", route.params);
  console.log("거래 ID:", transactionId);

  if (transactionId !== undefined && transactionId !== null) {
    // localStorage와 sessionStorage에서 업데이트된 거래 데이터 확인
    let updatedData = localStorage.getItem("transaction_data_updated");
    if (!updatedData) {
      updatedData = sessionStorage.getItem("transaction_data_updated");
    }

    let transactionsToUse = transactionData.transactions;

    if (updatedData) {
      try {
        const parsedData = JSON.parse(updatedData);
        transactionsToUse = parsedData.transactions;
        console.log("업데이트된 거래 데이터 로드됨:", transactionsToUse);
      } catch (error) {
        console.error("업데이트된 거래 데이터 파싱 실패:", error);
      }
    }

    const foundTransaction = findTransactionById(
      transactionId,
      transactionsToUse
    );
    if (foundTransaction) {
      transaction.value = foundTransaction;
      console.log("거래 데이터 로드 성공:", foundTransaction);

      // localStorage와 sessionStorage에서 선택된 카테고리 확인
      let selectedCategory = localStorage.getItem(
        `transaction_${transactionId}_category`
      );
      if (!selectedCategory) {
        selectedCategory = sessionStorage.getItem(
          `transaction_${transactionId}_category`
        );
      }
      if (!selectedCategory) {
        selectedCategory = sessionStorage.getItem(
          `selectedCategory_${transactionId}`
        );
      }

      if (selectedCategory) {
        transaction.value.category = selectedCategory;
        console.log("카테고리가 업데이트되었습니다:", selectedCategory);
      }

      // localStorage에서 저장된 메모 확인
      const savedMemo = localStorage.getItem(
        `transaction_${transactionId}_memo`
      );
      if (savedMemo) {
        transaction.value.memo = savedMemo;
        console.log("저장된 메모가 로드되었습니다:", savedMemo);
      }
    } else {
      console.error("거래를 찾을 수 없습니다:", transactionId);
    }
  } else {
    console.error("거래 ID가 전달되지 않았습니다.");
  }
});

// 페이지가 다시 활성화될 때 카테고리 변경사항 확인
onActivated(() => {
  const transactionId = route.params.id;
  if (transactionId) {
    // localStorage와 sessionStorage에서 선택된 카테고리 확인
    let selectedCategory = localStorage.getItem(
      `transaction_${transactionId}_category`
    );
    if (!selectedCategory) {
      selectedCategory = sessionStorage.getItem(
        `transaction_${transactionId}_category`
      );
    }
    if (!selectedCategory) {
      selectedCategory = sessionStorage.getItem(
        `selectedCategory_${transactionId}`
      );
    }

    if (selectedCategory && selectedCategory !== transaction.value.category) {
      transaction.value.category = selectedCategory;
      console.log("카테고리가 활성화 시 업데이트되었습니다:", selectedCategory);
    }
  }
});
</script>

<style scoped>
.transaction-detail-container {
  width: 390px;
  margin: 0 auto;
  background: #fff;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 상단 헤더 */
.diaryhome-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}

.diaryhome-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.diaryhome-back:hover {
  background: #f3f3f3;
}

.diaryhome-header-icons {
  display: flex;
  gap: 12px;
}

.diaryhome-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.diaryhome-icon-btn:hover {
  background: #f3f3f3;
}

/* 거래 요약 섹션 */
.transaction-summary {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.merchant-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.merchant-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.merchant-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.merchant-name {
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  line-height: 1.2;
}

.transaction-date {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.2;
}

.transaction-amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: #8b5cf6;
  line-height: 1.2;
}

/* 거래 상세 정보 */
.transaction-details {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
  min-width: 80px;
}

.detail-value {
  font-size: 0.875rem;
  color: #222;
  font-weight: 500;
  text-align: right;
  flex: 1;
  line-height: 1.4;
}

.detail-value.memo {
  word-break: break-all;
  white-space: pre-wrap;
}

.category-with-button {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.category-edit-btn {
  background: none;
  border: none;
  color: #8b5cf6;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
  flex-shrink: 0;
}

.category-edit-btn:hover {
  background: #f3f3f3;
}

.memo-with-button {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.memo-edit-btn {
  background: none;
  border: none;
  color: #8b5cf6;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
  flex-shrink: 0;
}

.memo-edit-btn:hover {
  background: #f3f3f3;
}

.detail-value.memo {
  cursor: pointer;
  transition: color 0.15s;
}

.detail-value.memo:hover {
  color: #8b5cf6;
}

/* 소비 피드백 섹션 */
.consumption-feedback {
  margin: 20px 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.feedback-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #222;
}

.sparkle-icons {
  display: flex;
  gap: 4px;
  color: #8b5cf6;
  font-size: 12px;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-content p {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
  margin: 0;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 350px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #222;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.modal-close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 20px;
}

.memo-textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.875rem;
  font-family: "Noto Sans KR", sans-serif;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.memo-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.memo-textarea::placeholder {
  color: #9ca3af;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #e5e7eb;
}

.modal-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: #8b5cf6;
  color: #fff;
}

.save-btn:hover {
  background: #7c3aed;
}

/* 반응형 디자인 */
@media (max-width: 390px) {
  .transaction-detail-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }

  .modal-content {
    width: 95%;
    margin: 0 10px;
  }
}
</style>
