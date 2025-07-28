<template>
  <div class="shop-container">
    <div class="shop-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="shop-header-title">아바타 상점</span>
    </div>
    <!-- 아바타 및 코인 -->
    <div class="avatar-section">
      <div class="avatar-pixel">
        <img :src="baseAvatar" class="avatar-img" alt="아바타" />
        <img
          v-if="avatarStore.wearingShirt"
          :src="shirtImg"
          class="shirt-img"
          alt="상의"
        />
        <img
          v-if="avatarStore.wearingPants"
          :src="pantsImg"
          class="pants-img"
          alt="바지"
        />
        <img
          v-if="avatarStore.wearingAcc"
          :src="sunglassImg"
          class="acc-img"
          alt="액세서리"
        />
      </div>
      <div v-if="showCoinError" class="coin-error">포인트가 부족합니다!</div>
      <div class="coin-balance">
        <span class="coin-icon">🪙</span> {{ avatarStore.coin }}
      </div>
    </div>
    <!-- 아이템 목록: 상의, 바지, 액세서리 모두 한 화면에 -->
    <div class="item-category"><span class="category-icon">👕</span> 상의</div>
    <div class="item-list">
      <div
        class="item-card"
        :class="{ selected: avatarStore.wearingShirt }"
        @click="handleBuyOrToggleShirt"
      >
        <img :src="shirtImg" class="item-img" alt="노란 상의" />
        <span class="item-price">🪙 50</span>
        <span v-if="avatarStore.hasShirt" class="own-label">보유</span>
        <span v-if="avatarStore.wearingShirt" class="wear-label">착용중</span>
        <font-awesome-icon
          v-if="avatarStore.hasShirt"
          class="check-icon"
          :icon="['fas', 'check-circle']"
        />
      </div>
    </div>
    <div class="item-category"><span class="category-icon">👖</span> 바지</div>
    <div class="item-list">
      <div
        class="item-card"
        :class="{ selected: avatarStore.wearingPants }"
        @click="handleBuyOrTogglePants"
      >
        <img :src="pantsImg" class="item-img" alt="바지" />
        <span class="item-price">🪙 50</span>
        <span v-if="avatarStore.hasPants" class="own-label">보유</span>
        <span v-if="avatarStore.wearingPants" class="wear-label">착용중</span>
        <font-awesome-icon
          v-if="avatarStore.hasPants"
          class="check-icon"
          :icon="['fas', 'check-circle']"
        />
      </div>
    </div>
    <div class="item-category">
      <span class="category-icon">🕶️</span> 액세서리
    </div>
    <div class="item-list">
      <div
        class="item-card"
        :class="{ selected: avatarStore.wearingAcc }"
        @click="handleBuyOrToggleAcc"
      >
        <img :src="sunglassImg" class="item-img" alt="선글라스" />
        <span class="item-price">🪙 20000</span>
        <span v-if="avatarStore.hasAcc" class="own-label">보유</span>
        <span v-if="avatarStore.wearingAcc" class="wear-label">착용중</span>
        <font-awesome-icon
          v-if="avatarStore.hasAcc"
          class="check-icon"
          :icon="['fas', 'check-circle']"
        />
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAvatarStore } from "../../../stores/avatar.js";
import baseAvatar from "./avatar-base.png";
import shirtImg from "./shirt-yellow.png";
import pantsImg from "./pants.png";
import sunglassImg from "./sunglass.png";
import Navbar from "../../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ref } from "vue";
library.add(faAngleLeft, faCheckCircle);

const router = useRouter();
const avatarStore = useAvatarStore();
const showCoinError = ref(false);

function goBack() {
  router.back();
}

function handleBuyOrToggleShirt() {
  if (!avatarStore.hasShirt && avatarStore.coin < 50) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  avatarStore.buyOrToggleShirt(50);
}
function handleBuyOrTogglePants() {
  if (!avatarStore.hasPants && avatarStore.coin < 50) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  avatarStore.buyOrTogglePants(50);
}
function handleBuyOrToggleAcc() {
  if (!avatarStore.hasAcc && avatarStore.coin < 20000) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  avatarStore.buyOrToggleAcc(20000);
}
</script>

<style scoped>
.shop-container {
  min-height: 100vh;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  position: relative;
  padding-bottom: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 100vh;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.shop-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.item-category,
.item-list {
  width: 100%;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}
.item-list {
  justify-content: center;
}
.shop-title,
.coin-balance {
  text-align: center;
  width: 100%;
}
.avatar-pixel {
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 20px;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;
}
.avatar-img {
  width: 100px;
  height: 100px;
  z-index: 1;
}
.shirt-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}
.coin-balance {
  background: #faf7ff;
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 18px;
  color: #222;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(160, 120, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 6px;
}
.coin-icon {
  font-size: 18px;
}
.item-category {
  margin: 18px 0 6px 24px;
  font-size: 15px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
.category-icon {
  font-size: 18px;
}
.item-list {
  display: flex;
  gap: 18px;
  margin: 0 0 12px 24px;
}
.item-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 10px 8px 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  box-shadow: 0 2px 8px rgba(160, 120, 255, 0.06);
  font-size: 18px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.item-card.selected {
  border: 2px solid #a78bfa;
}
.item-img {
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
}
.item-price {
  font-size: 13px;
  color: #a78bfa;
  margin-top: 2px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}
.coin-error {
  color: #e53935;
  font-size: 15px;
  font-weight: bold;
  margin: 8px 0 0 0;
  text-align: center;
}
@media (max-width: 540px) {
  .shop-container,
  .status-bar,
  .shop-header,
  .bottom-nav {
    max-width: 100vw;
  }
}
.shop-header-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  max-width: 540px;
  padding: 20px 0 0 0;
}
.shop-header-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
.back-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #7c3aed;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
}
.back-btn:hover {
  background: #f3e8ff;
}
.shop-tabs {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin: 18px 0 0 0;
}
.shop-tab {
  padding: 8px 18px;
  border-radius: 16px;
  background: #f5f5f5;
  color: #888;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.shop-tab.active {
  background: #a78bfa;
  color: #fff;
}
.tab-icon {
  font-size: 18px;
}
.pants-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}
.acc-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
}
.own-label {
  font-size: 11px;
  color: #a78bfa;
  margin-top: 2px;
  font-weight: 600;
}
.wear-label {
  font-size: 11px;
  color: #fff;
  background: #a78bfa;
  border-radius: 8px;
  padding: 1px 8px;
  margin-top: 2px;
  font-weight: 600;
  margin-left: 4px;
}
.check-icon {
  position: absolute;
  right: 6px;
  bottom: 6px;
  font-size: 18px;
  color: #a78bfa;
  background: #fff;
  border-radius: 50%;
  z-index: 10;
}
.item-card {
  position: relative;
}
</style>
