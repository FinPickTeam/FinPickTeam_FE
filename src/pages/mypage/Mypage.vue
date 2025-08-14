<template>
  <!-- Profile Section -->
  <div class="profile-section">
    <div class="profile-card">
      <div class="avatar-container">
        <div class="avatar-pixel">
          <img :src="baseAvatar" class="avatar-img" alt="아바타" />
          <div v-if="wearingTitle" class="title-placeholder">
            <span class="item-text">칭호</span>
          </div>
          <div v-if="wearingShirt" class="shirt-placeholder">
            <span class="item-text">상의</span>
          </div>
          <div v-if="wearingShoes" class="shoes-placeholder">
            <span class="item-text">신발</span>
          </div>
          <!-- 여러 액세서리를 동시에 표시 -->
          <div
            v-for="(glassesId, index) in wearingGlasses"
            :key="index"
            class="glasses-placeholder"
          >
            <span class="item-text">액세서리</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- User Info Card -->
  <div class="user-info-card">
    <div class="info-item">
      <div class="info-label">안정자산 추구</div>
      <div class="info-subtitle">나의 투자성향</div>
    </div>
    <div class="info-item">
      <div class="coin-stack">
        <div class="coin-line">
          <span v-if="loadingCoin" class="coin-value loading">...</span>
          <span v-else-if="coinError" class="coin-value error">-</span>
          <span v-else class="coin-value">{{ currentCoinDisplay }}</span>
          <span class="coin-icon">🪙</span>
        </div>
        <div class="coin-label">포인트</div>
      </div>
    </div>
    <div class="info-item">
      <div class="info-value">{{ levelText }}</div>
      <div class="info-subtitle">레벨</div>
    </div>
  </div>

  <!-- Menu List -->
  <div class="menu-list">
    <div class="menu-item">
      <router-link
        to="/profile"
        style="
          color: inherit;
          text-decoration: none;
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
        "
      >
        <span>회원정보 관리</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </router-link>
    </div>
    <div class="menu-item" @click="goToMyHistory">
      <span>마이 히스토리</span>
      <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
    </div>
    <div class="menu-item" @click="goToPinpickCertificate">
      <span>간편 비밀번호 관리</span>
      <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
    </div>
    <div class="menu-item" @click="goToInvestmentTest">
      <span>투자성향 재검사</span>
      <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
    </div>
    <div class="menu-item" @click="goToCustomerService">
      <span>고객센터</span>
      <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
    </div>
    <div class="menu-item" @click="handleLogout">
      <span>로그아웃</span>
      <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
    </div>
    <div class="menu-item danger">
      <router-link
        to="/withdraw"
        style="
          color: inherit;
          text-decoration: none;
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
        "
      >
        <span>회원탈퇴</span>
        <font-awesome-icon
          class="chevron danger-chevron"
          :icon="['fas', 'angle-right']"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAvatarStore } from "../../stores/avatar.js";
import { getCurrentCoin, getMyCoinStatus } from "@/api/mypage/avatar";
import { useAuthStore } from "@/stores/auth";
import baseAvatar from "./avatar/avatarimg/avatar-base.png";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { onMounted } from "vue";
import {useProfileStore} from "@/stores/profile.js";

library.add(faAngleRight);

const router = useRouter();
const avatarStore = useAvatarStore();
const authStore = useAuthStore();
const { coin } = storeToRefs(avatarStore);
const profileStore=useProfileStore();

// 레벨 텍스트 계산 (기본값으로 설정)
const levelText = computed(() => {
  return "금융 새싹"; // 기본값
});

// 포인트 상태 관리
const coinStatus = ref({
  amount: 0,
  cumulativeAmount: 0,
  monthlyCumulativeAmount: 0,
  updatedAt: null,
});
const loadingCoin = ref(false);
const coinError = ref(null);

// 현재 포인트를 store와 동기화
const currentCoinDisplay = computed(() => {
  return coin.value || coinStatus.value.amount;
});

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

// 착용 중인 아이템 이미지 가져오기 (placeholder로 처리)
const getTitleImage = computed(() => {
  return null; // placeholder 처리
});

const getShirtImage = computed(() => {
  return null; // placeholder 처리
});

const getShoesImage = computed(() => {
  return null; // placeholder 처리
});

// 여러 액세서리 이미지를 반환하는 함수 (placeholder로 처리)
const getGlassesImages = computed(() => {
  return []; // placeholder 처리
});

function goToMyHistory() {
  profileStore.resetAnswers();
  router.push("/my-history");
}

async function handleLogout() {
  try {
    // auth store의 logout 함수 호출 (API 호출 + 상태 정리 + 페이지 이동)
    await authStore.logout();
  } catch (error) {
    console.error("로그아웃 처리 중 오류 발생:", error);
    // 오류가 발생해도 로그인 페이지로 이동
    router.push("/login");
  }
}

function goToInvestmentTest() {
  profileStore.resetAnswers();
  router.push("/profile-step-1?from=mypage");
}

function goToPinpickCertificate() {
  router.push("/mycertificate");
}

function goToCustomerService() {
  router.push("/customer-support");
}

