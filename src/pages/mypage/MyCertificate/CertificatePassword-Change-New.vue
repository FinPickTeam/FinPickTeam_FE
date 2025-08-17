<template>
  <div class="password-change-container">
    <!-- 상단 헤더 -->
    <div class="password-header">
      <button class="password-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="password-title center-title">비밀번호 변경</span>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="password-content">

      <div class="progress-section">
        <div class="progress-steps">
          <div class="step active">
            <div class="step-number">1</div>
            <span class="step-text">현재 비밀번호</span>
          </div>
          <div class="step-line"></div>
          <div class="step active">
            <div class="step-number">2</div>
            <span class="step-text">새 비밀번호</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-number">3</div>
            <span class="step-text">확인</span>
          </div>
        </div>
      </div>
      <!-- 제목 -->
      <h1 class="main-title">새 비밀번호 입력</h1>

      <!-- 설명 -->
      <div class="description-section">
        <p class="description-text">새로운 간편 비밀번호를 입력해주세요.</p>
      </div>

      <!-- 비밀번호 입력 폼 -->
      <div class="password-form">
        <div class="input-group">
          <label class="input-label">새 비밀번호</label>
          <div class="password-display">
            <div class="password-dots">
              <div
                v-for="i in 6"
                :key="i"
                class="password-dot"
                :class="{ filled: i <= newPassword.length }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 숫자 패드 -->
        <div class="number-pad">
          <div
            class="number-row"
            v-for="(row, index) in numberPad.slice(0, 3)"
            :key="index"
          >
            <button
              v-for="number in row"
              :key="number"
              class="number-btn"
              @click="addNumber(number)"
              :disabled="newPassword.length >= 6"
            >
              {{ number }}
            </button>
          </div>
          <div class="number-row">
            <button class="number-btn clear-btn" @click="clearPassword">
              전체삭제
            </button>
            <button
              class="number-btn"
              @click="addNumber(numberPad[3])"
              :disabled="newPassword.length >= 6"
            >
              {{ numberPad[3] }}
            </button>
            <button class="number-btn delete-btn" @click="deleteNumber">
              <font-awesome-icon :icon="['fas', 'backspace']" />
            </button>
          </div>
        </div>
      </div>
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
  faTimes,
  faBackspace,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faTimes, faBackspace);

const router = useRouter();
const route = useRoute();

const newPassword = ref("");
const currentPassword = ref("");

// 숫자 패드 배열을 랜덤하게 생성하는 함수
const generateRandomNumberPad = () => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);

  return [
    [shuffled[0], shuffled[1], shuffled[2]],
    [shuffled[3], shuffled[4], shuffled[5]],
    [shuffled[6], shuffled[7], shuffled[8]],
    shuffled[9], // 10번째 숫자
  ];
};

// 숫자 패드 배열을 랜덤하게 생성
const numberPad = ref(generateRandomNumberPad());

// 비밀번호 유효성 검사 (6자리 숫자)
const isPasswordValid = computed(() => {
  return newPassword.value.length === 6 && /^\d{6}$/.test(newPassword.value);
});

onMounted(() => {
  currentPassword.value = route.query.currentPassword || "";
});

const addNumber = (number) => {
  if (newPassword.value.length < 6) {
    newPassword.value += number.toString();

    // 6자리 입력 완료 시 자동으로 다음 페이지로 이동
    if (newPassword.value.length === 6) {
      setTimeout(() => {
        nextStep();
      }, 300); // 0.3초 후 자동 이동
    }
  }
};

const deleteNumber = () => {
  if (newPassword.value.length > 0) {
    newPassword.value = newPassword.value.slice(0, -1);
  }
};

const clearPassword = () => {
  newPassword.value = "";
};

const goBack = () => {
  router.back();
};

const nextStep = () => {
  if (isPasswordValid.value) {
    router.push({
      name: "certificate-password-change-confirm",
      query: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
    });
  }
};
</script>

<style scoped>
.password-change-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f3f4f6;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
  box-sizing: border-box;
}

.password-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 0 16px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e5e7eb;
}

.password-back {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
}

.password-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.center-title {
  text-align: center;
}

.password-content {
  padding: 24px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin: 0 0 12px 0;
  text-align: center;
}

.description-section {
  margin-bottom: 32px;
  text-align: center;
}

.description-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.password-form {
  margin-bottom: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 32px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
}

.password-display {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
}

.password-dots {
  display: flex;
  gap: 16px;
}

.password-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: all 0.2s ease;
}

.password-dot.filled {
  background: var(--color-main);
}

.number-pad {
  margin-top: auto;
  background: transparent;
  padding: 0;
  width: 100%;
  max-width: 390px;
  margin-left: auto;
  margin-right: auto;
}

.number-row {
  display: flex;
  gap: 0;
  margin-bottom: 0;
  justify-content: space-between;
  width: 100%;
}

.number-row:last-child {
  margin-bottom: 0;
}

.number-btn {
  width: 33.333%;
  height: 60px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.number-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}

.number-btn:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.1);
}

.number-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  color: #333;
  font-size: 14px;
}

.delete-btn {
  color: #333;
}

.progress-section {
  margin-bottom: 32px;
}

.progress-steps {
  display: flex;
  align-items: center;
  /*justify-content: center;*/
  gap: 0;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.step.completed .step-number {
  background: var(--color-success);
  color: #fff;
}

.step.active .step-number {
  background: var(--color-main);
  color: #fff;
}

.step-text {
  font-size: 10px;
  color: #999;
  font-weight: 500;
}

.step.completed .step-text,
.step.active .step-text {
  color: #222;
}

.step-line {
  width: 20px;
  height: 1px;
  background: #e0e0e0;
}
</style>
