<template>
  <div class="ars-agreement-container">
    <!-- 상단 헤더 -->
    <div class="ars-agreement-header">
      <button class="ars-agreement-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="ars-agreement-title center-title">오픈뱅킹 이용약관</span>
    </div>

    <!-- 안내문구 -->
    <div class="ars-agreement-desc">
      선택하신 은행, 카드사, 증권사의 오픈뱅킹 이용약관에 동의해주세요.<br />
      계좌 연동을 위해 필수 동의사항입니다.
    </div>

    <!-- 약관 목록 -->
    <div class="ars-agreement-list">
      <!-- 전체동의 -->
      <div class="ars-agreement-item-all" @click="toggleAllAgreements">
        <div class="ars-agreement-checkbox-all" :class="{ checked: allAgreed }">
          <font-awesome-icon
            v-if="allAgreed"
            :icon="['fas', 'check']"
            class="check-icon"
          />
        </div>
        <div class="ars-agreement-text-all">
          <span class="ars-agreement-title-all">전체동의하기</span>
          <span class="ars-agreement-desc-all">모든 약관에 동의합니다</span>
        </div>
      </div>

      <!-- 개별 약관 -->
      <div
        class="ars-agreement-item"
        v-for="(agreement, index) in agreements"
        :key="index"
      >
        <div class="ars-agreement-item-header">
          <div
            class="ars-agreement-checkbox"
            :class="{ checked: agreement.checked }"
            @click.stop="toggleIndividualAgreement(index)"
          >
            <font-awesome-icon
              v-if="agreement.checked"
              :icon="['fas', 'check']"
              class="check-icon"
            />
          </div>
          <div class="ars-agreement-content" @click="toggleAgreement(index)">
            <div class="ars-agreement-logo">
              <img
                :src="getLogoPath(agreement)"
                :alt="agreement.securities"
                class="ars-agreement-logo-img"
              />
            </div>
            <div class="ars-agreement-text-container">
              <span class="ars-agreement-text">{{ agreement.securities }}</span>
            </div>
          </div>
          <font-awesome-icon
            :icon="['fas', agreement.expanded ? 'angle-up' : 'angle-right']"
            class="arrow-icon"
            @click="toggleAgreement(index)"
          />
        </div>
        <div class="ars-agreement-content-section" v-show="agreement.expanded">
          <div
            class="ars-agreement-content-detail"
            v-html="agreement.content"
          ></div>
          <div class="ars-agreement-content-footer">
            <button
              class="ars-agreement-content-btn"
              @click="confirmAgreement(index)"
            >
              동의
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="ars-agreement-bottom">
      <button
        class="ars-agreement-next-btn"
        :class="{ active: canProceed }"
        @click="goToNext"
        :disabled="!canProceed"
      >
        약관 동의 및 진행
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faAngleRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faAngleRight, faCheck);

const router = useRouter();
const route = useRoute();

