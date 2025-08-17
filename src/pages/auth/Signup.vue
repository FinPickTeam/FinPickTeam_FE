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

          <!-- 인증 상태/메시지 -->
          <span v-if="isEmailVerified" class="badge-verified">인증완료</span>
          <span
            v-else-if="emailCheckMessage"
            :class="emailCheckMessageClass"
            class="email-check-message"
          >
            {{ emailCheckMessage }}
          </span>
        </div>

        <div class="input-group">
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            placeholder="이메일을 입력하세요"
            :class="{ error: errors.email }"
            @blur="validateEmail"
            :disabled="submitting || isEmailVerified"
          />

          <!-- 인증요청 / 재전송 -->
          <button
            type="button"
            class="check-btn"
            @click="handleEmailVerifyRequest"
            :disabled="
              submitting ||
              !form.email ||
              !!errors.email ||
              resendCooldown > 0 ||
              isEmailVerified
            "
          >
            {{ resendCooldown > 0 ? `재전송(${resendCooldown}s)` : '인증요청' }}
          </button>
        </div>

        <!-- 이메일 에러 -->
        <span v-if="errors.email" class="error-message">{{
          errors.email
        }}</span>

        <!-- 인증 코드 입력/타이머 영역 -->
        <div v-if="showVerifyBox" class="verify-box">
          <div class="verify-input-group">
            <input
              v-model.trim="code"
              maxlength="6"
              placeholder="6자리 인증코드"
              @input="onCodeInput"
            />
            <button
              type="button"
              class="check-btn"
              @click="handleEmailVerifyConfirm"
              :disabled="verifying || code.length !== 6"
            >
              {{ verifying ? '확인중...' : '인증확인' }}
            </button>
          </div>
          <div class="verify-hint">남은 시간: {{ minutes }}:{{ seconds }}</div>
        </div>
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
import { ref, reactive, computed, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

// 기존 API (프로젝트에 따라 index.js로 re-export 되었을 수 있음)
import { signup, checkEmailDuplicate } from '@/api/index.js';

// 이메일 인증용 신규 API (authApi.js에 추가해둔 것 사용)
import {
  requestEmailVerification,
  confirmEmailVerification,
  getEmailVerifyStatus,
} from '@/api/authApi.js';

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
const isEmailVerified = ref(false);
const emailCheckMessage = ref('');
const emailCheckMessageClass = ref('');
const warningMessage = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const submitting = ref(false);

let warningTimeout = null;

// 인증 코드/타이머
const code = ref('');
const countdown = ref(0); // 전체 남은 초(초 단위)
const resendCooldown = ref(0); // 재전송 쿨타임(초)
const verifying = ref(false);
let timerId = null;
let cooldownId = null;

// ── Utils ─────────────────────────────────────────
const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () =>
  (showConfirmPassword.value = !showConfirmPassword.value);

const showWarning = (msg) => {
  warningMessage.value = msg;
  if (warningTimeout) clearTimeout(warningTimeout);
  warningTimeout = setTimeout(() => (warningMessage.value = ''), 2000);
};

const resetVerifyState = () => {
  // 이메일이 바뀌면 인증상태 초기화
  isEmailChecked.value = false;
  isEmailVerified.value = false;
  emailCheckMessage.value = '';
  emailCheckMessageClass.value = '';
  code.value = '';
  clearInterval(timerId);
  clearInterval(cooldownId);
  countdown.value = 0;
  resendCooldown.value = 0;
};

watch(
  () => form.email,
  () => {
    resetVerifyState();
    validateEmail(); // 형식 즉시 검증
  }
);

// 타이머 시작/정리
const startCountdown = (sec = 300) => {
  clearInterval(timerId);
  countdown.value = sec;
  timerId = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timerId);
      return;
    }
    countdown.value -= 1;
  }, 1000);
};

const startCooldown = (sec = 60) => {
  clearInterval(cooldownId);
  resendCooldown.value = sec;
  cooldownId = setInterval(() => {
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownId);
      return;
    }
    resendCooldown.value -= 1;
  }, 1000);
};

onUnmounted(() => {
  clearInterval(timerId);
  clearInterval(cooldownId);
  if (warningTimeout) clearTimeout(warningTimeout);
});

// mm:ss 표시
const minutes = computed(() =>
  String(Math.floor(countdown.value / 60)).padStart(2, '0')
);
const seconds = computed(() => String(countdown.value % 60).padStart(2, '0'));

// 인증 UI 노출 조건
const showVerifyBox = computed(
  () => countdown.value > 0 && !isEmailVerified.value
);

