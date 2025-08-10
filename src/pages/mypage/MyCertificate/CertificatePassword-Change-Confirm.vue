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
      <!-- 진행 단계 표시 -->
      <div class="progress-section">
        <div class="progress-steps">
          <div class="step completed">
            <div class="step-number">1</div>
            <span class="step-text">현재 비밀번호</span>
          </div>
          <div class="step-line"></div>
          <div class="step completed">
            <div class="step-number">2</div>
            <span class="step-text">새 비밀번호</span>
          </div>
          <div class="step-line"></div>
          <div class="step active">
            <div class="step-number">3</div>
            <span class="step-text">확인</span>
          </div>
        </div>
      </div>

      <!-- 제목 -->
      <h1 class="main-title">비밀번호 확인</h1>

      <!-- 설명 -->
      <div class="description-section">
        <p class="description-text">
          새로운 비밀번호를 다시 한 번 입력해주세요.
        </p>
      </div>

      <!-- 비밀번호 확인 폼 -->
      <div class="password-form">
        <div class="input-group">
          <label class="input-label">비밀번호 확인</label>
          <div class="password-display">
            <div class="password-dots">
              <div
                v-for="i in 6"
                :key="i"
                class="password-dot"
                :class="{
                  filled: i <= confirmPassword.length,
                  correct: i <= confirmPassword.length && isPasswordMatch,
                  incorrect:
                    i <= confirmPassword.length &&
                    !isPasswordMatch &&
                    confirmPassword.length === 6,
                }"
              ></div>
            </div>
          </div>
          <div class="password-match" v-if="confirmPassword.length > 0">
            <font-awesome-icon
              :icon="['fas', isPasswordMatch ? 'check' : 'times']"
              :class="{
                'text-success': isPasswordMatch,
                'text-error': !isPasswordMatch,
              }"
            />
            <span
              :class="{
                'text-success': isPasswordMatch,
                'text-error': !isPasswordMatch,
              }"
            >
              {{
                isPasswordMatch
                  ? "비밀번호가 일치합니다"
                  : "비밀번호가 일치하지 않습니다"
              }}
            </span>
          </div>
        </div>

        <!-- 숫자 패드 -->
        <div class="number-pad">
          <!-- 1-9 숫자 버튼들 (랜덤 순서) -->
          <div class="number-row" v-for="row in numberPad" :key="row.join('')">
            <button
              v-for="number in row"
              :key="number"
              class="number-btn"
              @click="addNumber(number)"
              :disabled="confirmPassword.length >= 6"
            >
              {{ number }}
            </button>
          </div>

          <!-- 하단 3개 버튼: 전체삭제, 0, 백스페이스 -->
          <button class="number-btn clear-btn" @click="clearPassword">
            전체삭제
          </button>
          <button
            class="number-btn"
            @click="addNumber(0)"
            :disabled="confirmPassword.length >= 6"
          >
            0
          </button>
          <button class="number-btn delete-btn" @click="deleteNumber">
            <font-awesome-icon :icon="['fas', 'backspace']" />
          </button>
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
  faCheck,
  faTimes,
  faBackspace,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faCheck, faTimes, faBackspace);

const router = useRouter();
const route = useRoute();

const confirmPassword = ref("");
const currentPassword = ref("");
const newPassword = ref("");

// 숫자 패드 배열을 랜덤하게 생성
const generateRandomNumberPad = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffled = numbers.sort(() => Math.random() - 0.5);
  return [shuffled.slice(0, 3), shuffled.slice(3, 6), shuffled.slice(6, 9)];
};

const numberPad = ref(generateRandomNumberPad());

// 비밀번호 일치 확인
const isPasswordMatch = computed(() => {
  return confirmPassword.value === newPassword.value;
});

onMounted(() => {
  currentPassword.value = route.query.currentPassword || "";
  newPassword.value = route.query.newPassword || "";
});

const addNumber = (number) => {
  if (confirmPassword.value.length < 6) {
    confirmPassword.value += number.toString();

    // 6자리 입력 완료 시 비밀번호가 일치하면 자동으로 완료
    if (confirmPassword.value.length === 6) {
      setTimeout(() => {
        if (isPasswordMatch.value) {
          completePasswordChange();
        }
      }, 300); // 0.3초 후 자동 완료
    }
  }
};

const deleteNumber = () => {
  if (confirmPassword.value.length > 0) {
    confirmPassword.value = confirmPassword.value.slice(0, -1);
  }
};

const clearPassword = () => {
  confirmPassword.value = "";
};

const goBack = () => {
  router.back();
};

const completePasswordChange = () => {
  if (isPasswordMatch.value && confirmPassword.value.length > 0) {
    // 비밀번호 변경 완료 처리
    // 여기서 실제 비밀번호 변경 로직을 구현할 수 있습니다

    // 완료 페이지로 이동
    router.push("/mypage");
  }
};
</script>

<style scoped>
.password-change-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f7f8fa;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
}

.password-header {
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

.progress-section {
  margin-bottom: 32px;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

.password-dot.correct {
  background: var(--color-success);
}

.password-dot.incorrect {
  background: #f44336;
}

.password-match {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.text-success {
  color: var(--color-success);
}

.text-error {
  color: #f44336;
}

.number-pad {
  margin-top: auto;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  max-width: 100%;
  height: 300px;
  width: 100%;
}

.number-row {
  display: contents;
}

.number-btn {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  background: #f8f9fa;
  color: #222;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.number-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.number-btn:active:not(:disabled) {
  background: #dee2e6;
}

.number-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  color: #dc3545;
  font-size: 14px;
  font-weight: 500;
  background: #f8f9fa;
}

.clear-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.delete-btn {
  color: #6c757d;
  font-size: 18px;
  background: #f8f9fa;
}

.delete-btn:hover:not(:disabled) {
  background: #e9ecef;
}
</style>
