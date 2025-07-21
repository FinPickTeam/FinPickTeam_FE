<template>
  <div class="home-container">
    <HeaderBar />

    <main class="main-content">
      <!-- 퀴즈 버튼 -->
      <button class="quiz-btn">오늘은 퀴즈 풀어</button>

      <!-- 중앙 카드 -->
      <div class="main-card"></div>

      <!-- 오른쪽 플로팅 버튼 그룹 -->
      <div class="floating-btn-group">
        <button class="floating-btn" @click="openQuiz">
          <i class="fas fa-piggy-bank"></i>
        </button>
        <button class="floating-btn"><i class="fas fa-envelope"></i></button>
        <button class="floating-btn">
          <i class="fas fa-user-friends"></i>
        </button>
      </div>

      <!-- 오늘의 금융 용어 -->
      <div class="finance-term">
        <span class="term-title">📘 오늘의 금융 용어: <b>예금자 보호</b></span>
        <div class="term-desc">“최대 5천만 원까지 보호된다고?”</div>
      </div>
    </main>

    <BottomNavBar />
    <Quiz v-if="showQuiz" @close="closeQuiz" />
  </div>
</template>

<script setup>
import HeaderBar from '@/components/Headerbar.vue';
import BottomNavBar from '@/components/Navbar.vue';
import Quiz from './Quiz.vue';
import { ref } from 'vue';

const showQuiz = ref(false);
function openQuiz() {
  showQuiz.value = true;
}
function closeQuiz() {
  showQuiz.value = false;
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main-content {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.quiz-btn {
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 2px 12px 0 #0001;
  border-radius: 16px;
  padding: 18px 0;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
  border: none;
}
.main-card {
  width: 260px;
  height: 260px;
  background: #d1d5db;
  border-radius: 12px;
  margin: 0 auto;
  margin-bottom: 16px;
  position: relative;
}
.floating-btn-group {
  position: absolute;
  top: 220px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
}
.floating-btn {
  width: 48px;
  height: 48px;
  background: #4318d1;
  color: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0002;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: background 0.2s;
  cursor: pointer;
}
.floating-btn:hover {
  background: #6c4cf1;
}
.finance-term {
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
}
.term-title {
  color: #222;
  font-size: 14px;
}
.term-desc {
  color: #666;
  font-size: 13px;
  margin-top: 2px;
}
@media (max-width: 480px) {
  .main-card {
    width: 90vw;
    height: 48vw;
    min-width: 180px;
    min-height: 180px;
    max-width: 320px;
    max-height: 320px;
  }
  .floating-btn-group {
    right: 4vw;
    top: 38vw;
  }
}
</style>
