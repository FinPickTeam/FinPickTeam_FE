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
        <div class="label-container">
          <label for="email">이메일</label>
          <span
            v-if="emailCheckMessage"
            :class="emailCheckMessageClass"
            class="email-check-message"
          >
            {{ emailCheckMessage }}
          </span>
        </div>
        <div class="input-group">
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="이메일을 입력하세요"
            :class="{ error: errors.email }"
            @blur="validateEmail"
            :disabled="submitting"
          />
          <button
            type="button"
            class="check-btn"
            @click="handleEmailDuplicateCheck"
            :disabled="submitting || !form.email || !!errors.email"
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
        <div class="input-wrapper">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="비밀번호를 입력하세요"
            :class="{ error: errors.password }"
            @blur="validatePassword"
            :disabled="submitting"
          />
          <span class="icon" @click="togglePassword">
            <i
              :class="
                showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'
              "
            ></i>
          </span>
        </div>
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
        <div class="input-wrapper">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="비밀번호를 다시 입력하세요"
            :class="{ error: errors.confirmPassword }"
            @blur="validateConfirmPassword"
            :disabled="submitting"
          />
          <span class="icon" @click="toggleConfirmPassword">
            <i
              :class="
                showConfirmPassword
                  ? 'fa-solid fa-eye'
                  : 'fa-solid fa-eye-slash'
              "
            ></i>
          </span>
        </div>
        <span v-if="errors.confirmPassword" class="error-message">{{
          errors.confirmPassword
        }}</span>
      </div>

      <!-- 회원가입 버튼 -->
      <button
        type="submit"
        class="signup-btn"
        :disabled="submitting || !isFormValid"
      >
        {{ submitting ? '처리 중...' : '회원가입' }}
      </button>
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
import { signup, checkEmailDuplicate } from '@/api/index.js';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const REQUIRE_EMAIL_CHECK = true;

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
const emailCheckMessage = ref('');
const emailCheckMessageClass = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const submitting = ref(false);
let warningTimeout = null;

const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () =>
  (showConfirmPassword.value = !showConfirmPassword.value);

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

const handleEmailDuplicateCheck = async () => {
  if (!form.email || errors.email) return;
  try {
    const response = await checkEmailDuplicate(form.email);
    if (response.status === 200) {
      isEmailChecked.value = true;
      emailCheckMessage.value = '사용 가능한 이메일입니다.';
      emailCheckMessageClass.value = 'success';
    } else if (response.status === 409) {
      isEmailChecked.value = false;
      emailCheckMessage.value = '중복된 이메일입니다.';
      emailCheckMessageClass.value = 'error';
    } else {
      isEmailChecked.value = false;
      emailCheckMessage.value = '예상치 못한 응답입니다.';
      emailCheckMessageClass.value = 'error';
    }
  } catch {
    isEmailChecked.value = false;
    emailCheckMessage.value = '중복된 이메일입니다.';
    emailCheckMessageClass.value = 'error';
  }
};

const isFormValid = computed(() => {
  const baseValid =
    form.email &&
    form.password &&
    form.confirmPassword &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  if (!REQUIRE_EMAIL_CHECK) return baseValid;
  return baseValid && isEmailChecked.value;
});

const showWarning = (msg) => {
  warningMessage.value = msg;
  if (warningTimeout) clearTimeout(warningTimeout);
  warningTimeout = setTimeout(() => (warningMessage.value = ''), 2000);
};

const handleSignup = async () => {
  if (!isFormValid.value) {
    showWarning('모든 항목을 올바르게 입력해주세요.');
    return;
  }
  if (REQUIRE_EMAIL_CHECK && !isEmailChecked.value) {
    showWarning('이메일 중복확인을 해주세요.');
    return;
  }

  try {
    submitting.value = true;

    const requestBody = {
      email: form.email,
      password: form.password,
      passwordConfirm: form.confirmPassword,
    };

    const response = await signup(requestBody);

    if (response.status >= 200 && response.status < 300) {
      const ok = await authStore.login({
        email: form.email,
        password: form.password,
      });

      if (ok) {
        router.push('/auth/signup-complete');
      } else {
        showWarning(authStore.error || '로그인에 실패했습니다.');
      }
    } else {
      showWarning(response.message || '회원가입에 실패했습니다.');
    }
  } catch (error) {
    showWarning(error?.response?.data?.message || '오류가 발생했습니다.');
  } finally {
    submitting.value = false;
  }
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

.label-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.email-check-message {
  display: inline;
  font-size: 14px;
  margin-bottom: 6px;
}

.email-check-message.success {
  color: #10b981;
}

.email-check-message.error {
  color: #ef4444;
}
.input-group {
  display: flex;
  gap: 12px;
}
.input-group input {
  flex: 1;
}
.input-wrapper {
  position: relative;
  margin-bottom: 0;
}
.input-wrapper input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.input-wrapper .icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #888;
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

.login-link-middle {
  text-align: center;
  color: #666666;
  font-size: 15px;
  margin: 48px 0 0 0;
}
</style>
