<template>
  <div class="card-list-container">
    <!-- 상단 헤더 -->
    <div class="account-header">
      <button class="account-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="account-title">내 카드</span>
      <div class="account-header-right">
        <button class="account-trash-btn" @click="toggleDeleteMode">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </div>
    </div>

    <!-- 카드 사용 내역 총량 -->
    <div class="card-total-section">
      <div class="card-total-header">
        <div class="card-total-title">카드 사용 내역</div>
        <button class="card-filter-btn" @click="openFilterModal">
          <font-awesome-icon :icon="['fas', 'sliders']" />
        </button>
      </div>
      <div class="card-total-amount">
        {{ cardTotalAmount.toLocaleString()
        }}<span class="card-total-won">원</span>
      </div>
    </div>

    <!-- 카드 리스트 -->
    <div class="card-list-section">
      <div class="card-list">
        <div
          class="card-item"
          :class="{
            'card-item-selected': selectedCards.includes(card),
          }"
          v-for="(card, index) in cards"
          :key="`card-${index}`"
          @click="handleCardClick(card)"
        >
          <div class="card-item-header">
            <div class="card-bank-info">
              <img class="card-bank-logo" :src="card.logo" alt="은행로고" />
              <div class="card-bank-name">{{ card.bank }}</div>
              <div class="card-type-badge">
                {{ card.type }}
              </div>
            </div>
            <div class="card-balance">{{ card.amount.toLocaleString() }}원</div>
          </div>
          <div class="card-item-details">
            <div class="card-name">{{ card.name }}</div>
            <div class="card-number">***-***-****</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 카드 사용 내역 -->
    <div class="card-transaction-section">
      <div class="card-transaction-title">카드 사용 내역</div>
      <div class="card-transaction-list">
        <div
          class="card-transaction-item"
          v-for="(transaction, index) in filteredCardTransactions"
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
          <button class="modal-btn confirm-btn" @click="closeFilterModal">
            확인
          </button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>카드 삭제</h3>
          <button class="modal-close-btn" @click="closeDeleteModal">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <p>{{ selectedCards.length }}개의 카드를 삭제하시겠습니까?</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeDeleteModal">
            취소
          </button>
          <button class="modal-btn delete-btn" @click="confirmDelete">
            삭제
          </button>
        </div>
      </div>
    </div>

    <!-- 삭제 버튼 (하단 고정) -->
    <div v-if="isDeleteMode" class="delete-button-container">
      <button class="delete-button" @click="showDeleteConfirm">
        {{ selectedCards.length }}개 카드 삭제
      </button>
    </div>

    <!-- 하단 네비게이션 -->
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faTrash,
  faTimes,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft, faTrash, faTimes, faSliders);

// Transaction 데이터 import
import transactionData from "../Transaction_dummy.json";

const router = useRouter();

const goBack = () => {
  router.back();
};

// 삭제 모드 토글
const toggleDeleteMode = () => {
  isDeleteMode.value = !isDeleteMode.value;
  if (!isDeleteMode.value) {
    selectedCards.value = [];
  }
};

// 카드 클릭 처리
const handleCardClick = (card) => {
  if (isDeleteMode.value) {
    const index = selectedCards.value.indexOf(card);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    } else {
      selectedCards.value.push(card);
    }
  }
};

// 삭제 확인 모달 표시
const showDeleteConfirm = () => {
  if (selectedCards.value.length > 0) {
    showDeleteModal.value = true;
  }
};

// 삭제 확인 모달 닫기
const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

// 카드 삭제 확인
const confirmDelete = () => {
  // 선택된 카드들을 cards 배열에서 제거
  selectedCards.value.forEach((card) => {
    const index = cards.value.indexOf(card);
    if (index > -1) {
      cards.value.splice(index, 1);
    }
  });

  // 삭제 모드 종료
  isDeleteMode.value = false;
  selectedCards.value = [];
  showDeleteModal.value = false;
};

// 카드 데이터
const cards = ref([]);

// 삭제 모드 관련 상태
const isDeleteMode = ref(false);
const selectedCards = ref([]);
const showDeleteModal = ref(false);

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
};

// 카드 사용 내역 총량 계산 (필터 적용)
const cardTotalAmount = computed(() => {
  if (!transactionData?.transactions) return 0;

  const filteredTransactions = getFilteredTransactions();

  return filteredTransactions.reduce((total, transaction) => {
    // 출금만 합산 (카드 사용 금액)
    if (transaction.type === "출금") {
      return total + transaction.amount;
    }
    return total;
  }, 0);
});

// 필터링된 카드 거래 내역
const filteredCardTransactions = computed(() => {
  if (!transactionData?.transactions) return [];

  const filteredTransactions = getFilteredTransactions();

  return filteredTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
});

