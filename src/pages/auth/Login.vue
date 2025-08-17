<template>
  <div class="login-container">
    <div class="login-logo">
      <h1 class="logo">FinPick</h1>
      <p>금융 생활의 새로운 시작</p>
    </div>

    <form class="form" @submit.prevent="handleLogin">
      <label for="email">이메일</label>
      <div class="input-wrapper">
        <input
          id="email"
          type="email"
          v-model.trim="email"
          placeholder="이메일을 입력하세요"
          required
        />
        <i class="fa-solid fa-envelope icon"></i>
      </div>

      <label for="password">비밀번호</label>
      <div class="input-wrapper">
        <input
          id="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="비밀번호를 입력하세요"
          required
        />
        <span class="icon" @click="togglePassword">
          <i
            :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
          ></i>
        </span>
      </div>

      <div class="find-password">
        <div class="find-links">
          <a href="#">아이디 찾기</a>
          <span class="separator">|</span>
          <a href="#">비밀번호 찾기</a>
        </div>
      </div>

      <button class="login-btn" type="submit" :disabled="auth.loading">
        {{ auth.loading ? '로그인 중...' : '로그인' }}
      </button>

      <p v-if="auth.error" class="error-text">{{ auth.error }}</p>

      <div class="signup-link">
        아직 계정이 없으신가요?
        <router-link to="/signup">회원가입</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { issueUserStockToken } from '@/api';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  computed: {
    auth() {
      return useAuthStore();
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      const ok = await this.auth.login({
        email: this.email,
        password: this.password,
      });
      if (ok) {
        // 로그인 성공 → 원하는 경로로
        await issueToken();
        this.$router.push('/');
      }
    },
  },
};

const issueToken = async () => {
  const userId = useAuthStore().getId;
  await issueUserStockToken(userId);
  console.log('토큰 발급 성공');
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-logo {
  text-align: center;
  margin-bottom: 40px;
}
.login-logo h1 {
  margin-bottom: 8px;
}
.login-logo p {
  color: #888;
  font-size: 15px;
  text-align: center;
  font-weight: 400;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 0;
}
.form {
  width: 100%;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #222;
}
.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}
input {
  width: 100%;
  padding: 12px 120px 12px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
input:focus {
  outline: none;
  border-color: #6b46c1;
}
.icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #888;
}
.find-password {
  text-align: right;
  margin-bottom: 24px;
}
.find-links {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
.separator {
  color: #ccc;
  font-size: 14px;
}
.find-password a {
  color: #4318d1;
  font-size: 14px;
  text-decoration: none;
}
.login-btn {
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
.login-btn:hover {
  background: #6c4cf1;
}
.login-btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.signup-link {
  text-align: center;
  color: #666666;
  font-size: 15px;
}
.signup-link a {
  color: #4318d1;
  text-decoration: none;
  margin-left: 4px;
}
.error-text {
  color: #e11d48;
  font-size: 14px;
  margin-top: -8px;
  margin-bottom: 12px;
}
</style>