// 모든 약관 데이터
const allAgreements = {
  // 은행
  KB국민은행: { bank: "KB국민은행", securities: "KB국민은행", type: "bank" },
  신한은행: { bank: "신한은행", securities: "신한은행", type: "bank" },
  제주은행: { bank: "제주은행", securities: "제주은행", type: "bank" },
  우리은행: { bank: "우리은행", securities: "우리은행", type: "bank" },
  하나은행: {
    bank: "하나은행",
    securities: "하나은행",
    type: "bank",
  },
  NH농협은행: { bank: "NH농협은행", securities: "NH농협은행", type: "bank" },
  IBK기업은행: { bank: "IBK기업은행", securities: "IBK기업은행", type: "bank" },
  SC제일은행: { bank: "SC제일은행", securities: "SC제일은행", type: "bank" },
  토스뱅크: { bank: "토스뱅크", securities: "토스뱅크", type: "bank" },
  카카오뱅크: {
    bank: "카카오뱅크",
    securities: "카카오뱅크",
    type: "bank",
  },
  케이뱅크: { bank: "케이뱅크", securities: "케이뱅크", type: "bank" },
  iM뱅크: {
    bank: "iM뱅크",
    securities: "iM뱅크",
    type: "bank",
  },
  광주은행: { bank: "광주은행", securities: "광주은행", type: "bank" },
  전북은행: { bank: "전북은행", securities: "전북은행", type: "bank" },
  경남은행: { bank: "경남은행", securities: "경남은행", type: "bank" },
  부산은행: { bank: "부산은행", securities: "부산은행", type: "bank" },

  // 카드
  삼성카드: { bank: "삼성카드", securities: "삼성카드", type: "card" },
  신한카드: { bank: "신한카드", securities: "신한카드", type: "card" },
  현대카드: { bank: "현대카드", securities: "현대카드", type: "card" },
  롯데카드: { bank: "롯데카드", securities: "롯데카드", type: "card" },
  국민카드: { bank: "국민카드", securities: "국민카드", type: "card" },
  하나카드: { bank: "하나카드", securities: "하나카드", type: "card" },
  우리카드: { bank: "우리카드", securities: "우리카드", type: "card" },
  bc카드: { bank: "bc카드", securities: "bc카드", type: "card" },

  // 증권
  KB증권: { bank: "KB국민은행", securities: "KB증권", type: "securities" },
  신한투자증권: {
    bank: "신한은행",
    securities: "신한투자증권",
    type: "securities",
  },
  우리투자증권: {
    bank: "우리은행",
    securities: "우리투자증권",
    type: "securities",
  },
  "하나증권 (구 하나금융투자)": {
    bank: "하나은행",
    securities: "하나증권 (구 하나금융투자)",
    type: "securities",
  },
  NH투자증권: {
    bank: "NH농협은행",
    securities: "NH투자증권",
    type: "securities",
  },
  IBK투자증권: {
    bank: "IBK기업은행",
    securities: "IBK투자증권",
    type: "securities",
  },
  SC증권: {
    bank: "SC제일은행",
    securities: "SC증권",
    type: "securities",
  },
  토스증권: { bank: "토스뱅크", securities: "토스증권", type: "securities" },
  "하이투자증권 (DGB금융그룹)": {
    bank: "iM뱅크",
    securities: "하이투자증권 (DGB금융그룹)",
    type: "securities",
  },
  카카오페이증권: {
    bank: "카카오뱅크",
    securities: "카카오페이증권",
    type: "securities",
  },
  케이뱅크: { bank: "케이뱅크", securities: "케이뱅크", type: "securities" },
};

// 선택된 항목들
const selectedItems = ref([]);

// 약관 상태 관리를 위한 별도 ref
const agreementStates = ref({});

// 선택된 항목들에 해당하는 약관만 필터링
const agreements = computed(() => {
  return selectedItems.value.map((item, index) => {
    const agreement = allAgreements[item.name];
    if (!agreement) {
      console.warn(`약관을 찾을 수 없습니다: ${item.name}`);
      // 기본값 제공
      return {
        bank: item.name,
        securities: item.name,
        type: item.type || "unknown",
        checked: agreementStates.value[index]?.checked || false,
        expanded: agreementStates.value[index]?.expanded || false,
        content: `
          <h4>${item.name} 이용약관</h4>
          <p>이 약관은 ${item.name}의 서비스 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          
          <h4>제1조 (목적)</h4>
          <p>이 약관은 ${item.name}의 서비스 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          
          <h4>제2조 (정의)</h4>
          <p>1. "서비스"란 ${item.name}에서 제공하는 모든 서비스를 말합니다.</p>
          <p>2. "이용자"란 이 약관에 동의하고 서비스를 이용하는 고객을 말합니다.</p>
          
          <h4>제3조 (서비스 이용)</h4>
          <p>1. 이용자는 본인의 정보에 한하여 서비스를 이용할 수 있습니다.</p>
          <p>2. 이용자는 서비스 이용 시 관련 법령과 약관을 준수해야 합니다.</p>
          
          <h4>제4조 (개인정보 보호)</h4>
          <p>1. 서비스 제공자는 이용자의 개인정보를 보호하기 위해 최선을 다합니다.</p>
          <p>2. 이용자의 개인정보는 관련 법령에 따라 안전하게 관리됩니다.</p>
        `,
      };
    }
    return {
      ...agreement,
      checked: agreementStates.value[index]?.checked || false,
      expanded: agreementStates.value[index]?.expanded || false,
      content: `
        <h4>${agreement.securities} 이용약관</h4>
        <p>이 약관은 ${agreement.securities}의 서비스 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        
        <h4>제1조 (목적)</h4>
        <p>이 약관은 ${agreement.securities}의 서비스 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        
        <h4>제2조 (정의)</h4>
        <p>1. "서비스"란 ${agreement.securities}에서 제공하는 모든 서비스를 말합니다.</p>
        <p>2. "이용자"란 이 약관에 동의하고 서비스를 이용하는 고객을 말합니다.</p>
        
        <h4>제3조 (서비스 이용)</h4>
        <p>1. 이용자는 본인의 정보에 한하여 서비스를 이용할 수 있습니다.</p>
        <p>2. 이용자는 서비스 이용 시 관련 법령과 약관을 준수해야 합니다.</p>
        
        <h4>제4조 (개인정보 보호)</h4>
        <p>1. 서비스 제공자는 이용자의 개인정보를 보호하기 위해 최선을 다합니다.</p>
        <p>2. 이용자의 개인정보는 관련 법령에 따라 안전하게 관리됩니다.</p>
      `,
    };
  });
});