// 필터링된 거래 내역 가져오기
const getFilteredTransactions = () => {
  if (!transactionData?.transactions) return [];

  const cardTransactions = transactionData.transactions.filter(
    (transaction) =>
      transaction.account.includes("체크카드") ||
      transaction.account.includes("신용카드")
  );

  if (selectedPeriod.value === "all") {
    return cardTransactions;
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
      } else {
        return cardTransactions;
      }
      break;
    default:
      return cardTransactions;
  }

  return cardTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate >= startDateFilter && transactionDate <= endDateFilter
    );
  });
};

// 카드 거래 내역 (최근 10개) - 기존 로직 유지
const cardTransactions = computed(() => {
  if (!transactionData?.transactions) return [];

  return transactionData.transactions
    .filter(
      (transaction) =>
        transaction.account.includes("체크카드") ||
        transaction.account.includes("신용카드")
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
});

// Transaction_dummy.json에서 카드 정보 추출
const extractCardsFromTransactions = () => {
  if (!transactionData?.transactions) return [];

  const cardMap = new Map();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  transactionData.transactions.forEach((transaction) => {
    // 카드 거래만 필터링 (체크카드, 신용카드)
    if (
      transaction.account.includes("체크카드") ||
      transaction.account.includes("신용카드")
    ) {
      // 이번달 거래만 필터링
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === currentMonth
      ) {
        const cardKey = `${transaction.bank}-${transaction.account}`;

        if (!cardMap.has(cardKey)) {
          cardMap.set(cardKey, {
            name: `${transaction.bank} ${transaction.account}`,
            amount: 0,
            bank: transaction.bank,
            type: transaction.account.includes("체크카드")
              ? "체크카드"
              : "신용카드",
            logo: getBankLogo(transaction.logo),
          });
        }

        // 카드 사용 금액 계산 (출금만)
        const currentCard = cardMap.get(cardKey);
        if (transaction.type === "출금") {
          currentCard.amount += transaction.amount;
        }
      }
    }
  });

  return Array.from(cardMap.values());
};

// 은행 로고 동적 로딩
const getBankLogo = (logoName) => {
  try {
    return new URL(`../../../assets/bank_logo/${logoName}`, import.meta.url)
      .href;
  } catch (error) {
    // 로고를 찾을 수 없는 경우 기본 로고 반환
    return new URL(`../../../assets/bank_logo/카카오뱅크.png`, import.meta.url)
      .href;
  }
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}.${day}`;
};

// 카드 데이터 초기화
onMounted(() => {
  cards.value = extractCardsFromTransactions();
});
</script>

<style scoped>
.card-list-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 120px;
}

.account-header {
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

.account-trash-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.account-trash-btn:hover {
  background: #f3f3f3;
  color: #dc2626;
}

/* 카드 사용 내역 총량 스타일 */
.card-total-section {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.card-total-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-total-title {
  font-size: 1rem;
  color: #888;
  font-weight: 500;
}

.card-filter-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #4318d1;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.card-filter-btn:hover {
  background: #f3f3f3;
}

.card-total-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #4318d1;
}

.card-total-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 4px;
}

/* 카드 리스트 스타일 */
.card-list-section {
  margin: 0 16px 16px 16px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-item {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  cursor: pointer;
  transition: all 0.15s;
  border: 2px solid transparent;
}

.card-item:hover {
  box-shadow: 0 4px 12px rgba(67, 24, 209, 0.12);
}

.card-item-selected {
  border-color: #10b981;
  background: #f0fdf4;
}

.card-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-bank-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-bank-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ececec;
}

.card-bank-name {
  font-size: 1rem;
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
}

.card-balance {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
}

.card-item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-name {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.card-number {
  font-size: 0.85rem;
  color: #888;
}

/* 카드 사용 내역 스타일 */
.card-transaction-section {
  background: #fff;
  margin: 16px;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.card-transaction-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
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
.filter-modal {
  max-width: 400px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.filter-option:hover {
  background: #f9fafb;
}

.filter-option input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.filter-option label {
  font-size: 0.95rem;
  color: #222;
  cursor: pointer;
  flex: 1;
}

.custom-date-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.date-input-row {
  display: flex;
  gap: 16px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #222;
}

.date-input {
  padding: 12px;
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

.modal-body p {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
  text-align: center;
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

.delete-btn {
  background: #dc2626;
  color: #fff;
}

.delete-btn:hover {
  background: #b91c1c;
}

/* 삭제 버튼 컨테이너 */
.delete-button-container {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0 16px;
  width: 100%;
  max-width: 390px;
  box-sizing: border-box;
}

.delete-button {
  width: 100%;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.delete-button:hover {
  background: #b91c1c;
}

@media (max-width: 430px) {
  .card-list-container {
    width: 100vw;
  }

  .modal-content {
    width: 95%;
    margin: 0 10px;
  }
}
</style>
