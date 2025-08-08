<template>
  <!-- Profile Section -->
  <div class="profile-section">
    <div class="profile-card">
      <div class="avatar-container">
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
          <span class="coin-value">{{ coin }}</span>
          <span class="coin-icon">🪙</span>
        </div>
        <div class="coin-label">포인트</div>
      </div>
    </div>
    <div class="info-item">
      <div class="info-value">묵은지</div>
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
      <span>핀픽 인증서 관리</span>
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
import baseAvatar from "./avatar/avatarimg/avatar-base.png";
import hatWizardhat from "./avatar/avatarimg/hat-3wizardhat.png";
import hatSprout from "./avatar/avatarimg/hat-1sprout.png";
import hatDosa from "./avatar/avatarimg/hat-4dosa.png";
import hatBeginner from "./avatar/avatarimg/hat-2beginner.png";
import shirtBlue from "./avatar/avatarimg/shirts-blue.png";
import shirtRed from "./avatar/avatarimg/shirt-red.png";
import shoesBrown from "./avatar/avatarimg/shoese-brown.png";
import shoes from "./avatar/avatarimg/shoese.png";
import sportGlasses from "./avatar/avatarimg/sporglasses.png";
import sunGlasses from "./avatar/avatarimg/etc-sunglasses.png";
import blush from "./avatar/avatarimg/etc-blush.png";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { onMounted } from "vue";

library.add(faAngleRight);

const router = useRouter();
const avatarStore = useAvatarStore();
const { coin } = storeToRefs(avatarStore);

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

function goToMyHistory() {
  router.push("/my-history");
}

function handleLogout() {
  // 로그아웃 후 로그인 페이지로 이동
  router.push("/login");
}

function goToInvestmentTest() {
  router.push("/profile-step-1?from=mypage");
}

function goToPinpickCertificate() {
  router.push("/mycertificate");
}

function goToCustomerService() {
  router.push("/customer-support");
}

// 컴포넌트 마운트 시 저장된 아바타 정보 불러오기
onMounted(() => {
  avatarStore.loadAvatar();
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
