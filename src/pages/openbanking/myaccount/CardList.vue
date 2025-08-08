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
        <div class="card-total-title">이번달 카드 사용 내역</div>
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
            <div class="card-balance" :class="{ negative: card.amount < 0 }">
              {{ card.amount.toLocaleString() }}원
            </div>
          </div>
          <div class="card-item-details">
            <div class="card-name">{{ card.name }}</div>
            <div class="card-number">***-***-****</div>
          </div>
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
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft, faTrash, faTimes);

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
  } else {
    // 카드 상세 페이지로 라우팅
    router.push({
      name: "CardDetail",
      params: {
        cardId: `${card.bank}-${card.type}`,
        cardData: JSON.stringify(card),
      },
    });
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

// 카드 사용 내역 총량 계산 (당월만) - 삭제된 카드 제외
const cardTotalAmount = computed(() => {
  if (!transactionData?.transactions) return 0;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const thisMonthTransactions = transactionData.transactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.date);
      const isCardTransaction =
        transaction.account.includes("체크카드") ||
        transaction.account.includes("신용카드");
      const isThisMonth =
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === currentMonth;

      if (!isCardTransaction || !isThisMonth) return false;

      // 삭제된 카드의 거래인지 확인 - 현재 존재하는 카드들과 매칭
      const transactionCardKey = `${transaction.bank}-${transaction.account}`;
      const isExistingCard = cards.value.some((card) => {
        const cardKey = `${card.bank}-${card.name.replace(
          card.bank + " ",
          ""
        )}`;
        return cardKey === transactionCardKey;
      });

      return isExistingCard;
    }
  );

  return thisMonthTransactions.reduce((total, transaction) => {
    // 출금만 합산 (카드 사용 금액)
    if (transaction.type === "출금") {
      return total + transaction.amount;
    }
    return total;
  }, 0);
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
            logo: getCardLogo(transaction.bank),
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
  padding-top: 56px;
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
  cursor: pointer;
  transition: all 0.15s;
  border: 2px solid transparent;
}

.card-item:hover {
  /* 그림자 효과 제거 */
}

.card-item-selected {
  border-color: #dc2626;
  background: #fef2f2;
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
  color: #4318d1;
}

.card-balance.negative {
  color: #4318d1;
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
