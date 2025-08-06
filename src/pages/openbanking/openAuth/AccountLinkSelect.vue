<template>
  <div class="account-link-select-container">
    <!-- 헤더 영역 -->
    <div class="dictionary-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="dictionary-header-title">오픈뱅킹 계좌 연동</span>
    </div>

    <!-- 상단 제목 및 설명 -->
    <div class="header-section">
      <h1 class="main-title">연결할 곳을 선택해주세요</h1>
      <p class="sub-description">
        지금은 일부 금융기관만 연결할 수 있어요. 금융기관은 계속 추가될
        예정이에요.
      </p>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="tab-navigation">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
      >
        <span class="tab-text">{{ tab.name }}</span>
      </div>
    </div>

    <!-- 은행 섹션 -->
    <div v-if="activeTab === 'bank'" class="bank-section">
      <div class="section-header">
        <h2 class="section-title">은행</h2>
        <div class="section-actions">
          <button class="select-all-btn" @click="toggleSelectAll">
            전체 선택
          </button>
        </div>
      </div>

      <div class="bank-list">
        <div
          v-for="bank in bankList"
          :key="bank.id"
          class="bank-item"
          @click="toggleBankSelection(bank)"
        >
          <div class="bank-logo">
            <img :src="bank.logo" :alt="bank.name" class="bank-icon" />
          </div>
          <div class="bank-name">{{ bank.name }}</div>
          <div class="checkbox-container">
            <div class="checkbox" :class="{ checked: bank.selected }">
              <font-awesome-icon
                v-if="bank.selected"
                :icon="['fas', 'check']"
                class="check-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 카드 섹션 -->
    <div v-if="activeTab === 'card'" class="card-section">
      <div class="section-header">
        <h2 class="section-title">카드</h2>
        <div class="section-actions">
          <button class="select-all-btn" @click="toggleSelectAll">
            전체 선택
          </button>
        </div>
      </div>

      <div class="card-list">
        <div
          v-for="card in cardList"
          :key="card.id"
          class="card-item"
          @click="toggleCardSelection(card)"
        >
          <div class="card-logo">
            <img :src="card.logo" :alt="card.name" class="card-icon" />
          </div>
          <div class="card-name">{{ card.name }}</div>
          <div class="checkbox-container">
            <div class="checkbox" :class="{ checked: card.selected }">
              <font-awesome-icon
                v-if="card.selected"
                :icon="['fas', 'check']"
                class="check-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 증권 섹션 -->
    <div v-if="activeTab === 'securities'" class="securities-section">
      <div class="section-header">
        <h2 class="section-title">증권</h2>
        <div class="section-actions">
          <button class="select-all-btn" @click="toggleSelectAll">
            전체 선택
          </button>
        </div>
      </div>

      <div class="securities-list">
        <div
          v-for="security in securitiesList"
          :key="security.id"
          class="security-item"
          @click="toggleSecuritySelection(security)"
        >
          <div class="security-logo">
            <img
              :src="security.logo"
              :alt="security.name"
              class="security-icon"
            />
          </div>
          <div class="security-name">{{ security.name }}</div>
          <div class="checkbox-container">
            <div class="checkbox" :class="{ checked: security.selected }">
              <font-awesome-icon
                v-if="security.selected"
                :icon="['fas', 'check']"
                class="check-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 연결하기 버튼 -->
    <div class="connect-section">
      <button class="connect-btn" @click="connectAccounts">연결하기</button>
    </div>

    <!-- 오픈뱅킹 연동 혜택 -->
    <div class="benefits-section">
      <h2 class="section-title">오픈뱅킹 연동 혜택</h2>
      <div class="benefits-list">
        <div class="benefit-item">
          <div class="benefit-icon">
            <font-awesome-icon :icon="['fas', 'check']" />
          </div>
          <div class="benefit-content">
            <h3 class="benefit-title">간편한 계좌 연동</h3>
            <p class="benefit-description">
              복잡한 인증 절차 없이 간편하게 계좌를 연동할 수 있어요.
            </p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">
            <font-awesome-icon :icon="['fas', 'check']" />
          </div>
          <div class="benefit-content">
            <h3 class="benefit-title">실시간 자산 관리</h3>
            <p class="benefit-description">
              연동된 계좌의 잔액과 거래 내역을 실시간으로 확인할 수 있어요.
            </p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">
            <font-awesome-icon :icon="['fas', 'check']" />
          </div>
          <div class="benefit-content">
            <h3 class="benefit-title">안전한 보안</h3>
            <p class="benefit-description">
              금융감독원 승인을 받은 안전한 오픈뱅킹 서비스를 이용해요.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 자주 묻는 질문 -->
    <div class="faq-section">
      <h2 class="section-title">자주 묻는 질문</h2>
      <div class="faq-list">
        <div class="faq-item" @click="toggleFaq(0)">
          <div class="faq-question">
            <span>오픈뱅킹이 무엇인가요?</span>
            <font-awesome-icon
              :icon="['fas', 'angle-down']"
              :class="{ rotated: openFaqIndex === 0 }"
              class="faq-arrow"
            />
          </div>
          <div class="faq-answer" :class="{ open: openFaqIndex === 0 }">
            <p>
              오픈뱅킹은 금융감독원이 주도하는 금융 서비스로, 은행 간 계좌
              정보를 안전하게 공유하여 다양한 금융 서비스를 편리하게 이용할 수
              있게 해주는 시스템입니다.
            </p>
          </div>
        </div>
        <div class="faq-item" @click="toggleFaq(1)">
          <div class="faq-question">
            <span>연동된 계좌는 언제든지 해제할 수 있나요?</span>
            <font-awesome-icon
              :icon="['fas', 'angle-down']"
              :class="{ rotated: openFaqIndex === 1 }"
              class="faq-arrow"
            />
          </div>
          <div class="faq-answer" :class="{ open: openFaqIndex === 1 }">
            <p>
              네, 언제든지 앱 설정에서 연동된 계좌를 해제할 수 있습니다. 해제
              후에는 해당 은행의 계좌 정보를 더 이상 확인할 수 없습니다.
            </p>
          </div>
        </div>
        <div class="faq-item" @click="toggleFaq(2)">
          <div class="faq-question">
            <span>연동 시 수수료가 발생하나요?</span>
            <font-awesome-icon
              :icon="['fas', 'angle-down']"
              :class="{ rotated: openFaqIndex === 2 }"
              class="faq-arrow"
            />
          </div>
          <div class="faq-answer" :class="{ open: openFaqIndex === 2 }">
            <p>
              오픈뱅킹 계좌 연동은 무료로 제공됩니다. 별도의 수수료나 비용이
              발생하지 않으니 안심하고 이용하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faCheck,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faCheck, faAngleDown);

