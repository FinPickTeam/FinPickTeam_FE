<template>
  <div class="home-container">
    <main class="main-content">
      <!-- 캐릭터 말풍선 -->
      <div class="quiz-bubble">오늘은 퀴즈 풀어</div>

      <!-- 아바타 섹션 -->
      <div class="avatar-section">
        <div class="avatar-pixel">
          <img :src="baseAvatar" class="avatar-img" alt="아바타" />
          <img
            v-if="wearingTitle"
            :src="getTitleImage"
            class="title-img"
            alt="칭호"
          />
          <img
            v-if="wearingShirt"
            :src="getShirtImage"
            class="shirt-img"
            alt="상의"
          />
          <img
            v-if="wearingShoes"
            :src="getShoesImage"
            class="shoes-img"
            alt="신발"
          />
          <!-- 여러 액세서리를 동시에 표시 -->
          <img
            v-for="(image, index) in getGlassesImages"
            :key="index"
            :src="image"
            class="glasses-img"
            alt="액세서리"
          />
        </div>
      </div>

      <!-- 누적 포인트 막대 -->
      <div class="points-progress">
        <div class="points-header">
          <span class="points-label">🎯 누적 포인트</span>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <div class="points-display">
            <span class="current-points"
              >{{ totalEarnedPoints.toLocaleString() }}P</span
            >
            <span class="target-points">/ {{ nextTargetPoints }}P</span>
          </div>
        </div>
        <div class="points-status">
          <span v-if="progressPercentage >= 100" class="status-complete"
            >🎉 모든 목표 달성!</span
          >
          <span v-else class="status-progress">{{ getProgressMessage() }}</span>
        </div>
      </div>

      <!-- 오른쪽 플로팅 버튼 그룹 -->
      <div class="floating-btn-group">
        <button class="floating-btn" @click="openQuiz">
          <i class="fas fa-piggy-bank"></i>
        </button>
        <button class="floating-btn">
          <i class="fas fa-envelope" @click="openNewsletter"></i>
        </button>
        <button class="floating-btn" @click="goToAvatarShop">
          <i class="fa-solid fa-store"></i>
        </button>
      </div>
    </main>

    <Quiz v-if="showQuiz" @close="closeQuiz" />
    <Newsletter v-if="showNewsletter" @close="closeNewsletter" />
  </div>
</template>

<script setup>
import Quiz from "./Quiz.vue";
import Newsletter from "./Newsletter.vue";
import { ref, computed } from "vue";
import { useAvatarStore } from "../../stores/avatar.js";
import baseAvatar from "../mypage/avatar/avatarimg/avatar-base.png";
import hatWizardhat from "../mypage/avatar/avatarimg/hat-3wizardhat.png";
import hatSprout from "../mypage/avatar/avatarimg/hat-1sprout.png";
import hatDosa from "../mypage/avatar/avatarimg/hat-4dosa.png";
import hatBeginner from "../mypage/avatar/avatarimg/hat-2beginner.png";
import shirtBlue from "../mypage/avatar/avatarimg/shirts-blue.png";
import shirtRed from "../mypage/avatar/avatarimg/shirt-red.png";
import shoesBrown from "../mypage/avatar/avatarimg/shoese-brown.png";
import shoes from "../mypage/avatar/avatarimg/shoese.png";
import sportGlasses from "../mypage/avatar/avatarimg/sporglasses.png";
import sunGlasses from "../mypage/avatar/avatarimg/etc-sunglasses.png";
import blush from "../mypage/avatar/avatarimg/etc-blush.png";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

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

function goToAvatarShop() {
  router.push("/avatar-shop");
}

const avatarStore = useAvatarStore();

// 착용 중인 아이템 확인
const wearingTitle = computed(() => {
  const wearingItem = avatarStore.getWearingItem("titles");
  return wearingItem ? wearingItem.id : null;
});

const wearingShirt = computed(() => {
  const wearingItem = avatarStore.getWearingItem("shirts");
  return wearingItem ? wearingItem.id : null;
});

const wearingShoes = computed(() => {
  const wearingItem = avatarStore.getWearingItem("shoes");
  return wearingItem ? wearingItem.id : null;
});

