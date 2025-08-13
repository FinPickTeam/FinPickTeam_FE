<template>
  <div class="withdraw-success-container">
    <div class="success-content">
      <div class="success-icon">ℹ️</div>
      <p class="success-message">회원탈퇴가 완료되었습니다.</p>
      <button class="confirm-btn" @click="goToLogin">확인</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function goToLogin() {
  router.push("/login");
}
</script>

<style scoped>
.withdraw-success-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  font-family: var(--font-main);
  padding-top: 56px; /* 헤더 높이만큼 패딩 추가 */
  padding-bottom: 80px; /* 네비게이션 높이만큼 패딩 추가 */
}
.success-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}
.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-main);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 24px;
}
.success-message {
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 40px;
  line-height: 1.5;
}
.confirm-btn {
  padding: 16px 48px;
  background: var(--color-bg-light);
  color: var(--color-text);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm-btn:hover {
  background: var(--color-main-light);
  color: #fff;
}
</style>