// ── Validation ────────────────────────────────────
const validateEmail = () => {
  // 이메일은 소문자 정규화 (백엔드도 toLowerCase 권장)
  if (form.email) form.email = form.email.trim().toLowerCase();

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

// ── 이메일 중복확인/인증 로직 ──────────────────────
// 중복확인 함수 (현재는 handleEmailVerifyRequest에서 통합 처리)
// const handleEmailDuplicateCheck = async () => {
//   if (!form.email || errors.email) return;
//   try {
//     const response = await checkEmailDuplicate(form.email);
//     if (response.status === 200) {
//       isEmailChecked.value = true;
//       emailCheckMessage.value = '사용 가능한 이메일입니다.';
//       emailCheckMessageClass.value = 'success';
//     } else if (response.status === 409) {
//       isEmailChecked.value = false;
//       emailCheckMessage.value = '중복된 이메일입니다.';
//       emailCheckMessageClass.value = 'error';
//     } else {
//       isEmailChecked.value = false;
//       emailCheckMessage.value = '예상치 못한 응답입니다.';
//       emailCheckMessageClass.value = 'error';
//     }
//   } catch {
//     isEmailChecked.value = false;
//     emailCheckMessage.value = '중복된 이메일입니다.';
//     emailCheckMessageClass.value = 'error';
//   }
// };

const handleEmailVerifyRequest = async () => {
  if (!form.email || errors.email)
    return showWarning('올바른 이메일을 입력해주세요.');

  try {
    // 1단계: 중복확인 API 호출
    const duplicateResponse = await checkEmailDuplicate(form.email);

    if (duplicateResponse.status === 409) {
      // 중복된 이메일인 경우
      isEmailChecked.value = false;
      emailCheckMessage.value = '중복된 이메일입니다.';
      emailCheckMessageClass.value = 'error';
      return;
    } else if (duplicateResponse.status !== 200) {
      // 예상치 못한 응답
      isEmailChecked.value = false;
      emailCheckMessage.value = '예상치 못한 응답입니다.';
      emailCheckMessageClass.value = 'error';
      return;
    }

    // 중복확인 성공
    isEmailChecked.value = true;
    emailCheckMessage.value = '사용 가능한 이메일입니다.';
    emailCheckMessageClass.value = 'success';

    // 2단계: 인증요청 API 호출
    await requestEmailVerification(form.email);

    // 인증 상태/타이머 초기화 및 시작
    isEmailVerified.value = false;
    code.value = '';
    startCountdown(300); // 5분
    startCooldown(60); // 60초 쿨다운

    emailCheckMessage.value =
      '인증 코드가 발송되었습니다. 메일함을 확인해주세요.';
    emailCheckMessageClass.value = 'success';
  } catch (e) {
    // 중복확인 실패 시에도 중복된 이메일로 처리
    if (e?.response?.status === 409) {
      isEmailChecked.value = false;
      emailCheckMessage.value = '중복된 이메일입니다.';
      emailCheckMessageClass.value = 'error';
    } else {
      const msg = e?.response?.data?.message || '인증코드 발송 실패';
      showWarning(msg);
    }
  }
};

const onCodeInput = () => {
  if (code.value.length > 6) code.value = code.value.slice(0, 6);
  // 숫자만 남기기 (선택)
  code.value = code.value.replace(/\D/g, '');
};

const handleEmailVerifyConfirm = async () => {
  if (!code.value || code.value.length !== 6) {
    return showWarning('6자리 코드를 입력해주세요.');
  }
  try {
    verifying.value = true;

    // 백엔드: /api/user/email/verify/confirm
    await confirmEmailVerification(form.email, code.value);

    // 성공 → 플래그 세팅, 타이머 종료
    isEmailVerified.value = true;
    clearInterval(timerId);
    countdown.value = 0;

    emailCheckMessage.value = '이메일 인증이 완료되었습니다.';
    emailCheckMessageClass.value = 'success';
  } catch (e) {
    const msg = e?.response?.data?.message || '인증 실패';
    showWarning(msg);
  } finally {
    verifying.value = false;
  }
};

// 가입 버튼 활성화 판단
const isFormValid = computed(() => {
  const baseValid =
    form.email &&
    form.password &&
    form.confirmPassword &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  // 조건: 중복확인 + 이메일 인증 완료
  if (!REQUIRE_EMAIL_CHECK) return baseValid && isEmailVerified.value;
  return baseValid && isEmailChecked.value && isEmailVerified.value;
});

// ── 최종 회원가입 ──────────────────────────────────
const handleSignup = async () => {
  if (!isFormValid.value) {
    showWarning('모든 항목을 올바르게 입력해주세요.');
    return;
  }
  if (REQUIRE_EMAIL_CHECK && !isEmailChecked.value) {
    showWarning('이메일 중복확인을 해주세요.');
    return;
  }
  if (!isEmailVerified.value) {
    showWarning('이메일 인증을 완료해주세요.');
    return;
  }

  try {
    submitting.value = true;

    const requestBody = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      passwordConfirm: form.confirmPassword,
    };

    const response = await signup(requestBody);

    if (response.status >= 200 && response.status < 300) {
      // 가입 직후 자동 로그인
      const ok = await authStore.login({
        email: requestBody.email,
        password: requestBody.password,
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
.signup-logo {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
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
  background: var(--color-main-dark);
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
  background: var(--color-main-dark);
}
.check-btn:disabled {
  background-color: var(--color-main-dark);
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
  background: var(--color-main-dark);
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
  background: var(--color-main-dark);
}
.signup-btn:disabled {
  background-color: var(--color-main-dark);
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

.login-link-middle {
  text-align: center;
  color: #666666;
  font-size: 15px;
  margin: 48px 0 0 0;
}

.badge-verified {
  background: #10b98122;
  color: #10b981;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.verify-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.verify-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.verify-box input {
  max-width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  background: #fff;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
}

.verify-box input:focus {
  border-color: var(--color-main);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.verify-box .check-btn {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  background: var(--color-main);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.verify-box .check-btn:hover:not(:disabled) {
  background: var(--color-main-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
}

.verify-box .check-btn:disabled {
  background: #e9ecef;
  color: #6b7280;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.verify-hint {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 8px;
  text-align: center;
}
</style>