// 쿼리 파라미터에서 선택된 항목들 받아오기
onMounted(() => {
  const selectedParam = route.query.selected;
  if (selectedParam) {
    try {
      selectedItems.value = JSON.parse(selectedParam);
      console.log("선택된 항목들:", selectedItems.value);
    } catch (error) {
      console.error("선택된 항목 파싱 오류:", error);
      // 기본값으로 돌아가기
      router.push("/openbanking/account-link-select");
    }
  } else {
    // 선택된 항목이 없으면 이전 페이지로 돌아가기
    router.push("/openbanking/account-link-select");
  }
});

const allAgreed = ref(false);

const canProceed = computed(() => {
  return (
    allAgreed.value || agreements.value.every((agreement) => agreement.checked)
  );
});

const toggleAllAgreements = () => {
  allAgreed.value = !allAgreed.value;
  agreements.value.forEach((agreement, index) => {
    if (!agreementStates.value[index]) {
      agreementStates.value[index] = { checked: false, expanded: false };
    }
    agreementStates.value[index].checked = allAgreed.value;
  });
};

const toggleAgreement = (index) => {
  // 다른 모든 항목들을 접기
  Object.keys(agreementStates.value).forEach((i) => {
    if (parseInt(i) !== index) {
      agreementStates.value[i].expanded = false;
    }
  });

  // 현재 항목 토글
  if (!agreementStates.value[index]) {
    agreementStates.value[index] = { checked: false, expanded: false };
  }
  agreementStates.value[index].expanded =
    !agreementStates.value[index].expanded;
};

const toggleIndividualAgreement = (index) => {
  if (!agreementStates.value[index]) {
    agreementStates.value[index] = { checked: false, expanded: false };
  }

  // 개별 체크박스 토글
  agreementStates.value[index].checked = !agreementStates.value[index].checked;

  // 전체동의 상태 업데이트
  const allChecked = agreements.value.every((agreement) => agreement.checked);
  allAgreed.value = allChecked;
};

const confirmAgreement = (index) => {
  if (!agreementStates.value[index]) {
    agreementStates.value[index] = { checked: false, expanded: false };
  }
  agreementStates.value[index].checked = true;
  agreementStates.value[index].expanded = false;

  // 전체동의 상태 업데이트
  const allChecked = agreements.value.every((agreement) => agreement.checked);
  allAgreed.value = allChecked;
};

const goBack = () => {
  router.back();
};

