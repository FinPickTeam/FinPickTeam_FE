<template>
  <div class="login-container">
    <div class="logo">
      <h1>FinPick</h1>
      <p>금융 생활의 새로운 시작</p>
    </div>
    <div class="form">
      <label for="email">이메일</label>
      <div class="input-wrapper">
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="이메일을 입력하세요"
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
        />
        <span class="icon" @click="togglePassword">
          <i
            :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
          ></i>
        </span>
      </div>
      <div class="find-password">
        <a href="#">비밀번호 찾기</a>
      </div>

      <button class="login-btn">로그인</button>
      <div class="signup-link">
        아직 계정이 없으신가요?
        <router-link to="/signup">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
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
.logo {
  text-align: center;
  margin-bottom: 40px;
}
.logo h1 {
  color: #4318d1;
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 8px;
}
.logo p {
  color: #666;
  font-size: 16px;
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
.find-password a {
  color: #4318d1;
  font-size: 14px;
  text-decoration: none;
}
.login-btn {
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
.login-btn:hover {
  background: #6c4cf1;
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
</style>
