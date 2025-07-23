<template>
  <div class="signup-container">
    <!-- 앱 브랜딩 -->
    <div class="signup-logo">
      <h1 class="logo">FinPick</h1>
      <p>금융 생활의 새로운 시작</p>
    </div>

    <!-- 회원가입 폼 -->
    <form class="signup-form" @submit.prevent="handleSignup">
      <!-- 이메일 -->
      <div class="form-group">
        <label for="email">이메일</label>
        <div class="input-group">
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="이메일을 입력하세요"
            :class="{ error: errors.email }"
            @blur="validateEmail"
          />
          <button
            type="button"
            class="check-btn"
            @click="checkEmailDuplicate"
            :disabled="!form.email || errors.email"
          >
            중복확인
          </button>
        </div>
        <span v-if="errors.email" class="error-message">{{
          errors.email
        }}</span>
      </div>

      <!-- 비밀번호 -->
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          :class="{ error: errors.password }"
          @blur="validatePassword"
        />
        <span v-if="errors.password" class="error-message">{{
          errors.password
        }}</span>
        <p class="password-requirements">
          • 8자 이상 입력, 영문과 숫자 포함, 특수문자 포함
        </p>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          :class="{ error: errors.confirmPassword }"
          @blur="validateConfirmPassword"
        />
        <span v-if="errors.confirmPassword" class="error-message">{{
          errors.confirmPassword
        }}</span>
      </div>

      <!-- 회원가입 버튼 -->
      <button type="submit" class="signup-btn">회원가입</button>
      <div v-if="warningMessage" class="warning-message">
        {{ warningMessage }}
      </div>
    </form>
    <div class="login-link-middle">
      이미 계정이 있으신가요?
      <router-link to="/login">로그인</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

const isEmailChecked = ref(false);
const warningMessage = ref('');
let warningTimeout = null;

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = '';
  } else if (!emailRegex.test(form.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다';
  } else {
    errors.email = '';
  }
};

const validatePassword = () => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!form.password) {
    errors.password = '';
  } else if (form.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다';
  } else if (!passwordRegex.test(form.password)) {
    errors.password = '영문, 숫자, 특수문자를 포함해야 합니다';
  } else {
    errors.password = '';
  }
};

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    errors.confirmPassword = '';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다';
  } else {
    errors.confirmPassword = '';
  }
};

const checkEmailDuplicate = async () => {
  if (!form.email || errors.email) return;
  // TODO: 실제 API 연동
  await new Promise((resolve) => setTimeout(resolve, 500));
  isEmailChecked.value = true;
  alert('사용 가능한 이메일입니다.');
};

const isFormValid = computed(() => {
  const isValid =
    form.email &&
    form.password &&
    form.confirmPassword &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;
  return isValid;
});

const handleSignup = async () => {
  if (!isFormValid.value) {
    warningMessage.value = '모든 항목을 올바르게 입력해주세요.';
    if (warningTimeout) clearTimeout(warningTimeout);
    warningTimeout = setTimeout(() => {
      warningMessage.value = '';
    }, 2000);
    return;
  }
  // TODO: 실제 회원가입 API 연동
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 회원가입 완료 페이지로 이동 (사용자 이름을 쿼리 파라미터로 전달)
  router.push({
    path: '/signup-complete',
    query: { userName: form.email.split('@')[0] }, // 이메일에서 사용자명 추출
  });
};
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.status-bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}
.status-icons {
  display: flex;
  gap: 8px;
}
.signup-logo {
  text-align: center;
  margin-bottom: 40px;
}
.signup-logo h1 {
  margin-bottom: 8px;
}
.signup-logo p {
  color: #888;
  font-size: 15px;
  text-align: center;
  font-weight: 400;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 0;
}
.signup-form {
  max-width: 400px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 24px;
}
.form-group label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}
.input-group {
  display: flex;
  gap: 12px;
}
.input-group input {
  flex: 1;
}
input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
input:focus {
  outline: none;
  border-color: #6b46c1;
}
input.error {
  border-color: #ef4444;
}
.check-btn {
  padding: 12px 16px;
  background: #8e74e3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.check-btn:hover {
  background: #6c4cf1;
}
.check-btn:disabled {
  background-color: #8e74e3;
  cursor: not-allowed;
}
.error-message {
  display: block;
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
}
.password-requirements {
  color: #6b7280;
  font-size: 14px;
  margin: 8px 0 0 0;
  line-height: 1.4;
}
.signup-btn {
  width: 100%;
  background: #8e74e3;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background 0.2s;
}
.signup-btn:hover {
  background: #6c4cf1;
}
.signup-btn:disabled {
  background-color: #8e74e3;
  cursor: not-allowed;
}
.login-link {
  text-align: center;
  color: #666666;
  font-size: 15px;
}
.login-link a {
  color: #4318d1;
  text-decoration: none;
  margin-left: 4px;
}
.warning-message {
  color: #ef4444;
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  animation: fadein 0.2s;
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media (max-width: 480px) {
  .signup-container {
    padding: 16px;
  }
  .app-title {
    font-size: 28px;
  }
  .input-group {
    flex-direction: column;
  }
  .check-btn {
    width: 100%;
  }
}

.login-link-fixed {
  text-align: center;
  color: #666666;
  font-size: 15px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 32px;
  z-index: 10;
  background: transparent;
}
@media (max-width: 480px) {
  .login-link-fixed {
    bottom: 16px;
  }
}

/* 스타일 */
.login-link-middle {
  text-align: center;
  color: #666666;
  font-size: 15px;
  margin: 48px 0 0 0;
}
@media (max-width: 480px) {
  .login-link-middle {
    margin-top: 32px;
  }
}
</style>