const getLogoPath = (agreement) => {
  const name = agreement.securities;

  // 은행 로고
  if (agreement.type === "bank") {
    return `/src/assets/bank_logo/${name}.png`;
  }
  // 카드 로고
  else if (agreement.type === "card") {
    return `/src/assets/card_logo/${name}.png`;
  }
  // 증권 로고 (은행 로고 사용)
  else if (agreement.type === "securities") {
    return `/src/assets/bank_logo/${agreement.bank}.png`;
  }

  // 기본값
  return `/src/assets/bank_logo/KB국민은행.png`;
};

const goToNext = () => {
  if (canProceed.value) {
    // ObAgreement.vue로 라우팅
    router.push("/openbanking/agreement");
  }
};
</script>

<style scoped>
.ars-agreement-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f3f4f6;
  height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  padding-bottom: 120px; /* 하단 버튼과 navbar 공간 확보 */
  overflow-y: auto; /* 스크롤 활성화 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.ars-agreement-container::-webkit-scrollbar {
  display: none;
}

.ars-agreement-header {
  margin-top: 0;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 56px;
  padding: 0 20px;
  margin-bottom: 18px;
  z-index: 1100;
  background: #f3f4f6;
}

.ars-agreement-back {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
  z-index: 1200;
}

.ars-agreement-back:hover {
  background: #f3f3f3;
}

.ars-agreement-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-title-sub);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin: 0;
}

.center-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.ars-agreement-desc {
  font-size: 0.98rem;
  color: #6b7280;
  padding: 20px 16px 12px 16px;
  line-height: 1.5;
  text-align: center;
  margin-top: 80px; /* 고정 헤더 높이 + 여백 */
}

.ars-agreement-list {
  background: #fff;
  margin: 0 16px 20px 16px; /* 하단 여백 추가 */
  border-radius: 12px;
  overflow: hidden;
}

.ars-agreement-item-all {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.15s;
  background: #fff;
}

.ars-agreement-item-all:hover {
  background: #f8f9fa;
}

.ars-agreement-checkbox-all {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ars-agreement-checkbox-all.checked {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.ars-agreement-text-all {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ars-agreement-title-all {
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

.ars-agreement-desc-all {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.ars-agreement-item {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.ars-agreement-item:last-child {
  border-bottom: none;
}

.ars-agreement-item-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.15s;
}

.ars-agreement-item-header:hover {
  background: #f9fafb;
}

.ars-agreement-content-section {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  animation: slideDown 0.3s ease-out;
}

.ars-agreement-content-detail {
  padding: 20px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.ars-agreement-content-detail h4 {
  margin: 16px 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

.ars-agreement-content-detail p {
  margin: 8px 0;
}

.ars-agreement-content-footer {
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.ars-agreement-content-btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: #4318d1;
  color: #fff;
}

.ars-agreement-content-btn:hover {
  background: #3a16b8;
}

.ars-agreement-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  cursor: pointer;
}

.ars-agreement-checkbox.checked {
  background: #10b981;
  border-color: #10b981;
}

.check-icon {
  color: #fff;
  font-size: 0.8rem;
}

.ars-agreement-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.ars-agreement-logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.ars-agreement-logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 6px;
}

.ars-agreement-text-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.ars-agreement-text {
  font-size: 0.95rem;
  color: #222;
  font-weight: 500;
  margin: 0;
}

.arrow-icon {
  color: #9ca3af;
  font-size: 0.9rem;
}

.ars-agreement-bottom {
  position: fixed;
  bottom: 80px; /* navbar 높이만큼 위로 이동 */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  background: transparent;
  z-index: 1000; /* 다른 요소들 위에 표시 */
  padding: 16px;
}

.ars-agreement-next-btn {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  background: #e5e7eb;
  color: #9ca3af;
}

.ars-agreement-next-btn.active {
  background: #4318d1;
  color: #fff;
}

.ars-agreement-next-btn.active:hover {
  background: #3a16b8;
}

.ars-agreement-next-btn:disabled {
  cursor: not-allowed;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}

@media (max-width: 430px) {
  .ars-agreement-container {
    width: 100vw;
    max-width: 100vw;
  }
  .ars-agreement-bottom {
    max-width: 100vw;
  }
}
</style>
