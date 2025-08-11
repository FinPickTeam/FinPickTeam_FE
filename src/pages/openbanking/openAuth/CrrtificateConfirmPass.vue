<template>
  <div class="confirm-password-container">
    <!-- 상단 헤더 -->
    <div class="confirm-header">
      <button class="confirm-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="confirm-title center-title">간편 비밀번호 확인</span>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="confirm-content">
      <!-- 제목 -->
      <h1 class="main-title">간편 비밀번호 확인</h1>

      <!-- 설명 -->
      <div class="description-section">
        <p class="description-text">
          설정한 6자리 숫자 비밀번호를 다시 한 번 입력해주세요.
        </p>
      </div>

      <!-- 비밀번호 확인 폼 -->
      <div class="confirm-form">
        <div class="input-group">
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
          <div class="number-row">
            <button class="number-btn clear-btn" @click="clearPassword">
              전체삭제
            </button>
            <button
              class="number-btn"
              @click="addNumber(3)"
              :disabled="confirmPassword.length >= 6"
            >
              3
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
import { useRouter } from "vue-router";
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

const confirmPassword = ref("");
const originalPassword = ref("");

// 숫자 패드 배열을 이미지와 동일하게 고정
const numberPad = ref([
  [0, 4, 6],
  [2, 5, 7],
  [8, 1, 9],
]);

// 비밀번호 일치 확인
const isPasswordMatch = computed(() => {
  return confirmPassword.value === originalPassword.value;
});

const addNumber = (number) => {
  if (confirmPassword.value.length < 6) {
    confirmPassword.value += number.toString();

    // 6자리 입력 완료 시 비밀번호가 일치하면 자동으로 완료
    if (confirmPassword.value.length === 6) {
      setTimeout(() => {
        if (isPasswordMatch.value) {
          completeCertificate();
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

onMounted(() => {
  // 세션스토리지에서 원본 비밀번호 가져오기
  const storedPassword = sessionStorage.getItem("certificatePassword");
  if (!storedPassword) {
    // 비밀번호가 없으면 1단계로 돌아가기
    router.push("/openbanking/create-certificate");
    return;
  }
  originalPassword.value = storedPassword;
});

const goBack = () => {
  router.back();
};

const completeCertificate = () => {
  if (isPasswordMatch.value && confirmPassword.value.length > 0) {
    // 인증서 생성 완료 처리
    // 여기서 실제 인증서 생성 로직을 구현할 수 있습니다

    // 세션스토리지에서 비밀번호 제거
    sessionStorage.removeItem("certificatePassword");

    // 완료 페이지로 이동 (또는 메인 페이지로)
    router.push("/openbanking/certificate-complete");
  }
};
</script>

<style scoped>
.confirm-password-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: #f3f4f6;
  min-height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
}

.confirm-header {
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
}

.confirm-back {
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

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.center-title {
  text-align: center;
}

.confirm-content {
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

.confirm-form {
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
</style>