const router = useRouter();

// 탭 목록
const tabs = ref([
  {
    id: "bank",
    name: "은행",
  },
  {
    id: "card",
    name: "카드",
  },
  {
    id: "securities",
    name: "증권",
  },
]);

const activeTab = ref("bank");
const openFaqIndex = ref(null);

// 은행 목록
const bankList = ref([
  {
    id: 1,
    name: "KB국민은행",
    logo: "/src/assets/bank_logo/KB국민은행.png",
    selected: false,
  },
  {
    id: 2,
    name: "신한은행",
    logo: "/src/assets/bank_logo/신한은행.png",
    selected: false,
  },
  {
    id: 3,
    name: "제주은행",
    logo: "/src/assets/bank_logo/제주은행.png",
    selected: false,
  },
  {
    id: 4,
    name: "우리은행",
    logo: "/src/assets/bank_logo/우리은행.png",
    selected: false,
  },
  {
    id: 5,
    name: "하나은행",
    logo: "/src/assets/bank_logo/하나은행.png",
    selected: false,
  },
  {
    id: 6,
    name: "NH농협은행",
    logo: "/src/assets/bank_logo/NH농협은행.png",
    selected: false,
  },
  {
    id: 7,
    name: "IBK기업은행",
    logo: "/src/assets/bank_logo/IBK기업은행.png",
    selected: false,
  },
  {
    id: 8,
    name: "SC제일은행",
    logo: "/src/assets/bank_logo/SC제일은행.png",
    selected: false,
  },
  {
    id: 9,
    name: "수협은행",
    logo: "/src/assets/bank_logo/수협은행.png",
    selected: false,
  },
  {
    id: 10,
    name: "KDB산업은행",
    logo: "/src/assets/bank_logo/KDB산업은행.png",
    selected: false,
  },
  {
    id: 11,
    name: "카카오뱅크",
    logo: "/src/assets/bank_logo/카카오뱅크.png",
    selected: false,
  },
  {
    id: 12,
    name: "케이뱅크",
    logo: "/src/assets/bank_logo/케이뱅크.png",
    selected: false,
  },
  {
    id: 13,
    name: "토스뱅크",
    logo: "/src/assets/bank_logo/토스뱅크.png",
    selected: false,
  },
  {
    id: 14,
    name: "iM뱅크",
    logo: "/src/assets/bank_logo/iM뱅크.png",
    selected: false,
  },
  {
    id: 15,
    name: "광주은행",
    logo: "/src/assets/bank_logo/광주은행.png",
    selected: false,
  },
  {
    id: 16,
    name: "전북은행",
    logo: "/src/assets/bank_logo/전북은행.png",
    selected: false,
  },
  {
    id: 17,
    name: "경남은행",
    logo: "/src/assets/bank_logo/경남은행.png",
    selected: false,
  },
  {
    id: 18,
    name: "부산은행",
    logo: "/src/assets/bank_logo/부산은행.png",
    selected: false,
  },
]);

