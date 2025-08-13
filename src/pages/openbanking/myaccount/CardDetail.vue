<template>
  <div class="card-detail-container">
    <!-- 상단 헤더 -->
    <div class="account-header">
      <button class="account-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="account-title">{{ cardInfo.name }}</span>
      <div class="account-header-right">
        <button class="account-filter-btn" @click="openFilterModal">
          <font-awesome-icon :icon="['fas', 'sliders']" />
        </button>
      </div>
    </div>

    <!-- 카드 정보 섹션 -->
    <div class="card-info-section">
      <div class="card-info-header">
        <div class="card-bank-info">
          <img
            class="card-bank-logo"
            :src="getCardLogo(cardInfo.bank)"
            alt="카드로고"
          />
          <div class="card-bank-details">
            <div class="card-bank-name">{{ cardInfo.bank }}</div>
            <div class="card-type-badge">{{ cardInfo.type }}</div>
          </div>
        </div>
        <div
          class="card-balance"
          :class="{ negative: (cardInfo.amount || 0) < 0 }"
        >
          {{ (cardInfo.amount || 0).toLocaleString() }}원
        </div>
      </div>
      <div class="card-number">***-***-****</div>
    </div>

    <!-- 카드 사용 내역 -->
    <div class="card-transaction-section">
      <div class="card-transaction-header">
        <div class="card-transaction-title">
          카드 사용 내역 ({{ getPeriodDisplayName() }})
        </div>
        <div class="transaction-count">{{ filteredTransactions.length }}건</div>
      </div>
      <div class="card-transaction-list">
        <div v-if="filteredTransactions.length === 0" class="no-transactions">
          <p>해당 기간에 거래 내역이 없습니다.</p>
        </div>
        <div
          class="card-transaction-item"
          v-for="(transaction, index) in filteredTransactions"
          :key="`transaction-${index}`"
        >
          <div class="card-transaction-info">
            <div class="card-transaction-category">
              {{ transaction.description }}
            </div>
            <div class="card-transaction-date">
              {{ formatDate(transaction.date) }}
            </div>
          </div>
          <div
            class="card-transaction-amount"
            :class="transaction.type === '입금' ? 'income' : 'expense'"
          >
            {{ transaction.type === "입금" ? "+" : "-"
            }}{{ transaction.amount.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>

    <!-- 기간 필터 모달 -->
    <div v-if="showFilterModal" class="modal-overlay" @click="closeFilterModal">
      <div class="modal-content filter-modal" @click.stop>
        <div class="modal-header">
          <h3>기간 선택</h3>
          <button class="modal-close-btn" @click="closeFilterModal">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <div class="filter-options">
            <div class="filter-option">
              <input
                type="radio"
                id="all"
                name="period"
                value="all"
                v-model="selectedPeriod"
                @change="applyFilter"
              />
              <label for="all">전체 기간</label>
            </div>
            <div class="filter-option">
              <input
                type="radio"
                id="thisMonth"
                name="period"
                value="thisMonth"
                v-model="selectedPeriod"
                @change="applyFilter"
              />
              <label for="thisMonth">이번달</label>
            </div>
            <div class="filter-option">
              <input
                type="radio"
                id="lastMonth"
                name="period"
                value="lastMonth"
                v-model="selectedPeriod"
                @change="applyFilter"
              />
              <label for="lastMonth">지난달</label>
            </div>
            <div class="filter-option">
              <input
                type="radio"
                id="custom"
                name="period"
                value="custom"
                v-model="selectedPeriod"
                @change="applyFilter"
              />
              <label for="custom">직접 선택</label>
            </div>
          </div>

          <div v-if="selectedPeriod === 'custom'" class="custom-date-inputs">
            <div class="date-input-row">
              <div class="date-input-group">
                <label>시작일</label>
                <input
                  type="date"
                  v-model="startDate"
                  @change="applyFilter"
                  class="date-input"
                />
              </div>
              <div class="date-input-group">
                <label>종료일</label>
                <input
                  type="date"
                  v-model="endDate"
                  @change="applyFilter"
                  class="date-input"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeFilterModal">
            취소
          </button>
          <button class="modal-btn confirm-btn" @click="applyFilterAndClose">
            확인
          </button>
        </div>
      </div>
    </div>

    <!-- 하단 네비게이션 -->
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faTimes,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft, faTimes, faSliders);

// Transaction 데이터 import
import transactionData from "../Transaction_dummy.json";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.back();
};

