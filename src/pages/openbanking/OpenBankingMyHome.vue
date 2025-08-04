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
      <div class="obmyhome-asset-amount">
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
          <div class="obmyhome-account-balance">
            {{ acc.balance.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>

    <!-- 소비 정보 -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">카드</span>
        <button class="obmyhome-section-more" @click="goToCardList">
          <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>
      <table class="obmyhome-spend-table">
        <thead>
          <tr>
            <th>최대 소비</th>
            <th>카테고리</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>7일 소비</td>
            <td>식비</td>
            <td>120,000</td>
          </tr>
        </tbody>
      </table>
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
const goToDictionary = () => {
  router.push("/dictionary");
};
import { ref, computed } from "vue";
import Navbar from "../../components/Navbar.vue";
import { useRouter } from "vue-router";
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
const goBack = () => {
  router.push("/");
};

const accounts = ref([
  {
    logo: kakaoLogo,
    name: "KB IT’s Your Life 6개월 정기예금",
    balance: 250000,
  },
  {
    logo: kakaoLogo,
    name: "KB IT’s Your Life 6개월 정기예금",
    balance: 250000,
  },
]);

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
</script>

<style scoped>
.myhome-scroll-container {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.myhome-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.obmyhome-container {
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #f7f8fa;
  font-family: "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  padding-bottom: 0;
}
.obmyhome-header {
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
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 18px 16px 16px 16px;
  padding: 22px 20px 18px 20px;
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
  font-size: 1rem;
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
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 0 16px 16px 16px;
  padding: 18px 20px 18px 20px;
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
  padding: 16px 18px;
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
  margin-top: 6px;
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
