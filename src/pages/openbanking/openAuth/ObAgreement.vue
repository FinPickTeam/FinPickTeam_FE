<template>
  <div class="agreement-container">
    <!-- 상단 헤더 -->
    <div class="agreement-header">
      <button class="agreement-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="agreement-title center-title">오픈뱅킹 이용약관</span>
    </div>

    <!-- 안내문구 -->
    <div class="agreement-desc">
      오픈뱅킹은 은행 간 계좌 정보를 안전하게 연결하여 편리한 금융 서비스를
      제공하는 시스템입니다.
    </div>

    <!-- 약관 목록 -->
    <div class="agreement-list">
      <!-- 전체동의 -->
      <div class="agreement-item-all" @click="toggleAllAgreements">
        <div class="agreement-checkbox-all" :class="{ checked: allAgreed }">
          <font-awesome-icon
            v-if="allAgreed"
            :icon="['fas', 'check']"
            class="check-icon"
          />
        </div>
        <div class="agreement-text-all">
          <span class="agreement-title-all">전체동의하기</span>
          <span class="agreement-desc-all">모든 약관에 동의합니다</span>
        </div>
      </div>

      <!-- 개별 약관 -->
      <div
        class="agreement-item"
        v-for="(agreement, index) in agreements"
        :key="index"
      >
        <div class="agreement-item-header" @click="toggleAgreement(index)">
          <div
            class="agreement-checkbox"
            :class="{ checked: agreement.checked }"
          >
            <font-awesome-icon
              v-if="agreement.checked"
              :icon="['fas', 'check']"
              class="check-icon"
            />
          </div>
          <span class="agreement-text">{{ agreement.title }}</span>
          <font-awesome-icon
            :icon="['fas', agreement.expanded ? 'angle-up' : 'angle-right']"
            class="arrow-icon"
          />
        </div>
        <div class="agreement-content-section" v-show="agreement.expanded">
          <div class="agreement-content" v-html="agreement.content"></div>
          <div class="agreement-content-footer">
            <button
              class="agreement-content-btn"
              @click="confirmAgreement(index)"
            >
              동의
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 확인 문구 -->
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
  faAngleUp,
  faSearch,
  faBars,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faAngleRight, faAngleUp, faSearch, faBars, faCheck);

const router = useRouter();

const agreements = ref([
  {
    title: "서비스 이용약관(필수)",
    required: true,
    checked: false,
    expanded: false,
    content: `
      <h4>제1조 (목적)</h4>
      <p>이 약관은 오픈뱅킹 서비스의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
      
      <h4>제2조 (정의)</h4>
      <p>1. "오픈뱅킹"이란 은행 간 계좌 정보를 안전하게 연결하여 편리한 금융 서비스를 제공하는 시스템을 말합니다.</p>
      <p>2. "이용자"란 이 약관에 동의하고 서비스를 이용하는 고객을 말합니다.</p>
      
      <h4>제3조 (서비스 이용)</h4>
      <p>1. 이용자는 본인의 계좌 정보에 한하여 서비스를 이용할 수 있습니다.</p>
      <p>2. 이용자는 서비스 이용 시 관련 법령과 약관을 준수해야 합니다.</p>
      
      <h4>제4조 (개인정보 보호)</h4>
      <p>1. 서비스 제공자는 이용자의 개인정보를 보호하기 위해 최선을 다합니다.</p>
      <p>2. 이용자의 개인정보는 관련 법령에 따라 안전하게 관리됩니다.</p>
    `,
  },
  {
    title: "참가은행 이용약관(필수)",
    required: true,
    checked: false,
    expanded: false,
    content: `
      <h4>제1조 (참가은행)</h4>
      <p>참가은행은 오픈뱅킹 서비스에 참여하는 모든 은행을 의미합니다.</p>
      
      <h4>제2조 (서비스 범위)</h4>
      <p>1. 계좌 조회 서비스</p>
      <p>2. 이체 서비스</p>
      <p>3. 기타 금융 서비스</p>
      
      <h4>제3조 (이용자의 의무)</h4>
      <p>1. 이용자는 본인의 계좌 정보만을 이용해야 합니다.</p>
      <p>2. 이용자는 계좌 정보의 보안을 위해 노력해야 합니다.</p>
    `,
  },
  {
    title: "오픈뱅킹용 개인(신용)정보수집·이용동의 (필수)",
    required: true,
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
        <li>오픈뱅킹 서비스 제공</li>
        <li>본인확인 및 인증</li>
        <li>고객상담 및 민원처리</li>
      </ul>
      
      <p>3. 개인정보의 보유기간</p>
      <p>서비스 이용 종료 후 5년간 보관</p>
    `,
  },
  {
    title: "개인(신용)정보수집·이용 및 제공동의 (필수)",
    required: true,
    checked: false,
    expanded: false,
    content: `
      <h4>개인정보 수집·이용 및 제공 동의</h4>
      <p>1. 개인정보의 수집·이용</p>
      <ul>
        <li>수집항목: 성명, 주민등록번호, 연락처, 계좌정보</li>
        <li>이용목적: 오픈뱅킹 서비스 제공, 본인확인</li>
        <li>보유기간: 서비스 이용 종료 후 5년</li>
      </ul>
      
      <p>2. 개인정보의 제공</p>
      <ul>
        <li>제공받는 자: 참가은행</li>
        <li>제공목적: 오픈뱅킹 서비스 제공</li>
        <li>제공항목: 계좌정보, 거래내역</li>
      </ul>
      
      <p>3. 동의 거부권</p>
      <p>개인정보 수집·이용 및 제공에 대한 동의를 거부할 수 있으며, 동의 거부 시 서비스 이용이 제한됩니다.</p>
    `,
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
  padding-top: 56px;
}

.agreement-header {
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
.agreement-back {
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

.agreement-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
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
.center-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
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

.agreement-desc {
  font-size: 0.98rem;
  color: #6b7280;
  padding: 20px 16px 12px 16px;
  line-height: 1.5;
  text-align: center;
}

.agreement-list {
  background: #fff;
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
}

.agreement-item-all {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.15s;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.agreement-item-all:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.agreement-checkbox-all {
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

.agreement-checkbox-all.checked {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.agreement-text-all {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agreement-title-all {
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

.agreement-desc-all {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.agreement-item {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.agreement-item:last-child {
  border-bottom: none;
}

.agreement-item-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.15s;
}

.agreement-item-header:hover {
  background: #f9fafb;
}

.agreement-content-section {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  animation: slideDown 0.3s ease-out;
}

.agreement-content {
  padding: 20px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.agreement-content h4 {
  margin: 16px 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

.agreement-content p {
  margin: 8px 0;
}

.agreement-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.agreement-content li {
  margin: 4px 0;
}

.agreement-content-footer {
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.agreement-content-btn {
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

.agreement-content-btn:hover {
  background: #3a16b8;
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
  .agreement-container {
    width: 100vw;
    max-width: 100vw;
  }

  .agreement-bottom {
    max-width: 100vw;
  }
}
</style>