// 카드 정보
const cardInfo = ref({
  name: "",
  bank: "",
  type: "",
  amount: 0,
  logo: "",
});

// 필터 관련 상태
const showFilterModal = ref(false);
const selectedPeriod = ref("all");
const startDate = ref("");
const endDate = ref("");

// 필터 모달 표시
const openFilterModal = () => {
  showFilterModal.value = true;
};

// 필터 모달 닫기
const closeFilterModal = () => {
  showFilterModal.value = false;
};

// 필터 적용
const applyFilter = () => {
  // 필터 로직은 computed에서 처리됨
  // 여기서는 모달을 닫거나 추가 로직이 필요한 경우에만 사용
};

// 필터 적용 후 모달 닫기
const applyFilterAndClose = () => {
  // 필터가 이미 computed에서 자동으로 적용되므로
  // 모달만 닫으면 됩니다
  closeFilterModal();
};

// 기간 표시 이름
const getPeriodDisplayName = () => {
  switch (selectedPeriod.value) {
    case "thisMonth":
      return "이번달";
    case "lastMonth":
      return "지난달";
    case "all":
      return "전체";
    case "custom":
      return "직접 선택";
    default:
      return "전체";
  }
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}.${day}`;
};

// 필터링된 거래 내역
const filteredTransactions = computed(() => {
  if (!transactionData?.transactions || !cardInfo.value.bank) return [];

  // 카드 거래 내역 필터링 (카드 타입이 포함된 계좌명 찾기)
  let filteredTransactions = transactionData.transactions.filter(
    (transaction) => {
      // 은행이 일치하는지 확인
      if (transaction.bank !== cardInfo.value.bank) return false;

      // 카드 타입이 계좌명에 포함되어 있는지 확인
      const accountName = transaction.account.toLowerCase();
      const cardType = cardInfo.value.type.toLowerCase();

      // 카드 관련 계좌명 패턴 매칭
      const cardPatterns = ["카드", "card", "체크", "신용", "debit", "credit"];

      // 카드 타입이 직접 포함되어 있거나, 카드 관련 패턴이 포함되어 있는지 확인
      return (
        accountName.includes(cardType) ||
        cardPatterns.some((pattern) => accountName.includes(pattern))
      );
    }
  );

  // 기간 필터링 적용
  if (selectedPeriod.value === "all") {
    return filteredTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  const today = new Date();
  let startDateFilter, endDateFilter;

  switch (selectedPeriod.value) {
    case "thisMonth":
      startDateFilter = new Date(today.getFullYear(), today.getMonth(), 1);
      endDateFilter = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "lastMonth":
      startDateFilter = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDateFilter = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "custom":
      if (startDate.value && endDate.value) {
        startDateFilter = new Date(startDate.value);
        endDateFilter = new Date(endDate.value);
        // 종료일을 해당 날짜의 마지막 시간으로 설정
        endDateFilter.setHours(23, 59, 59, 999);
      } else {
        return filteredTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }
      break;
    default:
      return filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
  }

  // 날짜 범위로 필터링
  const filteredByDate = filteredTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate >= startDateFilter && transactionDate <= endDateFilter
    );
  });

  return filteredByDate.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 카드 로고 동적 로딩
const getCardLogo = (bankName) => {
  // 은행명을 카드 로고 파일명으로 매핑
  const cardLogoMap = {
    신한은행: "신한카드.png",
    토스뱅크: "bc카드.png",
    하나은행: "하나카드.png",
    NH농협은행: "농협카드.png",
    우리은행: "우리카드.png",
    IBK기업은행: "bc카드.png",
    KB국민은행: "국민카드.png",
    카카오뱅크: "bc카드.png",
    케이뱅크: "bc카드.png",
    SC제일은행: "bc카드.png",
    수협은행: "수협카드.png",
    경남은행: "bc카드.png",
    부산은행: "bc카드.png",
    광주은행: "bc카드.png",
    전북은행: "bc카드.png",
    제주은행: "bc카드.png",
  };

  const cardLogoName = cardLogoMap[bankName] || "bc카드.png";

  try {
    return new URL(`../../../assets/card_logo/${cardLogoName}`, import.meta.url)
      .href;
  } catch (error) {
    // 로고를 찾을 수 없는 경우 기본 로고 반환
    return new URL(`../../../assets/card_logo/bc카드.png`, import.meta.url)
      .href;
  }
};

// 카드 정보 초기화
onMounted(() => {
  // 라우트 파라미터에서 카드 데이터 가져오기
  if (route.params.cardData) {
    try {
      cardInfo.value = JSON.parse(route.params.cardData);
    } catch (error) {
      console.error("카드 데이터 파싱 오류:", error);
    }
  }
});
</script>

<style scoped>
.card-detail-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 120px;
  padding-top: 56px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  height: 100vh;
}

.card-detail-container::-webkit-scrollbar {
  display: none;
}

.account-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f8fa;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
}

.account-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.account-back:hover {
  background: #f3f3f3;
}

.account-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.account-header-right {
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-filter-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.account-filter-btn:hover {
  background: #f3f3f3;
}

/* 카드 정보 섹션 */
.card-info-section {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
}

.card-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-bank-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-bank-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ececec;
}

.card-bank-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-bank-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.card-type-badge {
  background: #ece9fd;
  color: #4318d1;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.card-balance {
  font-size: 1.3rem;
  font-weight: 700;
  color: #4318d1;
}

.card-balance.negative {
  color: #4318d1;
}

.card-number {
  font-size: 0.9rem;
  color: #888;
  font-family: monospace;
}

/* 카드 사용 내역 스타일 */
.card-transaction-section {
  background: #fff;
  margin: 16px;
  border-radius: 18px;
  padding: 20px;
}

.card-transaction-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-transaction-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.transaction-count {
  font-size: 0.9rem;
  color: #888;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}

.card-transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.card-transaction-item:last-child {
  border-bottom: none;
}

.card-transaction-info {
  flex: 1;
}

.card-transaction-category {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

.card-transaction-date {
  font-size: 0.85rem;
  color: #888;
}

.card-transaction-amount {
  font-size: 1rem;
  font-weight: 600;
}

.card-transaction-amount.income {
  color: #059669;
}

.card-transaction-amount.expense {
  color: #dc2626;
}

/* 필터 모달 스타일 */
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
  max-width: 400px;
  overflow: hidden;
}

.filter-modal {
  max-width: 350px;
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

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.filter-option:hover {
  background: #f9fafb;
}

.filter-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #4318d1;
}

.filter-option label {
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  flex: 1;
}

.custom-date-inputs {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.date-input-row {
  display: flex;
  gap: 12px;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.date-input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #222;
  background: #fff;
}

.date-input:focus {
  outline: none;
  border-color: #4318d1;
  box-shadow: 0 0 0 3px rgba(67, 24, 209, 0.1);
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

.confirm-btn {
  background: #4318d1;
  color: #fff;
}

.confirm-btn:hover {
  background: #3b16b8;
}

.no-transactions {
  text-align: center;
  padding: 40px 20px;
  color: #888;
  font-size: 0.9rem;
}

.no-transactions p {
  margin: 0;
}

@media (max-width: 430px) {
  .card-detail-container {
    width: 100vw;
  }

  .modal-content {
    width: 95%;
    margin: 0 10px;
  }

  .date-input-row {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