// 카드 목록
const cardList = ref([
  {
    id: 1,
    name: "삼성카드",
    logo: "/src/assets/card_logo/삼성카드.png",
    selected: false,
  },
  {
    id: 2,
    name: "신한카드",
    logo: "/src/assets/card_logo/신한카드.png",
    selected: false,
  },
  {
    id: 3,
    name: "현대카드",
    logo: "/src/assets/card_logo/현대카드.png",
    selected: false,
  },
  {
    id: 4,
    name: "롯데카드",
    logo: "/src/assets/card_logo/롯데카드.png",
    selected: false,
  },
  {
    id: 5,
    name: "국민카드",
    logo: "/src/assets/card_logo/국민카드.png",
    selected: false,
  },
  {
    id: 6,
    name: "하나카드",
    logo: "/src/assets/card_logo/하나카드.png",
    selected: false,
  },
  {
    id: 7,
    name: "우리카드",
    logo: "/src/assets/card_logo/우리카드.png",
    selected: false,
  },
  {
    id: 8,
    name: "bc카드",
    logo: "/src/assets/card_logo/bc카드.png",
    selected: false,
  },
]);

// 증권 목록
const securitiesList = ref([
  {
    id: 1,
    name: "KB증권",
    logo: "/src/assets/bank_logo/KB국민은행.png",
    selected: false,
  },
  {
    id: 2,
    name: "신한투자증권",
    logo: "/src/assets/bank_logo/신한은행.png",
    selected: false,
  },
  {
    id: 3,
    name: "우리투자증권",
    logo: "/src/assets/bank_logo/우리은행.png",
    selected: false,
  },
  {
    id: 4,
    name: "하나증권 (구 하나금융투자)",
    logo: "/src/assets/bank_logo/하나은행.png",
    selected: false,
  },
  {
    id: 5,
    name: "NH투자증권",
    logo: "/src/assets/bank_logo/NH농협은행.png",
    selected: false,
  },
  {
    id: 6,
    name: "IBK투자증권",
    logo: "/src/assets/bank_logo/IBK기업은행.png",
    selected: false,
  },
  {
    id: 7,
    name: "SC증권",
    logo: "/src/assets/bank_logo/SC제일은행.png",
    selected: false,
  },
  {
    id: 8,
    name: "토스증권",
    logo: "/src/assets/bank_logo/토스뱅크.png",
    selected: false,
  },
  {
    id: 9,
    name: "하이투자증권 (DGB금융그룹)",
    logo: "/src/assets/bank_logo/iM뱅크.png",
    selected: false,
  },

  {
    id: 10,
    name: "카카오페이증권",
    logo: "/src/assets/bank_logo/카카오뱅크.png",
    selected: false,
  },
  {
    id: 11,
    name: "케이뱅크",
    logo: "/src/assets/bank_logo/케이뱅크.png",
    selected: false,
  },
]);

// 선택된 항목들 계산
const selectedBanks = computed(() =>
  bankList.value.filter((bank) => bank.selected)
);
const selectedCards = computed(() =>
  cardList.value.filter((card) => card.selected)
);
const selectedSecurities = computed(() =>
  securitiesList.value.filter((security) => security.selected)
);

function goBack() {
  router.back();
}

function setActiveTab(tabId) {
  activeTab.value = tabId;
}

function toggleBankSelection(bank) {
  bank.selected = !bank.selected;
}

function toggleCardSelection(card) {
  card.selected = !card.selected;
}

function toggleSecuritySelection(security) {
  security.selected = !security.selected;
}

function toggleSelectAll() {
  if (activeTab.value === "bank") {
    const allSelected = bankList.value.every((bank) => bank.selected);
    bankList.value.forEach((bank) => {
      bank.selected = !allSelected;
    });
  } else if (activeTab.value === "card") {
    const allSelected = cardList.value.every((card) => card.selected);
    cardList.value.forEach((card) => {
      card.selected = !allSelected;
    });
  } else if (activeTab.value === "securities") {
    const allSelected = securitiesList.value.every(
      (security) => security.selected
    );
    securitiesList.value.forEach((security) => {
      security.selected = !allSelected;
    });
  }
}

