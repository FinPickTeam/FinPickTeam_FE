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
        <div class="level-info">
          <div class="level-display">
            <span class="level-number">Lv {{ getCurrentLevel }}.</span>
            <span class="level-title">{{ getCurrentLevelTitle }}</span>
          </div>
          <div class="next-level-info">
            {{ getNextLevelTitle }}까지 {{ getProgressPercentage }}%
          </div>
        </div>
        <div class="progress-bar-container">
          <span class="progress-bracket">[</span>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: getProgressPercentage + '%' }"
            ></div>
          </div>
          <span class="progress-bracket">]</span>
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
import { getCumulativeCoin } from "@/api/mypage/avatar";
import { useAuthStore } from "@/stores/auth";
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

// 누적 포인트 API 상태 관리
const loadingCumulative = ref(false);
const cumulativeError = ref(null);

function openQuiz() {
  showQuiz.value = true;
}
function closeQuiz() {
  showQuiz.value = false;
  // 퀴즈가 닫힐 때 누적 포인트를 다시 가져와서 업데이트
  fetchCumulativePoints();
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
const authStore = useAuthStore();

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
  return avatarStore.cumulativePoints || 0;
});

// 누적 포인트 데이터 가져오기
const fetchCumulativePoints = async () => {
  try {
    loadingCumulative.value = true;
    cumulativeError.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("로그인이 필요합니다.");
      return;
    }

    // 사용자 ID 가져오기
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    console.log("Home 누적 포인트 데이터 가져오기 시작, userId:", userId);

    // 임시로 기본값 사용 (API 문제 해결 전까지)
    const defaultCumulativePoints = 15000; // 기본 누적 포인트
    avatarStore.setCumulativePoints(defaultCumulativePoints);
    console.log("Home 누적 포인트 기본값 설정:", defaultCumulativePoints);

    // API 호출은 주석 처리 (백엔드 문제 해결 후 활성화)
    /*
    const response = await getCumulativeCoin(userId);
    console.log("받아온 누적 포인트 데이터:", response);

    if (response.status === 200 && response.data !== undefined) {
      // 백엔드 응답 구조에 따라 누적 포인트 값 추출
      let cumulativeValue;

      // 구조 1: { status: 200, data: 1500 }
      if (typeof response.data === "number") {
        cumulativeValue = response.data;
      }
      // 구조 2: { status: 200, message: "...", data: 1500 }
      else if (response.data.data !== undefined) {
        cumulativeValue = response.data.data;
      }
      // 구조 3: { data: 1500 }
      else if (response.data !== undefined) {
        cumulativeValue = response.data;
      }

      console.log("Home 추출된 누적 포인트 값:", cumulativeValue);

      if (
        cumulativeValue !== undefined &&
        typeof cumulativeValue === "number"
      ) {
        avatarStore.setCumulativePoints(cumulativeValue);
        console.log("Home 누적 포인트 업데이트 완료:", cumulativeValue);
      } else {
        console.warn("유효한 누적 포인트 값을 찾을 수 없습니다:", response);
        cumulativeError.value = "누적 포인트 데이터를 가져오는데 실패했습니다.";
      }
    } else {
      console.warn("누적 포인트 데이터 형식이 올바르지 않습니다:", response);
      cumulativeError.value = "누적 포인트 데이터를 가져오는데 실패했습니다.";
    }
    */
  } catch (err) {
    console.error("Home 누적 포인트 조회 에러:", err);

    let errorMessage = "누적 포인트를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "사용자 정보를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    cumulativeError.value = errorMessage;
  } finally {
    loadingCumulative.value = false;
  }
};

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
  fetchCumulativePoints(); // 컴포넌트 마운트 시 누적 포인트 데이터 가져오기
});

// 진행 상태 메시지 함수
function getProgressMessage() {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return "🎉 모든 목표 달성!";
  if (current >= 40000) return "🔥 40,000P 달성!";
  if (current >= 20000) return "💪 20,000P 달성!";
  return "🚀 목표 달성 중...";
}

// 현재 레벨 계산
const getCurrentLevel = computed(() => {
  const points = totalEarnedPoints.value;
  if (points >= 60000) return 4;
  if (points >= 40000) return 3;
  if (points >= 20000) return 2;
  return 1;
});

// 현재 레벨 제목
const getCurrentLevelTitle = computed(() => {
  const points = totalEarnedPoints.value;
  if (points >= 60000) return "금융도사";
  if (points >= 40000) return "금융법사";
  if (points >= 20000) return "금융견습";
  return "금융새싹";
});

// 다음 레벨 제목
const getNextLevelTitle = computed(() => {
  const points = totalEarnedPoints.value;
  if (points >= 60000) return "완료";
  if (points >= 40000) return "금융도사";
  if (points >= 20000) return "금융법사";
  return "금융견습";
});

// 진행률 계산 (현재 레벨 내에서의 진행률)
const getProgressPercentage = computed(() => {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return 100;
  if (current >= 40000) {
    // 40000-59999 구간에서 0-100%
    return Math.min(100, Math.floor(((current - 40000) / 20000) * 100));
  }
  if (current >= 20000) {
    // 20000-39999 구간에서 0-100%
    return Math.min(100, Math.floor(((current - 20000) / 20000) * 100));
  }
  // 0-19999 구간에서 0-100%
  return Math.min(100, Math.floor((current / 20000) * 100));
});
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
  width: 280px;
  background: #ffffff;
  border-radius: 12px;
  margin-top: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.level-display {
  display: flex;
  align-items: baseline;
}

.level-number {
  font-size: 18px;
  font-weight: 700;
  color: #4318d1;
}

.level-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-left: 4px;
}

.next-level-info {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.progress-bar-container {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.progress-bracket {
  font-size: 16px;
  color: #1e293b;
  font-weight: 600;
  margin: 0 8px;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4318d1;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.points-display {
  display: flex;
  align-items: baseline;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 8px;
}

.current-points {
  margin-right: 6px;
  color: #4318d1;
}

.target-points {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.points-status {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  width: 100%;
  font-weight: 500;
}

.status-complete {
  color: #059669;
  font-weight: 600;
}

.status-progress {
  color: #64748b;
}
</style>
