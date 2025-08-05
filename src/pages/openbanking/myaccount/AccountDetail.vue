<template>
  <div class="account-detail-container">
    <!-- 상단 헤더 -->
    <div class="account-header">
      <button class="account-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="account-title">계좌 상세</span>
      <div class="account-header-right"></div>
    </div>

    <!-- 계좌 정보 카드 -->
    <div class="account-info-card">
      <div class="account-bank-info">
        <div class="account-bank-name">{{ account?.bank }}</div>
        <div
          class="account-type-badge"
          :class="getAccountTypeClass(account?.type)"
        >
          {{ account?.type }}
        </div>
      </div>
      <div class="account-balance">
        {{ account?.balance?.toLocaleString() }}원
      </div>
      <div class="account-name">{{ account?.name }}</div>
      <div class="account-number">{{ account?.accountNumber }}</div>
    </div>

    <!-- Transaction_dummy.json 요약 정보 -->
    <div class="transaction-summary-card">
      <div class="summary-header">
        <h3>거래 요약</h3>
      </div>
      <div class="summary-stats">
        <div class="summary-stat">
          <div class="stat-label">총 거래 건수</div>
          <div class="stat-value">{{ totalTransactionCount }}건</div>
        </div>
        <div class="summary-stat">
          <div class="stat-label">총 입금액</div>
          <div class="stat-value income">
            {{ totalIncome.toLocaleString() }}원
          </div>
        </div>
        <div class="summary-stat">
          <div class="stat-label">총 출금액</div>
          <div class="stat-value expense">
            {{ totalExpense.toLocaleString() }}원
          </div>
        </div>
        <div class="summary-stat">
          <div class="stat-label">최근 거래일</div>
          <div class="stat-value">{{ latestTransactionDate }}</div>
        </div>
      </div>
    </div>

    <!-- 계좌 상세 정보 -->
    <div class="account-detail-info">
      <div class="detail-row">
        <span class="detail-label">은행</span>
        <span class="detail-value">{{ account?.bank }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">계좌명</span>
        <span class="detail-value">{{ account?.name }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">계좌번호</span>
        <span class="detail-value">{{ account?.accountNumber }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">계좌타입</span>
        <span class="detail-value">{{ account?.type }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">잔액</span>
        <span class="detail-value balance"
          >{{ account?.balance?.toLocaleString() }}원</span
        >
      </div>
    </div>

    <!-- 계좌별 거래 내역 -->
    <div class="account-transactions">
      <div class="transactions-title">최근 거래 내역</div>
      <div class="transactions-list">
        <div
          class="transaction-item"
          v-for="(transaction, index) in accountTransactions"
          :key="`transaction-${index}`"
        >
          <div class="transaction-info">
            <div class="transaction-description">
              {{ transaction.description }}
            </div>
            <div class="transaction-date">
              {{ formatDate(transaction.date) }}
            </div>
          </div>
          <div
            class="transaction-amount"
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
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft);

// Transaction 데이터 import
import transactionData from "../Transaction_dummy.json";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.back();
};

// 계좌 데이터
const account = ref(null);

// Transaction_dummy.json에서 계좌 정보 추출
const extractAccountFromTransactions = (accountId) => {
  if (!transactionData?.transactions) return null;

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
        id: accountKey,
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

  return accountMap.get(accountId);
};

// 계좌번호 생성 (더미 데이터용)
const generateAccountNumber = () => {
  const numbers = Math.floor(Math.random() * 900000000) + 100000000;
  return numbers.toString().replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
};

// 계좌 타입별 CSS 클래스
const getAccountTypeClass = (type) => {
  switch (type) {
    case "입출금":
      return "type-deposit";
    case "저축":
      return "type-savings";
    case "투자":
      return "type-investment";
    default:
      return "type-deposit";
  }
};

// 선택된 계좌의 거래 내역
const accountTransactions = computed(() => {
  if (!account.value || !transactionData?.transactions) return [];

  return transactionData.transactions
    .filter(
      (transaction) =>
        transaction.bank === account.value.bank &&
        transaction.account ===
          account.value.name.replace(account.value.bank + " ", "")
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
});

// Transaction_dummy.json 요약 정보 계산
const totalTransactionCount = computed(() => {
  if (!transactionData?.transactions) return 0;
  return transactionData.transactions.length;
});

const totalIncome = computed(() => {
  if (!transactionData?.transactions) return 0;
  return transactionData.transactions
    .filter((transaction) => transaction.type === "입금")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

const totalExpense = computed(() => {
  if (!transactionData?.transactions) return 0;
  return transactionData.transactions
    .filter((transaction) => transaction.type === "출금")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
});

const latestTransactionDate = computed(() => {
  if (
    !transactionData?.transactions ||
    transactionData.transactions.length === 0
  )
    return "-";
  const latestDate = new Date(
    Math.max(...transactionData.transactions.map((t) => new Date(t.date)))
  );
  return `${latestDate.getFullYear()}.${String(
    latestDate.getMonth() + 1
  ).padStart(2, "0")}.${String(latestDate.getDate()).padStart(2, "0")}`;
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
  const accountId = route.params.accountId;
  if (accountId) {
    account.value = extractAccountFromTransactions(accountId);
  }
});
</script>

<style scoped>
.account-detail-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px;
}

.account-header {
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

.account-back {
  background: none;
  border: none;
  font-size: 20px;
  color: #222;
  cursor: pointer;
  padding: 8px;
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
}

.account-info-card {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.account-bank-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.account-bank-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.account-type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}

.account-type-badge.type-deposit {
  background: #4318d1;
}

.account-type-badge.type-savings {
  background: #059669;
}

.account-type-badge.type-investment {
  background: #dc2626;
}

.transaction-summary-card {
  background: #fff;
  margin: 16px;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.summary-header h3 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.summary-stat {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.stat-value.income {
  color: #059669;
}

.stat-value.expense {
  color: #dc2626;
}

.account-balance {
  font-size: 2rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 8px;
}

.account-name {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 4px;
}

.account-number {
  font-size: 0.85rem;
  color: #888;
}

.account-detail-info {
  background: #fff;
  margin: 16px;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  color: #222;
  font-weight: 600;
}

.detail-value.balance {
  color: #4318d1;
  font-size: 1.1rem;
}

.account-transactions {
  background: #fff;
  margin: 16px;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.transactions-title {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  flex: 1;
}

.transaction-description {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

.transaction-date {
  font-size: 0.85rem;
  color: #888;
}

.transaction-amount {
  font-size: 1rem;
  font-weight: 600;
}

.transaction-amount.income {
  color: #059669;
}

.transaction-amount.expense {
  color: #dc2626;
}

@media (max-width: 430px) {
  .account-detail-container {
    width: 100vw;
  }
}
</style>