function toggleFaq(index) {
  if (openFaqIndex.value === index) {
    openFaqIndex.value = null;
  } else {
    openFaqIndex.value = index;
  }
}

function connectAccounts() {
  // 모든 탭에서 선택된 항목들 수집
  const selectedItems = [];

  // 은행 탭에서 선택된 항목들
  selectedItems.push(
    ...selectedBanks.value.map((bank) => ({ name: bank.name, type: "bank" }))
  );

  // 카드 탭에서 선택된 항목들
  selectedItems.push(
    ...selectedCards.value.map((card) => ({ name: card.name, type: "card" }))
  );

  // 증권 탭에서 선택된 항목들
  selectedItems.push(
    ...selectedSecurities.value.map((security) => ({
      name: security.name,
      type: "securities",
    }))
  );

  if (selectedItems.length === 0) {
    alert("연결할 항목을 선택해주세요.");
    return;
  }

  // 선택된 항목들을 저장하고 AccountAgreement 페이지로 이동
  console.log("선택된 항목들:", selectedItems);

  // 선택된 항목들을 쿼리 파라미터로 전달
  router.push({
    path: "/openbanking/account-agreement",
    query: { selected: JSON.stringify(selectedItems) },
  });
}
</script>

<style scoped>
.account-link-select-container {
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
  color: #333;
}

.account-link-select-container::-webkit-scrollbar {
  display: none;
}

/* 헤더 스타일 */
.dictionary-header-bar {
  margin-top: 32px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0;
  margin-bottom: 30px;
  z-index: 1100;
}

.dictionary-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
  z-index: 1200;
}

.back-btn:hover {
  background: #f3f3f3;
}

/* 상단 제목 및 설명 */
.header-section {
  margin-bottom: 30px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.sub-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 탭 네비게이션 */
.tab-navigation {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.tab-item.active {
  color: white;
  background: #8e74e3;
}

.tab-item:hover:not(.active) {
  color: #333;
  background: #f8f8f8;
}

.tab-text {
  font-size: 14px;
  font-weight: 500;
}

/* 섹션 헤더 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.select-all-btn {
  background: white;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-all-btn:hover {
  background: #f8f8f8;
  border-color: #ccc;
}

/* 은행 목록 */
.bank-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bank-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.bank-item:last-child {
  border-bottom: none;
}

.bank-item:hover {
  background-color: #f9f9f9;
}

.bank-logo {
  margin-right: 16px;
}

.bank-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
}

.bank-name {
  flex: 1;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.checkbox-container {
  margin-left: 12px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background: #8e74e3;
  border-color: #8e74e3;
}

.check-icon {
  color: white;
  font-size: 12px;
}

/* 카드 목록 */
.card-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.card-item:last-child {
  border-bottom: none;
}

.card-item:hover {
  background-color: #f9f9f9;
}

.card-logo {
  margin-right: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
}

.card-name {
  flex: 1;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* 증권 목록 */
.securities-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.security-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item:hover {
  background-color: #f9f9f9;
}

.security-logo {
  margin-right: 16px;
}

.security-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
}

.security-name {
  flex: 1;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* 빈 메시지 */
.empty-message {
  background: white;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-message p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 연결하기 버튼 */
.connect-section {
  margin-top: 40px;
  margin-bottom: 40px;
  text-align: center;
}

.connect-btn {
  background: #8e74e3;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;
}

.connect-btn:hover {
  background: #7a5fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 116, 227, 0.3);
}

.connect-btn:active {
  transform: translateY(0);
}

/* 혜택 섹션 */
.benefits-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.benefits-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.benefit-item:last-child {
  border-bottom: none;
}

.benefit-icon {
  width: 24px;
  height: 24px;
  background: #8e74e3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.benefit-icon svg {
  color: white;
  font-size: 12px;
}

.benefit-content {
  flex: 1;
}

.benefit-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.benefit-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* FAQ 섹션 */
.faq-section {
  margin-bottom: 40px;
}

.faq-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.faq-item {
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: background-color 0.2s ease;
}

.faq-question:hover {
  background-color: #f9f9f9;
}

.faq-arrow {
  color: #666;
  font-size: 14px;
  transition: transform 0.3s ease;
}

.faq-arrow.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: #f8f8f8;
}

.faq-answer.open {
  max-height: 200px;
}

.faq-answer p {
  padding: 20px;
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 540px) {
  .account-link-select-container {
    max-width: 100vw;
  }
}
</style>
