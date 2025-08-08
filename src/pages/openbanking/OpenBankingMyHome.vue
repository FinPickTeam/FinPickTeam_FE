<template>
  <div class="myhome-scroll-container">
    <!-- 상단 헤더 -->
    <div class="obmyhome-header">
      <button class="obmyhome-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <div class="obmyhome-header-icons">
        <button class="obmyhome-icon-btn" @click="goToDictionary">
          <font-awesome-icon :icon="['fas', 'search']" />
        </button>
        <button class="obmyhome-icon-btn" @click="goToAddAccount">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
      </div>
    </div>

    <!-- 자산 정보 카드 -->
    <div class="obmyhome-asset-card">
      <div class="obmyhome-asset-row">
        <span class="obmyhome-asset-title">총 자산</span>
        <div class="obmyhome-asset-actions">
          <button class="obmyhome-refresh-btn">
            <i class="fa-solid fa-arrow-rotate-left"></i>
          </button>
          <span class="obmyhome-asset-time">{{ refreshTimeText }}</span>
        </div>
      </div>
      <div class="obmyhome-asset-amount" :class="{ negative: totalAssets < 0 }">
        {{ totalAssets.toLocaleString()
        }}<span class="obmyhome-asset-won">원</span>
      </div>
      <div class="obmyhome-asset-diff">
        <font-awesome-icon
          :icon="['fas', 'triangle-exclamation']"
          class="obmyhome-asset-diff-icon"
        />
        <span class="obmyhome-asset-diff-text">{{ monthlyChangeText }}</span>
      </div>
    </div>

    <!-- 계좌 리스트 -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">계좌</span>
        <button class="obmyhome-section-more" @click="goToAccountList">
          <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>
      <div class="obmyhome-account-list">
        <div
          class="obmyhome-account-item"
          v-for="(acc, idx) in accounts"
          :key="idx"
        >
          <img class="obmyhome-bank-logo" :src="acc.logo" alt="은행로고" />
          <div class="obmyhome-account-info">
            <div class="obmyhome-account-name">{{ acc.name }}</div>
            <div class="obmyhome-account-number">***-***-****</div>
          </div>
          <div
            class="obmyhome-account-balance"
            :class="{ negative: acc.balance < 0 }"
          >
            {{ acc.balance.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>

    <!-- 카드 정보 -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">카드</span>
        <button class="obmyhome-section-more" @click="goToCardList">
          <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>
      <div class="obmyhome-section-subtitle-row">
        <span class="obmyhome-section-subtitle">이번달 소비금액</span>
      </div>
      <div class="obmyhome-card-list">
        <div class="obmyhome-card-item" v-for="(card, idx) in cards" :key="idx">
          <div class="obmyhome-card-content">
            <img class="obmyhome-bank-logo" :src="card.logo" alt="은행로고" />
            <div class="obmyhome-card-info">
              <div class="obmyhome-card-name">{{ card.name }}</div>
              <div class="obmyhome-card-number">***-***-****</div>
            </div>
            <div
              class="obmyhome-card-amount"
              :class="{ negative: card.amount < 0 }"
            >
              {{ card.amount.toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>
      <div class="obmyhome-report-buttons">
        <button class="obmyhome-report-btn daily" @click="goToDailyReport">
          일간 리포트 보기
        </button>
        <button class="obmyhome-report-btn monthly" @click="goToMonthlyReport">
          월간 리포트 보기
        </button>
      </div>
    </div>

    <!-- 하단 네비게이션 -->
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faSearch,
  faPlus,
  faTriangleExclamation,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faSearch, faPlus, faTriangleExclamation, faAngleRight);

// 은행 로고 이미지 import
import kakaoLogo from "@/assets/bank_logo/카카오뱅크.png";

// Transaction 데이터 import
import transactionData from "./Transaction_dummy.json";

const router = useRouter();

// Transaction_dummy.json에서 계좌 정보 추출
const extractAccountsFromTransactions = () => {
  if (!transactionData?.transactions) return [];

  const accountMap = new Map();

  // 초기 자산 설정
  const initialBalance = transactionData.initialAssets || 0;

  transactionData.transactions.forEach((transaction) => {
    const accountKey = `${transaction.bank}-${transaction.account}`;

    if (!accountMap.has(accountKey)) {
      // 초기 잔액 설정 (첫 번째 계좌에만)
      const isFirstAccount = accountMap.size === 0;
      const initialAccountBalance = isFirstAccount ? initialBalance : 0;

      accountMap.set(accountKey, {
        name: `${transaction.bank} ${transaction.account}`,
        balance: initialAccountBalance,
        bank: transaction.bank,
        logo: getBankLogo(transaction.logo),
      });
    }

    // 잔액 계산 (입금은 +, 출금은 -)
    const currentAccount = accountMap.get(accountKey);
    if (transaction.type === "입금") {
      currentAccount.balance += transaction.amount;
    } else {
      currentAccount.balance -= transaction.amount;
    }
  });

  return Array.from(accountMap.values()).slice(0, 2);
};

// Transaction_dummy.json에서 카드 정보 추출 (이번달 소비내역)
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

  return Array.from(cardMap.values()).slice(0, 2);
};

// 은행 로고 동적 로딩
const getBankLogo = (logoName) => {
  try {
    return new URL(`../../assets/bank_logo/${logoName}`, import.meta.url).href;
  } catch (error) {
    // 로고를 찾을 수 없는 경우 기본 로고 반환
    return kakaoLogo;
  }
};

const accounts = ref([]);
const cards = ref([]);

// 계좌 및 카드 데이터 초기화
onMounted(() => {
  accounts.value = extractAccountsFromTransactions();
  cards.value = extractCardsFromTransactions();
});

const goToDailyReport = () => {
  router.push("/openbanking/daily-report");
};

const goToMonthlyReport = () => {
  router.push("/openbanking/monthly-report");
};

const goToAddAccount = () => {
  router.push("/openbanking/account-link-select");
};

const goToCardList = () => {
  router.push("/openbanking/card-list");
};

const goToAccountList = () => {
  router.push("/openbanking/account-list");
};

// 초기 재산 - Transaction_dummy.json에서 불러오기
const initialAssets = computed(() => {
  return transactionData?.initialAssets || 0;
});

// 총 입금 계산 (당일까지)
const totalIncome = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // 오늘 마지막 시간으로 설정

  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (t.type || "").trim() === "입금" && tDate <= today;
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 총 출금 계산 (당일까지)
const totalExpense = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // 오늘 마지막 시간으로 설정

  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (t.type || "").trim() === "출금" && tDate <= today;
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 현재 총 재산 계산
const totalAssets = computed(() => {
  return initialAssets.value + totalIncome.value - totalExpense.value;
});

// 갱신 시간 텍스트 (시간만 표시)
const refreshTimeText = computed(() => {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes} 갱신`;
});

// 이번 달 입금 계산
const currentMonthIncome = computed(() => {
  const today = new Date();
  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === today.getFullYear() &&
            tDate.getMonth() === today.getMonth() &&
            (t.type || "").trim() === "입금"
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 이번 달 출금 계산
const currentMonthExpense = computed(() => {
  const today = new Date();
  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === today.getFullYear() &&
            tDate.getMonth() === today.getMonth() &&
            (t.type || "").trim() === "출금"
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 이번 달 순변동
const currentMonthNetChange = computed(() => {
  return currentMonthIncome.value - currentMonthExpense.value;
});

// 지난 달 입금 계산
const prevMonthIncome = computed(() => {
  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const prevYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === prevYear &&
            tDate.getMonth() === prevMonth &&
            (t.type || "").trim() === "입금"
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 지난 달 출금 계산
const prevMonthExpense = computed(() => {
  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const prevYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === prevYear &&
            tDate.getMonth() === prevMonth &&
            (t.type || "").trim() === "출금"
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 지난 달 순변동
const prevMonthNetChange = computed(() => {
  return prevMonthIncome.value - prevMonthExpense.value;
});

// 전월 대비 증감률 계산
const monthlyChangePercent = computed(() => {
  if (prevMonthNetChange.value === 0) {
    return currentMonthNetChange.value === 0
      ? 0
      : currentMonthNetChange.value > 0
      ? 100
      : -100;
  }
  return (
    ((currentMonthNetChange.value - prevMonthNetChange.value) /
      Math.abs(prevMonthNetChange.value)) *
    100
  );
});

// 전월 대비 증감 텍스트
const monthlyChangeText = computed(() => {
  const percent = monthlyChangePercent.value;
  if (percent > 0) {
    return `전월 대비 +${percent.toFixed(1)}% 증가`;
  } else if (percent < 0) {
    return `전월 대비 ${percent.toFixed(1)}% 감소`;
  } else {
    return "전월 대비 0% 변화없음";
  }
});

const goBack = () => {
  router.push("/");
};

const goToDictionary = () => {
  router.push("/dictionary");
};
</script>

<style scoped>
.myhome-scroll-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f3f4f6;
  min-height: 844px;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  padding-top: 55px;
  padding-bottom: 0;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.myhome-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.obmyhome-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f4f6;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
}
.obmyhome-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}
.obmyhome-back:hover {
  background: #f3f3f3;
}
.obmyhome-header-icons {
  display: flex;
  gap: 12px;
}
.obmyhome-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}
.obmyhome-icon-btn:hover {
  background: #f3f3f3;
}

.obmyhome-asset-card {
  background: #fff;
  border-radius: 18px;
  margin: 12px 16px 16px 16px;
  padding: 20px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.obmyhome-asset-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.obmyhome-asset-title {
  font-size: 1.05rem;
  color: #888;
  font-weight: 500;
}
.obmyhome-asset-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.obmyhome-refresh-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #bdbdbd;
  cursor: default;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.obmyhome-asset-time {
  font-size: 0.85rem;
  color: #bdbdbd;
}
.obmyhome-asset-amount {
  font-size: 2.1rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 2px;
}

.obmyhome-asset-amount.negative {
  color: #e11d48;
}
.obmyhome-asset-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 2px;
}
.obmyhome-asset-diff {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.95rem;
  color: #e11d48;
  font-weight: 500;
}
.obmyhome-asset-diff-icon {
  color: #e11d48;
  font-size: 1rem;
}

.obmyhome-section-card {
  background: #fff;
  border-radius: 18px;
  margin: 0 16px 12px 16px;
  padding: 16px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.obmyhome-section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.obmyhome-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.obmyhome-section-subtitle-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.obmyhome-section-subtitle {
  font-size: 0.85rem;
  color: #888;
  font-weight: 400;
}
.obmyhome-section-more {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #bdbdbd;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.obmyhome-section-more:hover {
  background: #f3f3f3;
}
.obmyhome-account-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border-bottom: 1px solid #ececec;
}

.obmyhome-account-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #ececec;
  transition: background-color 0.15s;
}

.obmyhome-account-item:hover {
  background: #f8f9fa;
}

.obmyhome-account-item:last-child {
  border-bottom: none;
}

.obmyhome-bank-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  object-fit: cover;
  border: 1px solid #ececec;
  flex-shrink: 0;
}

.obmyhome-account-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.obmyhome-account-name {
  font-size: 0.95rem;
  color: #222;
  font-weight: 600;
}

.obmyhome-account-number {
  font-size: 0.85rem;
  color: #888;
  font-weight: 400;
}

.obmyhome-account-balance {
  font-size: 1.05rem;
  color: #4318d1;
  font-weight: 700;
  text-align: right;
}

.obmyhome-account-balance.negative {
  color: #e11d48;
}

.obmyhome-card-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border-bottom: 1px solid #ececec;
}

.obmyhome-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-bottom: 1px solid #ececec;
  transition: background-color 0.15s;
}

.obmyhome-card-item:hover {
  background: #f8f9fa;
}

.obmyhome-card-item:last-child {
  border-bottom: none;
}

.obmyhome-card-name {
  font-size: 0.95rem;
  color: #222;
  font-weight: 600;
}

.obmyhome-card-number {
  font-size: 0.85rem;
  color: #888;
  font-weight: 400;
}

.obmyhome-card-amount {
  font-size: 1.05rem;
  color: #4318d1;
  font-weight: 700;
  text-align: right;
  flex-shrink: 0;
  min-width: fit-content;
}

.obmyhome-card-amount.negative {
  color: #4318d1;
}

.obmyhome-card-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.obmyhome-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.obmyhome-card-type {
  font-size: 0.95rem;
  color: #222;
  font-weight: 600;
}

.obmyhome-spend-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.obmyhome-spend-table th,
.obmyhome-spend-table td {
  padding: 7px 4px;
  text-align: left;
  font-size: 0.98rem;
}
.obmyhome-spend-table th {
  color: #888;
  font-weight: 500;
  border-bottom: 1px solid #ececec;
}
.obmyhome-spend-table td {
  color: #222;
  font-weight: 500;
}
.obmyhome-report-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.obmyhome-report-btn {
  flex: 1;
  background: #ece9fd;
  color: #4318d1;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.obmyhome-report-btn:hover {
  background: #e0d7fa;
}

.obmyhome-report-btn.daily {
  background: #f0f9ff;
  color: #0369a1;
}

.obmyhome-report-btn.daily:hover {
  background: #e0f2fe;
}

.obmyhome-report-btn.monthly {
  background: #ece9fd;
  color: #4318d1;
}

.obmyhome-report-btn.monthly:hover {
  background: #e0d7fa;
}

@media (max-width: 430px) {
  .obmyhome-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
