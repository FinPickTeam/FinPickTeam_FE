<template>
  <div class="withdraw-success-container">
    <Headerbar />
    <div class="success-content">
      <div class="success-icon">ℹ️</div>
      <p class="success-message">회원탈퇴가 완료되었습니다.</p>
      <button class="confirm-btn" @click="goToLogin">확인</button>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Headerbar from "../../components/Headerbar.vue";
import Navbar from "../../components/Navbar.vue";
const router = useRouter();
function goToLogin() {
  router.push("/login");
}
</script>

<style scoped>
.withdraw-success-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* Added to stack header, content, and footer */
  align-items: center;
  justify-content: center;
  background: #fff;
}
.success-content {
  text-align: center;
  flex-grow: 1; /* Allow content to grow and take available space */
  padding: 20px; /* Add some padding to the content area */
}
.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #4a148c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 24px;
}
.success-message {
  font-size: 18px;
  color: #333;
  margin-bottom: 40px;
  line-height: 1.5;
}
.confirm-btn {
  padding: 16px 48px;
  background: #eee;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
