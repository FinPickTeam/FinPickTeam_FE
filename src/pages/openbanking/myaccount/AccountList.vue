<template>
  <div class="account-list-container">
    <!-- 상단 헤더 -->
    <div class="account-header">
      <button class="account-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="account-title">내 계좌</span>
      <div class="account-header-right"></div>
    </div>

    <!-- 총 자산 카드 -->
    <div class="account-total-card">
      <div class="account-total-title">총 자산</div>
      <div class="account-total-amount">
        {{ totalAssets.toLocaleString()
        }}<span class="account-total-won">원</span>
      </div>
      <div class="account-total-info">
        <span class="account-count">{{ accounts.length }}개 계좌</span>
      </div>
    </div>

    <!-- 계좌 리스트 -->
    <div class="account-list-section">
      <!-- 입출금 계좌 -->
      <div v-if="depositAccounts.length > 0" class="account-category-section">
        <div class="account-category-title">입출금 계좌</div>
        <div class="account-list">
          <div
            class="account-item"
            v-for="(account, index) in depositAccounts"
            :key="`deposit-${index}`"
            @click="selectAccount(account)"
          >
            <div class="account-item-header">
              <div class="account-bank-info">
                <div class="account-bank-name">{{ account.bank }}</div>
                <div
                  class="account-type-badge"
                  :class="getAccountTypeClass(account.type)"
                >
                  {{ account.type }}
                </div>
              </div>
              <div class="account-balance">
                {{ account.balance.toLocaleString() }}원
              </div>
            </div>
            <div class="account-item-details">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-number">{{ account.accountNumber }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 저축 계좌 -->
      <div v-if="savingsAccounts.length > 0" class="account-category-section">
        <div class="account-category-title">저축 계좌</div>
        <div class="account-list">
          <div
            class="account-item"
            v-for="(account, index) in savingsAccounts"
            :key="`savings-${index}`"
            @click="selectAccount(account)"
          >
            <div class="account-item-header">
              <div class="account-bank-info">
                <div class="account-bank-name">{{ account.bank }}</div>
                <div
                  class="account-type-badge"
                  :class="getAccountTypeClass(account.type)"
                >
                  {{ account.type }}
                </div>
              </div>
              <div class="account-balance">
                {{ account.balance.toLocaleString() }}원
              </div>
            </div>
            <div class="account-item-details">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-number">{{ account.accountNumber }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 투자 계좌 -->
      <div
        v-if="investmentAccounts.length > 0"
        class="account-category-section"
      >
        <div class="account-category-title">투자 계좌</div>
        <div class="account-list">
          <div
            class="account-item"
            v-for="(account, index) in investmentAccounts"
            :key="`investment-${index}`"
            @click="selectAccount(account)"
          >
            <div class="account-item-header">
              <div class="account-bank-info">
                <div class="account-bank-name">{{ account.bank }}</div>
                <div
                  class="account-type-badge"
                  :class="getAccountTypeClass(account.type)"
                >
                  {{ account.type }}
                </div>
              </div>
              <div class="account-balance">
                {{ account.balance.toLocaleString() }}원
              </div>
            </div>
            <div class="account-item-details">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-number">{{ account.accountNumber }}</div>
            </div>
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

// 계좌 선택
const selectAccount = (account) => {
  const accountId = `${account.bank}-${account.name.replace(
    account.bank + " ",
    ""
  )}`;
  router.push(`/openbanking/account-detail/${encodeURIComponent(accountId)}`);
};

// 계좌 데이터 초기화
onMounted(() => {
  accounts.value = extractAccountsFromTransactions();
});
</script>

<style scoped>
.account-list-container {
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

.account-total-card {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.account-total-title {
  font-size: 1rem;
  color: #888;
  font-weight: 500;
  margin-bottom: 8px;
}

.account-total-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 8px;
}

.account-total-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 4px;
}

.account-total-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-count {
  font-size: 0.9rem;
  color: #666;
}

.account-list-section {
  margin: 0 16px;
}

.account-category-section {
  margin-bottom: 24px;
}

.account-category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
  padding-left: 4px;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-item {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.account-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 24, 209, 0.12);
}

.account-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.account-bank-info {
  display: flex;
  align-items: center;
  gap: 8px;
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

.account-balance {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4318d1;
}

.account-item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.account-name {
  font-size: 0.95rem;
  color: #666;
}

.account-number {
  font-size: 0.85rem;
  color: #888;
}

@media (max-width: 430px) {
  .account-list-container {
    width: 100vw;
  }
}
</style>
