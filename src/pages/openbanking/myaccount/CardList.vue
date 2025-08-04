<template>
  <div class="card-list-container">
    <!-- 상단 헤더 -->
    <div class="card-header">
      <button class="card-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="card-title">카드 소비 내역</span>
      <div class="card-header-right"></div>
    </div>

    <!-- 총 자산 카드 -->
    <div class="card-total-card">
      <div class="card-total-title">총 자산</div>
      <div class="card-total-amount">
        {{ totalAssets.toLocaleString() }}<span class="card-total-won">원</span>
      </div>
    </div>

    <!-- 계좌 카테고리 -->
    <div class="card-categories">
      <!-- 입출금 계좌 -->
      <div class="card-category-section">
        <div class="card-category-title">입출금 계좌</div>
        <div class="card-account-list">
          <div
            class="card-account-item"
            v-for="(account, index) in depositAccounts"
            :key="`deposit-${index}`"
          >
            <div class="card-account-info">
              <div class="card-account-name">{{ account.name }}</div>
              <div class="card-account-number">{{ account.accountNumber }}</div>
            </div>
            <div class="card-account-balance">
              {{ account.balance.toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>

      <!-- 저축 계좌 -->
      <div class="card-category-section">
        <div class="card-category-title">저축 계좌</div>
        <div class="card-account-list">
          <div
            class="card-account-item"
            v-for="(account, index) in savingsAccounts"
            :key="`savings-${index}`"
          >
            <div class="card-account-info">
              <div class="card-account-name">{{ account.name }}</div>
              <div class="card-account-number">{{ account.accountNumber }}</div>
            </div>
            <div class="card-account-balance">
              {{ account.balance.toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>

      <!-- 투자 계좌 -->
      <div class="card-category-section">
        <div class="card-category-title">투자 계좌</div>
        <div class="card-account-list">
          <div
            class="card-account-item"
            v-for="(account, index) in investmentAccounts"
            :key="`investment-${index}`"
          >
            <div class="card-account-info">
              <div class="card-account-name">{{ account.name }}</div>
              <div class="card-account-number">{{ account.accountNumber }}</div>
            </div>
            <div class="card-account-balance">
              {{ account.balance.toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 거래 내역 -->
    <div class="card-recent-section">
      <div class="card-recent-title">최근 거래 내역</div>
      <div class="card-transaction-list">
        <div
          class="card-transaction-item"
          v-for="(transaction, index) in recentTransactions"
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

    <!-- 하단 네비게이션 -->
    <Navbar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft);

// Transaction 데이터 import
import transactionData from "../Transaction_dummy.json";

const router = useRouter();

const goBack = () => {
  router.back();
};

// 계좌 데이터
const accounts = ref([]);

// Transaction_dummy.json에서 계좌 정보 추출
const extractAccountsFromTransactions = () => {
  if (!transactionData?.transactions) return [];

  const accountMap = new Map();

  // 초기 자산 설정
  const initialBalance = transactionData.initialAssets || 0;

  transactionData.transactions.forEach((transaction) => {
    const accountKey = `${transaction.bank}-${transaction.account}`;

    if (!accountMap.has(accountKey)) {
      // 계좌 타입 판별
      let accountType = "입출금";
      if (transaction.account.includes("투자")) {
        accountType = "투자";
      } else if (
        transaction.account.includes("저축") ||
        transaction.account.includes("예금")
      ) {
        accountType = "저축";
      }

      // 초기 잔액 설정 (첫 번째 계좌에만)
      const isFirstAccount = accountMap.size === 0;
      const initialAccountBalance = isFirstAccount ? initialBalance : 0;

      accountMap.set(accountKey, {
        name: `${transaction.bank} ${transaction.account}`,
        accountNumber: generateAccountNumber(),
        balance: initialAccountBalance,
        type: accountType,
        bank: transaction.bank,
        logo: transaction.logo,
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

  return Array.from(accountMap.values());
};

// 계좌번호 생성 (더미 데이터용)
const generateAccountNumber = () => {
  const numbers = Math.floor(Math.random() * 900000000) + 100000000;
  return numbers.toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
};

// 총 자산 계산
const totalAssets = computed(() => {
  return accounts.value.reduce((total, account) => total + account.balance, 0);
});

// 입출금 계좌 필터링
const depositAccounts = computed(() => {
  return accounts.value.filter((account) => account.type === "입출금");
});

// 저축 계좌 필터링
const savingsAccounts = computed(() => {
  return accounts.value.filter((account) => account.type === "저축");
});

// 투자 계좌 필터링
const investmentAccounts = computed(() => {
  return accounts.value.filter((account) => account.type === "투자");
});

// 최근 거래 내역 (최근 5개)
const recentTransactions = computed(() => {
  if (!transactionData?.transactions) return [];

  return transactionData.transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}.${day}`;
};

// 계좌 데이터 초기화
onMounted(() => {
  accounts.value = extractAccountsFromTransactions();
});
</script>

<style scoped>
.card-list-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #ececec;
  position: sticky;
  top: 0;
  z-index: 100;
}

.card-back {
  background: none;
  border: none;
  font-size: 20px;
  color: #222;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.card-back:hover {
  background: #f3f3f3;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.card-header-right {
  width: 36px;
}

.card-total-card {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.card-total-title {
  font-size: 1rem;
  color: #888;
  font-weight: 500;
  margin-bottom: 8px;
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

.card-categories {
  margin: 0 16px;
}

.card-category-section {
  background: #fff;
  border-radius: 18px;
  margin-bottom: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.card-category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
}

.card-account-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-account-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #ececec;
}

.card-account-info {
  flex: 1;
}

.card-account-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

.card-account-number {
  font-size: 0.85rem;
  color: #888;
}

.card-account-balance {
  font-size: 1.05rem;
  font-weight: 700;
  color: #4318d1;
}

.card-recent-section {
  background: #fff;
  margin: 16px;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.card-recent-title {
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

@media (max-width: 430px) {
  .card-list-container {
    width: 100vw;
  }
}
</style>
