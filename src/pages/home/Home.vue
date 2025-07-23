<template>
  <main class="main-content">
    <!-- 캐릭터 말풍선 -->
    <div class="quiz-bubble">오늘은 퀴즈 풀어</div>

    <!-- 중앙 카드 -->
    <div class="main-card">
      <div class="avatar-img-wrap">
        <img :src="baseAvatar" class="avatar-img" alt="아바타" />
        <img v-if="wearingShirt" :src="shirtImg" class="shirt-img" alt="상의" />
        <img v-if="wearingPants" :src="pantsImg" class="pants-img" alt="바지" />
        <img
          v-if="wearingAcc"
          :src="sunglassImg"
          class="acc-img"
          alt="액세서리"
        />
      </div>
    </div>

    <!-- 오른쪽 플로팅 버튼 그룹 -->
    <div class="floating-btn-group">
      <button class="floating-btn" @click="openQuiz">
        <i class="fa-solid fa-lightbulb"></i>
      </button>
      <button class="floating-btn">
        <i class="fas fa-envelope" @click="openNewsletter"></i>
      </button>
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

  <Quiz v-if="showQuiz" @close="closeQuiz" />
  <Newsletter v-if="showNewsletter" @close="closeNewsletter" />
</template>

<script setup>
import Quiz from './Quiz.vue';
import Newsletter from './Newsletter.vue';
import { ref } from 'vue';
import { useAvatarStore } from '../../stores/avatar.js';
import baseAvatar from '../mypage/avatar/avatar-base.png';
import shirtImg from '../mypage/avatar/shirt-yellow.png';
import pantsImg from '../mypage/avatar/pants.png';
import sunglassImg from '../mypage/avatar/sunglass.png';
import { storeToRefs } from 'pinia';

const showQuiz = ref(false);
const showNewsletter = ref(false);
function openQuiz() {
  showQuiz.value = true;
}
function closeQuiz() {
  showQuiz.value = false;
}
function openNewsletter() {
  showNewsletter.value = true;
}
function closeNewsletter() {
  showNewsletter.value = false;
}

const avatarStore = useAvatarStore();
const { wearingShirt, wearingPants, wearingAcc } = storeToRefs(avatarStore);
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 390px;
  margin: 0 auto;
}
.main-content {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.quiz-bubble {
  display: inline-block;
  background: #fff;
  color: #000000;
  font-size: 16px;
  font-weight: 600;
  border-radius: 20px;
  padding: 14px 28px;
  margin: 0 auto 32px auto;
  box-shadow: 0 2px 12px 0 #0001;
  position: relative;
  text-align: center;
}
.quiz-bubble::after {
  content: '';
  position: absolute;
  left: 32px;
  bottom: -14px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 0 0 18px 18px;
  box-shadow: 0 2px 12px 0 #0001;
  transform: rotate(45deg);
}
.main-card {
  width: 260px;
  height: 260px;
  background: #d1d5db;
  border-radius: 12px;
  margin: 0 auto;
  margin-bottom: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 100px;
  height: 100px;
  z-index: 1;
}
.shirt-img,
.pants-img,
.acc-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.shirt-img {
  z-index: 2;
}
.pants-img {
  z-index: 2;
}
.acc-img {
  z-index: 3;
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
</style>