// 여러 액세서리를 동시에 착용할 수 있도록 수정
const wearingGlasses = computed(() => {
  const wearingItems = avatarStore.getWearingItems("glasses");
  return wearingItems.map((item) => item.id);
});

// 착용 중인 아이템 이미지 가져오기
const getTitleImage = computed(() => {
  if (wearingTitle.value === "hat-1sprout") return hatSprout;
  if (wearingTitle.value === "hat-2beginner") return hatBeginner;
  if (wearingTitle.value === "hat-3wizardhat") return hatWizardhat;
  if (wearingTitle.value === "hat-4dosa") return hatDosa;
  return null;
});

const getShirtImage = computed(() => {
  if (wearingShirt.value === "shirt-blue") return shirtBlue;
  if (wearingShirt.value === "shirt-red") return shirtRed;
  return null;
});

const getShoesImage = computed(() => {
  if (wearingShoes.value === "shoes-brown") return shoesBrown;
  if (wearingShoes.value === "shoes") return shoes;
  return null;
});

// 여러 액세서리 이미지를 반환하는 함수
const getGlassesImages = computed(() => {
  const images = [];
  wearingGlasses.value.forEach((glassesId) => {
    if (glassesId === "sport-glasses") images.push(sportGlasses);
    if (glassesId === "etc-sunglasses") images.push(sunGlasses);
    if (glassesId === "etc-blush") images.push(blush);
  });
  return images;
});

// 누적 포인트 관련 computed 속성들
const totalEarnedPoints = computed(() => {
  return avatarStore.getTotalEarnedPoints();
});

const progressPercentage = computed(() => {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return 100;
  if (current >= 40000) return 75;
  if (current >= 20000) return 50;
  return 25;
});

const nextTargetPoints = computed(() => {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return "완료!";
  if (current >= 40000) return "60,000";
  if (current >= 20000) return "40,000";
  return "20,000";
});

// 컴포넌트 마운트 시 저장된 아바타 정보 불러오기
onMounted(() => {
  avatarStore.loadAvatar();
});

// 진행 상태 메시지 함수
function getProgressMessage() {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return "🎉 모든 목표 달성!";
  if (current >= 40000) return "🔥 40,000P 달성!";
  if (current >= 20000) return "💪 20,000P 달성!";
  return "🚀 목표 달성 중...";
}
</script>

<style scoped>
/* 전역 스크롤 차단 */
:global(body),
:global(html) {
  overflow: hidden !important;
  height: 100vh !important;
}

.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 390px;
  margin: 0 auto;
  overflow: hidden;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.main-content {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 0;
  overflow: hidden;
}
.quiz-bubble {
  display: inline-block;
  background: #fff;
  color: #000000;
  font-size: 16px;
  font-weight: 600;
  border-radius: 20px;
  padding: 14px 28px;
  margin: 0 auto 20px auto;
  box-shadow: 0 2px 12px 0 #0001;
  position: relative;
  text-align: center;
}
.quiz-bubble::after {
  content: "";
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
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0;
}

.avatar-pixel {
  position: relative;
  width: 270px;
  height: 422px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 270px;
  height: 422px;
  z-index: 1;
}
.title-img,
.shirt-img,
.shoes-img,
.glasses-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 270px;
  height: 422px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.title-img {
  z-index: 2;
}
.shirt-img {
  z-index: 2;
}
.shoes-img {
  z-index: 2;
}
.glasses-img {
  z-index: 3;
}
.floating-btn-group {
  position: absolute;
  top: 350px;
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
.points-progress {
  width: 260px;
  height: 100px;
  background: #f0f0f0;
  border-radius: 12px;
  margin-top: 12px;
  padding: 10px 15px;
  box-shadow: 0 2px 8px #0002;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.points-header {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 5px;
}
.points-label {
  font-size: 14px;
  color: #555;
}
.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #4318d1;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}
.points-display {
  display: flex;
  align-items: baseline;
  font-size: 18px;
  font-weight: bold;
  color: #4318d1;
  margin-top: 5px;
}
.current-points {
  margin-right: 5px;
}
.target-points {
  font-size: 14px;
  color: #666;
}
.points-status {
  font-size: 13px;
  color: #666;
  text-align: center;
  width: 100%;
}
.status-complete {
  color: #4318d1;
  font-weight: bold;
}
.status-progress {
  color: #666;
}
</style>
