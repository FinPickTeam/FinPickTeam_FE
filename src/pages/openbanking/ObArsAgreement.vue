<template>
  <div class="ars-agreement-container">
    <!-- 상단 헤더 -->
    <div class="ars-agreement-header">
      <button class="ars-agreement-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="ars-agreement-title">휴대폰간편인증</span>
      <div class="ars-agreement-header-icons">
        <button class="ars-agreement-icon-btn">
          <font-awesome-icon :icon="['fas', 'search']" />
        </button>
        <button class="ars-agreement-icon-btn">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </div>
    </div>

    <!-- 안내문구 -->
    <div class="ars-agreement-desc">
      휴대폰 간편인증은 스마트폰 기기정보와 통신사의 고객정보를 이용하여
      편리하고 안전한 본인확인 서비스 입니다.
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
        <span class="ars-agreement-text">{{ agreement.title }}</span>
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
        확인
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
    title: "개인정보 수집·이용 동의",
    checked: false,
  },
  {
    title: "개인정보 제공에 동의",
    checked: false,
  },
  {
    title: "서비스 이용약관에 동의",
    checked: false,
  },
]);

const allAgreed = ref(false);

const canProceed = computed(() => {
  return agreements.value.every((agreement) => agreement.checked);
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
    // 다음 단계로 이동 (원하는 라우트로 수정)
    router.push("/ars-auth");
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
}

.ars-agreement-header {
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

.ars-agreement-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #4318d1;
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

.ars-agreement-header-icons {
  display: flex;
  gap: 12px;
}

.ars-agreement-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.ars-agreement-icon-btn:hover {
  background: #f3f3f3;
}

.ars-agreement-desc {
  font-size: 0.98rem;
  color: #6b7280;
  padding: 20px 16px 12px 16px;
  line-height: 1.5;
  text-align: left;
}

.ars-agreement-list {
  background: #fff;
  margin: 0 16px;
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

.ars-agreement-text {
  flex: 1;
  font-size: 0.95rem;
  color: #222;
  font-weight: 500;
}

.arrow-icon {
  color: #9ca3af;
  font-size: 0.9rem;
}

.ars-agreement-bottom {
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
