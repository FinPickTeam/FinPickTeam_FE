<template>
  <div class="pin-auth-container">
    <div class="pin-auth-header">
      <button class="pin-auth-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="pin-auth-title">간편 인증</span>
    </div>

    <div class="pin-auth-content">
      <h1 class="main-title">간편 비밀번호 입력</h1>
      <p class="description-text">오픈뱅킹 서비스를 이용하려면<br />간편 비밀번호 6자리를 입력해주세요.</p>

      <div class="password-form">
        <div class="input-group">
          <div class="password-display">
            <div class="password-dots">
              <div
                  v-for="i in 6"
                  :key="i"
                  class="password-dot"
                  :class="{ filled: i <= password.length }"
              ></div>
            </div>
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>

        <div class="number-pad">
          <div class="number-row" v-for="(row, index) in numberPad.slice(0, 3)" :key="index">
            <button v-for="number in row" :key="number" class="number-btn" @click="addNumber(number)" :disabled="password.length >= 6">
              {{ number }}
            </button>
          </div>
          <div class="number-row">
            <button class="number-btn clear-btn" @click="clearPassword">전체삭제</button>
            <button class="number-btn" @click="addNumber(numberPad[3])" :disabled="password.length >= 6">
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
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, faBackspace } from "@fortawesome/free-solid-svg-icons";
import { pinLogin } from "@/api/authApi.js";

library.add(faAngleLeft, faBackspace);

const router = useRouter();
const route = useRoute();

const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const shakeError = ref(false);

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
const numberPad = ref(generateRandomNumberPad());

const addNumber = (number) => {
  if (password.value.length >= 6) return;
  errorMessage.value = "";
  password.value += number.toString();
  if (password.value.length === 6) {
    setTimeout(() => {
      verifyPassword();
    }, 300);
  }
};

const verifyPassword = async () => {
  isLoading.value = true;
  try {
    await pinLogin(parseInt(password.value, 10));
    sessionStorage.setItem('openBankingAuthenticated', 'true');
    const redirectPath = route.query.redirect || { name: "OpenBankingMyHome" };
    await router.replace(redirectPath);
  } catch (error) {
    const response = error.response;
    if (response?.data?.status === 200) {
      sessionStorage.setItem('openBankingAuthenticated', 'true');
      const redirectPath = route.query.redirect || { name: "OpenBankingMyHome" };
      await router.replace(redirectPath);
    } else {
      errorMessage.value = response?.data?.message || error.message || "인증에 실패했습니다.";
      triggerShakeError();
    }
  } finally {
    isLoading.value = false;
  }
};

const triggerShakeError = () => {
  shakeError.value = true;
  setTimeout(() => {
    shakeError.value = false;
    clearPassword();
    numberPad.value = generateRandomNumberPad();
  }, 800);
};

const deleteNumber = () => {
  if (password.value.length > 0) {
    password.value = password.value.slice(0, -1);
  }
};

const clearPassword = () => {
  password.value = "";
  errorMessage.value = "";
};

const goBack = () => {
  router.push({ name: 'Home' });
};
</script>

<style scoped>
.pin-auth-container {
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
.pin-auth-header {
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
.pin-auth-back {
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
.pin-auth-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}
.pin-auth-content {
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
.description-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  margin-bottom: 32px;
}
.password-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.input-group {
  margin-bottom: 32px;
}
.password-display {
  background: #fff;
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
.error-message {
  color: #ef4444;
  text-align: center;
  margin-top: 12px;
  min-height: 1em;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 13px;
}
.number-pad {
  margin-top: auto;
}
.number-row {
  display: flex;
  justify-content: space-between;
}
.number-btn {
  width: 33.333%;
  height: 60px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}
.number-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}
.number-btn:disabled {
  opacity: 0.5;
}
.clear-btn {
  font-size: 14px;
}
</style>