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
      <div class="ars-agreement-item" @click="toggleAllAgreements">
        <div class="ars-agreement-checkbox" :class="{ checked: allAgreed }">
          <font-awesome-icon
            v-if="allAgreed"
            :icon="['fas', 'check']"
            class="check-icon"
          />
        </div>
        <span class="ars-agreement-text">전체동의하기</span>
        <font-awesome-icon :icon="['fas', 'angle-right']" class="arrow-icon" />
      </div>

      <!-- 개별 약관 -->
      <div
        class="ars-agreement-item"
        v-for="(agreement, index) in agreements"
        :key="index"
        @click="toggleAgreement(index)"
      >
        <div
          class="ars-agreement-checkbox"
          :class="{ checked: agreement.checked }"
        >
          <font-awesome-icon
            v-if="agreement.checked"
            :icon="['fas', 'check']"
            class="check-icon"
          />
        </div>
        <div class="ars-agreement-content">
          <span class="ars-agreement-text">{{ agreement.securities }}</span>
          <span class="ars-agreement-subtext">{{ agreement.bank }}</span>
        </div>
        <font-awesome-icon :icon="['fas', 'angle-right']" class="arrow-icon" />
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
  "신한은행, 제주은행": {
    bank: "신한은행, 제주은행",
    securities: "신한은행, 제주은행",
    type: "bank",
  },
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
  "광주은행, 전북은행": {
    bank: "광주은행, 전북은행",
    securities: "광주은행, 전북은행",
    type: "bank",
  },
  "경남은행, 부산은행": {
    bank: "경남은행, 부산은행",
    securities: "경남은행, 부산은행",
    type: "bank",
  },

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
    bank: "신한은행, 제주은행",
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

// 선택된 항목들에 해당하는 약관만 필터링
const agreements = computed(() => {
  return selectedItems.value.map((item) => {
    const agreement = allAgreements[item.name];
    if (!agreement) {
      console.warn(`약관을 찾을 수 없습니다: ${item.name}`);
      // 기본값 제공
      return {
        bank: item.name,
        securities: item.name,
        type: item.type || "unknown",
        checked: false,
      };
    }
    return {
      ...agreement,
      checked: false,
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
  agreements.value.forEach((agreement) => {
    agreement.checked = allAgreed.value;
  });
};

const toggleAgreement = (index) => {
  agreements.value[index].checked = !agreements.value[index].checked;
  // 전체동의 상태 업데이트
  const allChecked = agreements.value.every((agreement) => agreement.checked);
  allAgreed.value = allChecked;
};

const goBack = () => {
  router.back();
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
  background: #f7f8fa;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  padding-bottom: 120px; /* 하단 버튼과 navbar 공간 확보 */
  overflow-y: auto; /* 스크롤 활성화 */
}

.ars-agreement-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
  position: relative;
}

.ars-agreement-back {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.ars-agreement-back:hover {
  background: #f3f3f3;
}

.ars-agreement-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
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
}

.ars-agreement-list {
  background: #fff;
  margin: 0 16px 20px 16px; /* 하단 여백 추가 */
  border-radius: 12px;
  overflow: hidden;
}

.ars-agreement-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.15s;
}

.ars-agreement-item:last-child {
  border-bottom: none;
}

.ars-agreement-item:hover {
  background: #f9fafb;
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
  flex-direction: column;
}

.ars-agreement-text {
  font-size: 0.95rem;
  color: #222;
  font-weight: 500;
  margin-bottom: 2px;
}

.ars-agreement-subtext {
  font-size: 0.85rem;
  color: #6b7280;
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
  padding: 16px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  z-index: 1000; /* 다른 요소들 위에 표시 */
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
