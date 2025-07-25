<template>
  <div class="agreement-container">
    <!-- 상단 헤더 -->
    <div class="agreement-header">
      <button class="agreement-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="agreement-title">서비스 가입</span>
      <div class="agreement-header-icons">
        <button class="agreement-icon-btn">
          <font-awesome-icon :icon="['fas', 'search']" />
        </button>
        <button class="agreement-icon-btn">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </div>
    </div>

    <!-- 진행 단계 표시 -->
    <div class="agreement-progress">
      <div class="progress-step active">1</div>
      <div class="progress-step">2</div>
      <div class="progress-step">3</div>
      <div class="progress-step">4</div>
    </div>

    <!-- 섹션 제목 -->
    <div class="agreement-section-title">오픈뱅킹 이용약관</div>

    <!-- 약관 목록 -->
    <div class="agreement-list">
      <!-- 전체동의 -->
      <div class="agreement-item" @click="toggleAllAgreements">
        <div class="agreement-checkbox" :class="{ checked: allAgreed }">
          <font-awesome-icon
            v-if="allAgreed"
            :icon="['fas', 'check']"
            class="check-icon"
          />
        </div>
        <span class="agreement-text">전체동의하기</span>
        <font-awesome-icon :icon="['fas', 'angle-right']" class="arrow-icon" />
      </div>

      <!-- 필수 약관들 -->
      <div
        class="agreement-item"
        v-for="(agreement, index) in agreements"
        :key="index"
        @click="toggleAgreement(index)"
      >
        <div class="agreement-checkbox" :class="{ checked: agreement.checked }">
          <font-awesome-icon
            v-if="agreement.checked"
            :icon="['fas', 'check']"
            class="check-icon"
          />
        </div>
        <span class="agreement-text">{{ agreement.title }}</span>
        <font-awesome-icon :icon="['fas', 'angle-right']" class="arrow-icon" />
      </div>
    </div>

    <!-- 확인 텍스트 -->
    <div class="agreement-confirmation">
      본인은 위 항목에 대한 내용을 충분히 이해하고 확인하였습니다.
    </div>

    <!-- 하단 버튼 -->
    <div class="agreement-bottom">
      <button
        class="agreement-next-btn"
        :class="{ active: canProceed }"
        @click="goToNext"
        :disabled="!canProceed"
      >
        다음
      </button>
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
  faAngleRight,
  faSearch,
  faBars,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faAngleRight, faSearch, faBars, faCheck);

const router = useRouter();

const agreements = ref([
  {
    title: "서비스 이용약관(필수)",
    required: true,
    checked: false,
  },
  {
    title: "참가은행 이용약관(필수)",
    required: true,
    checked: false,
  },
  {
    title: "오픈뱅킹용 개인(신용)정보수집·이용동의 (필수)",
    required: false,
    checked: false,
  },
  {
    title: "개인(신용)정보수집·이용 및 제공동의(필수)",
    required: false,
    checked: false,
  },
]);

const allAgreed = ref(false);

const canProceed = computed(() => {
  const requiredAgreements = agreements.value.filter(
    (agreement) => agreement.required
  );
  return requiredAgreements.every((agreement) => agreement.checked);
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
    // 다음 단계로 이동
    router.push("/openbanking/ars-agreement");
  }
};
</script>

<style scoped>
.agreement-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f7f8fa;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
}

.agreement-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}

.agreement-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}

.agreement-back:hover {
  background: #f3f3f3;
}

.agreement-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.agreement-header-icons {
  display: flex;
  gap: 12px;
}

.agreement-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.agreement-icon-btn:hover {
  background: #f3f3f3;
}

.agreement-progress {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 16px 0 16px;
}

.progress-step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.progress-step.active {
  background: #10b981;
  color: #fff;
}

.agreement-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  padding: 20px 16px 16px 16px;
  text-align: left;
}

.agreement-list {
  background: #fff;
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
}

.agreement-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.15s;
}

.agreement-item:last-child {
  border-bottom: none;
}

.agreement-item:hover {
  background: #f9fafb;
}

.agreement-checkbox {
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

.agreement-checkbox.checked {
  background: #10b981;
  border-color: #10b981;
}

.check-icon {
  color: #fff;
  font-size: 0.8rem;
}

.agreement-text {
  flex: 1;
  font-size: 0.95rem;
  color: #222;
  font-weight: 500;
}

.arrow-icon {
  color: #9ca3af;
  font-size: 0.9rem;
}

.agreement-confirmation {
  padding: 20px 16px;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  text-align: center;
}

.agreement-bottom {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 390px;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 80px;
}

.agreement-next-btn {
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

.agreement-next-btn.active {
  background: #4318d1;
  color: #fff;
}

.agreement-next-btn.active:hover {
  background: #3a16b8;
}

.agreement-next-btn:disabled {
  cursor: not-allowed;
}

@media (max-width: 430px) {
  .agreement-container {
    width: 100vw;
    max-width: 100vw;
  }

  .agreement-bottom {
    max-width: 100vw;
  }
}
</style>