// 포인트 데이터 가져오기
const fetchCurrentCoin = async () => {
  try {
    loadingCoin.value = true;
    coinError.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("로그인이 필요합니다.");
      return;
    }

    console.log("MyPage 코인 상태 데이터 가져오기 시작");
    const response = await getMyCoinStatus();
    console.log("받아온 코인 상태 데이터:", response);

    if (response.status === 200 && response.data && response.data.data) {
      const coinData = response.data.data;

      // 새로운 API 응답 구조에 맞게 데이터 설정
      coinStatus.value = {
        amount: coinData.amount || 0,
        cumulativeAmount: coinData.cumulativeAmount || 0,
        monthlyCumulativeAmount: coinData.monthlyCumulativeAmount || 0,
        updatedAt: coinData.updatedAt || null,
      };

      // store에도 현재 포인트 업데이트
      avatarStore.setCoin(coinStatus.value.amount);

      console.log("MyPage 코인 상태 업데이트 완료:", coinStatus.value);
    } else {
      console.warn("코인 상태 데이터 형식이 올바르지 않습니다:", response);
      coinError.value = "코인 상태 데이터를 가져오는데 실패했습니다.";
    }
  } catch (err) {
    console.error("MyPage 코인 상태 조회 에러:", err);

    let errorMessage = "코인 상태를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 403) {
      errorMessage = "접근 권한이 없습니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "코인 정보를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    coinError.value = errorMessage;
  } finally {
    loadingCoin.value = false;
  }
};

// 컴포넌트 마운트 시 저장된 아바타 정보와 포인트 불러오기
onMounted(() => {
  avatarStore.loadAvatar();
  fetchCurrentCoin();
});
</script>

<style scoped>
.mypage-container {
  height: 100vh;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: var(--color-bg);
  position: relative;
  padding-top: 90px;
  padding-bottom: 0;
  box-sizing: border-box;
  font-family: var(--font-main);
  overflow: hidden;
}
.profile-section,
.user-info-card,
.menu-list {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  display: block;
  max-width: 390px;
}
.profile-section {
  width: 100%;
  margin: 0 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 390px;
}

.profile-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 30px;
  margin-top: 100px;
  padding: 15px 0 0 0;
  border: 2px solid #ffffff;
  border-radius: 12px;
  background: var(--color-bg);
  box-sizing: border-box;
  width: calc(100% - 60px);
  max-width: 330px;
  min-width: 0;
}

.avatar-container {
  position: relative;
  width: 140px;
  height: 218px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-pixel {
  position: relative;
  width: 140px;
  height: 218px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shoes-img,
.glasses-img,
.title-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 140px;
  height: 218px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.title-img {
  z-index: 2;
}

.shoes-img {
  z-index: 2;
}

.glasses-img {
  z-index: 3;
}

.title-placeholder,
.shirt-placeholder,
.shoes-placeholder,
.glasses-placeholder {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(67, 24, 209, 0.1);
  border: 1px solid #4318d1;
  border-radius: 4px;
  padding: 4px 8px;
  pointer-events: none;
  z-index: 2;
}

.title-placeholder {
  z-index: 2;
}

.shirt-placeholder {
  z-index: 2;
}

.shoes-placeholder {
  z-index: 2;
}

.glasses-placeholder {
  z-index: 3;
}

.item-text {
  font-size: 10px;
  color: #4318d1;
  font-weight: bold;
}
.profile-circle.avatar-profile {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--color-bg) !important;
  border: 2px solid #e1ce93d8;
  overflow: visible;
  box-sizing: border-box;
  width: 130px;
  height: 130px;
  min-width: 130px;
  min-height: 130px;
}
.avatar-img-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 140px;
  height: 218px;
  z-index: 1;
}
.shirt-img,
.pants-img,
.acc-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 140px;
  height: 218px;
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
.user-info-card {
  margin-top: 2px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 8px 0;
  border: 2px solid #4318d1;
  border-radius: 12px;
  background: var(--color-bg);
  text-align: center;
  width: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 330px;
  min-width: 0;
  font-size: 14px;
  box-sizing: border-box;
  overflow-x: visible;
}
.info-item {
  text-align: center;
  flex: 1;
}
.info-label,
.info-value {
  font-weight: bold;
  font-size: 15px;
  color: var(--color-text);
  margin-bottom: 3px;
}
.info-subtitle {
  font-size: 11px;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}
.coin-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.3;
}

.coin-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.coin-value {
  font-weight: bold;
  color: #4318d1;
  font-size: 16px;
}

.coin-value.loading {
  color: #666;
  animation: pulse 1.5s infinite;
}

.coin-value.error {
  color: #e74c3c;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.coin-icon {
  font-size: 16px;
}

.coin-label {
  font-size: 12px;
  color: var(--color-text-light);
}
.menu-list {
  margin: 8px 0 0 0;
  max-width: 390px;
  width: 100%;
  padding: 0 30px 0 30px;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-bottom: 0;
  padding-bottom: 0;
}

.menu-item {
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
  color: var(--color-text);
  box-sizing: border-box;
  word-break: keep-all;
  overflow-x: hidden;
}
.menu-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.menu-item.danger {
  color: var(--color-accent);
}
.chevron {
  color: #ccc;
  font-size: 17px;
}
.toggle-switch {
  width: 44px;
  height: 24px;
  background: var(--color-bg-accent);
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--color-bg);
  border-radius: 50%;
  transition: 0.2s;
}
.toggle-switch .slider.active {
  left: 20px;
  background: var(--color-main);
}
.toggle-switch input:checked + .slider {
  left: 20px;
  background: var(--color-main);
}
.profile-edit-btn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #666;
  border: 2px solid var(--color-bg);
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(80, 80, 80, 0.18);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  z-index: 10;
}
.profile-edit-btn:hover {
  background: #444;
  box-shadow: 0 4px 16px rgba(80, 80, 80, 0.28);
}
.hanger-icon {
  font-size: 20px;
  line-height: 1;
}
.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  max-width: 390px;
  width: 100%;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -2px 12px 0 #0001;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0 20px 0;
  z-index: 100;
}
.danger-chevron {
  color: var(--color-accent);
}
</style>
