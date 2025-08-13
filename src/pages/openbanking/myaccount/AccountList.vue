<template>
  <div class="account-list-container">
    <!-- 상단 헤더 -->
    <div class="account-header">
      <button class="account-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="account-title">내 계좌</span>
      <div class="account-header-right">
        <button class="account-trash-btn" @click="toggleDeleteMode">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </div>
    </div>

    <!-- 총 자산 카드 -->
    <div class="account-total-card">
      <div class="account-total-title">총 자산</div>
      <div class="account-total-amount" :class="{ negative: totalAssets < 0 }">
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
            :class="{
              'account-item-selected': selectedAccounts.includes(account),
            }"
            v-for="(account, index) in depositAccounts"
            :key="`deposit-${index}`"
            @click="handleAccountClick(account)"
          >
            <div class="account-item-header">
              <div class="account-bank-info">
                <div class="account-bank-logo">
                  <img
                    :src="getBankLogo(account.bank)"
                    :alt="account.bank + ' 로고'"
                    class="bank-logo-img"
                  />
                </div>
                <div class="account-bank-details">
                  <div class="account-bank-name">
                    {{ account.bank }}
                    <span
                      class="account-type-badge"
                      :class="getAccountTypeClass(account.type)"
                    >
                      {{ account.type }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="account-balance"
                :class="{ negative: account.balance < 0 }"
              >
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
            :class="{
              'account-item-selected': selectedAccounts.includes(account),
            }"
            v-for="(account, index) in savingsAccounts"
            :key="`savings-${index}`"
            @click="handleAccountClick(account)"
          >
            <div class="account-item-header">
              <div class="account-bank-info">
                <div class="account-bank-logo">
                  <img
                    :src="getBankLogo(account.bank)"
                    :alt="account.bank + ' 로고'"
                    class="bank-logo-img"
                  />
                </div>
                <div class="account-bank-details">
                  <div class="account-bank-name">
                    {{ account.bank }}
                    <span
                      class="account-type-badge"
                      :class="getAccountTypeClass(account.type)"
                    >
                      {{ account.type }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="account-balance"
                :class="{ negative: account.balance < 0 }"
              >
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
            :class="{
              'account-item-selected': selectedAccounts.includes(account),
              'account-item-disabled': account.type === '투자' && !isDeleteMode,
            }"
            v-for="(account, index) in investmentAccounts"
            :key="`investment-${index}`"
            @click="handleAccountClick(account)"
          >
            <div class="account-item-header">
              <div class="account-bank-info">
                <div class="account-bank-logo">
                  <img
                    :src="getBankLogo(account.bank)"
                    :alt="account.bank + ' 로고'"
                    class="bank-logo-img"
                  />
                </div>
                <div class="account-bank-details">
                  <div class="account-bank-name">
                    {{ account.bank }}
                    <span
                      class="account-type-badge"
                      :class="getAccountTypeClass(account.type)"
                    >
                      {{ account.type }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="account-balance"
                :class="{ negative: account.balance < 0 }"
              >
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

    <!-- 삭제 버튼 (삭제 모드일 때만 표시) -->
    <div v-if="isDeleteMode" class="delete-section">
      <button
        class="delete-accounts-btn"
        @click="showDeleteConfirm"
        :disabled="selectedAccounts.length === 0"
      >
        선택된 계좌 삭제 ({{ selectedAccounts.length }}개)
      </button>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>계좌 삭제</h3>
        </div>
        <div class="modal-body">
          <p>{{ selectedAccounts.length }}개의 계좌를 삭제하시겠습니까?</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-cancel" @click="closeDeleteModal">
            취소
          </button>
          <button class="modal-btn modal-btn-confirm" @click="confirmDelete">
            삭제
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
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft, faTrash);

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

// 삭제 모드 상태
const isDeleteMode = ref(false);
// 선택된 계좌 목록
const selectedAccounts = ref([]);
// 삭제 확인 모달 상태
const showDeleteModal = ref(false);

// 삭제 모드 토글
const toggleDeleteMode = () => {
  isDeleteMode.value = !isDeleteMode.value;
  selectedAccounts.value = []; // 모드 토글 시 선택 해제
};

// 계좌 클릭 핸들러 (삭제 모드일 때는 선택/해제, 일반 모드일 때는 계좌 상세로 이동)
const handleAccountClick = (account) => {
  if (isDeleteMode.value) {
    toggleAccountSelection(account);
  } else {
    // 투자 계좌는 상세보기 비활성화
    if (account.type === "투자") {
      return;
    }
    selectAccount(account);
  }
};

// 계좌 선택 토글
const toggleAccountSelection = (account) => {
  const index = selectedAccounts.value.indexOf(account);
  if (index > -1) {
    selectedAccounts.value.splice(index, 1);
  } else {
    selectedAccounts.value.push(account);
  }
};

// 선택된 계좌 삭제 함수
const deleteSelectedAccounts = () => {
  if (selectedAccounts.value.length === 0) return;

  const selectedCount = selectedAccounts.value.length;

  // 실제 데이터베이스 또는 상태 관리 로직에 따라 계좌 삭제
  // 여기서는 더미 데이터를 사용하므로 배열에서 제거
  accounts.value = accounts.value.filter(
    (account) => !selectedAccounts.value.includes(account)
  );
  selectedAccounts.value = []; // 삭제 후 선택 해제
  isDeleteMode.value = false; // 삭제 모드 해제
};

// 삭제 확인 모달 열기
const showDeleteConfirm = () => {
  showDeleteModal.value = true;
};

// 삭제 확인 모달 닫기
const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

// 삭제 확인 확인
const confirmDelete = () => {
  deleteSelectedAccounts();
  closeDeleteModal();
};

// 은행 로고 경로 생성 함수
const getBankLogo = (bankName) => {
  try {
    return new URL(`../../../assets/bank_logo/${bankName}.png`, import.meta.url)
      .href;
  } catch (error) {
    // 로고가 없는 경우 기본 이미지 반환
    console.warn(`Bank logo not found for: ${bankName}`);
    return new URL(`../../../assets/bank_logo/KB국민은행.png`, import.meta.url)
      .href;
  }
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
  padding-top: 56px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  height: 100vh;
}

.account-list-container::-webkit-scrollbar {
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

.account-total-amount.negative {
  color: #e11d48;
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
  transition: all 0.15s;
  border: 2px solid transparent;
  position: relative; /* 체크박스를 위한 상대 위치 */
}

.account-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 24, 209, 0.12);
}

.account-item-selected {
  border-color: #dc2626;
  background: #fef2f2;
}

.account-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
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
  gap: 12px;
}

.account-bank-logo {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bank-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.account-bank-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.account-bank-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-type-badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  display: inline-block;
  line-height: 1.2;
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

.account-balance.negative {
  color: #e11d48;
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

.delete-section {
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

.delete-accounts-btn {
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

.delete-accounts-btn:hover {
  background: #b91c1c;
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
  padding: 24px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  margin-bottom: 16px;
}

.modal-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-body p {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.modal-btn-cancel {
  background: #f3f4f6;
  color: #666;
}

.modal-btn-cancel:hover {
  background: #e5e7eb;
}

.modal-btn-confirm {
  background: #dc2626;
  color: #fff;
}

.modal-btn-confirm:hover {
  background: #c02626;
}

@media (max-width: 430px) {
  .account-list-container {
    width: 100vw;
  }
}
</style>
