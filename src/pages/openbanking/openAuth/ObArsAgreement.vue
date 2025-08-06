<template>
  <div class="ars-agreement-container">
    <!-- 상단 헤더 -->
    <div class="ars-agreement-header">
      <button class="ars-agreement-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="ars-agreement-title center-title">ARS 이용약관</span>
    </div>

    <!-- 안내문구 -->
    <div class="ars-agreement-desc">
      ARS 인증은 전화를 통한 음성 안내를 따라 본인확인을 진행하는 서비스입니다.
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
        <div class="ars-agreement-item-header" @click="toggleAgreement(index)">
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
          <font-awesome-icon
            :icon="['fas', agreement.expanded ? 'angle-up' : 'angle-right']"
            class="arrow-icon"
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

    <!-- 확인 문구 -->
    <div class="ars-agreement-confirmation">
      본인은 위 항목에 대한 내용을 충분히 이해하고 확인하였습니다.
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
    expanded: false,
    content: `
      <h4>개인정보 수집·이용 동의</h4>
      <p>1. 수집하는 개인정보 항목</p>
      <ul>
        <li>성명, 주민등록번호, 연락처</li>
        <li>계좌번호, 은행명</li>
        <li>기타 서비스 이용에 필요한 정보</li>
      </ul>
      
      <p>2. 개인정보의 이용목적</p>
      <ul>
        <li>ARS 인증 서비스 제공</li>
        <li>본인확인 및 인증</li>
        <li>고객상담 및 민원처리</li>
      </ul>
      
      <p>3. 개인정보의 보유기간</p>
      <p>서비스 이용 종료 후 5년간 보관</p>
    `,
  },
  {
    title: "개인정보 제공에 동의",
    checked: false,
    expanded: false,
    content: `
      <h4>개인정보 제공 동의</h4>
      <p>1. 개인정보의 제공</p>
      <ul>
        <li>제공받는 자: ARS 서비스 제공업체</li>
        <li>제공목적: ARS 인증 서비스 제공</li>
        <li>제공항목: 성명, 주민등록번호, 연락처</li>
      </ul>
      
      <p>2. 제공 기간</p>
      <p>서비스 이용 종료 시까지</p>
      
      <p>3. 동의 거부권</p>
      <p>개인정보 제공에 대한 동의를 거부할 수 있으며, 동의 거부 시 서비스 이용이 제한됩니다.</p>
    `,
  },
  {
    title: "서비스 이용약관에 동의",
    checked: false,
    expanded: false,
    content: `
      <h4>ARS 서비스 이용약관</h4>
      <p>1. 서비스 내용</p>
      <ul>
        <li>ARS 인증 서비스</li>
        <li>본인확인 서비스</li>
        <li>기타 관련 서비스</li>
      </ul>
      
      <p>2. 이용자의 의무</p>
      <ul>
        <li>정확한 정보 제공</li>
        <li>서비스 이용 시 관련 법령 준수</li>
        <li>타인의 정보 도용 금지</li>
      </ul>
      
      <p>3. 서비스 제공자의 의무</p>
      <ul>
        <li>안정적인 서비스 제공</li>
        <li>개인정보 보호</li>
        <li>고객상담 및 민원처리</li>
      </ul>
    `,
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
  // 다른 모든 항목들을 접기
  agreements.value.forEach((agreement, i) => {
    if (i !== index) {
      agreement.expanded = false;
    }
  });

  // 현재 항목 토글
  agreements.value[index].expanded = !agreements.value[index].expanded;
};

const confirmAgreement = (index) => {
  agreements.value[index].checked = true;
  agreements.value[index].expanded = false;

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
  padding-top: 56px;
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
  position: sticky;
  top: 0;
  z-index: 100;
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
  text-align: center;
}

.ars-agreement-list {
  background: #fff;
  margin: 0 16px;
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.ars-agreement-item-all:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
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

.ars-agreement-content-detail ul {
  margin: 8px 0;
  padding-left: 20px;
}

.ars-agreement-content-detail li {
  margin: 4px 0;
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

.ars-agreement-confirmation {
  font-size: 0.9rem;
  color: #6b7280;
  padding: 20px 16px;
  line-height: 1.5;
  text-align: center;
  background: #fff;
  margin: 0 16px;
  border-radius: 12px;
  margin-top: 16px;
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
