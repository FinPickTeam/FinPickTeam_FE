<template>
  <div class="shop-container">
    <Headerbar />
    <!-- 아바타 및 코인 -->
    <div class="avatar-section">
      <div class="avatar-pixel">
        <img :src="baseAvatar" class="avatar-img" alt="아바타" />
        <img v-if="wearingShirt" :src="shirtImg" class="shirt-img" alt="상의" />
      </div>
      <div class="coin-balance">
        <span class="coin-icon">🪙</span> {{ coin }}
      </div>
    </div>
    <!-- 아이템 목록 -->
    <div class="item-category"><span class="category-icon">👕</span> 상의</div>
    <div class="item-list">
      <div
        class="item-card"
        :class="{ selected: wearingShirt }"
        @click="toggleShirt"
      >
        <img :src="shirtImg" class="item-img" alt="노란 상의" />
        <span class="item-price">🪙 50</span>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAvatarStore } from "../../stores/avatar.js";
import baseAvatar from "./avatar-base.png";
import shirtImg from "./shirt-yellow.png";
import Headerbar from "../../components/Headerbar.vue";
import Navbar from "../../components/Navbar.vue";

const router = useRouter();
const avatarStore = useAvatarStore();
const { coin, hasShirt, wearingShirt } = storeToRefs(avatarStore);

function toggleShirt() {
  avatarStore.buyOrToggleShirt(50);
}
function goBack() {
  router.back();
}
</script>

<style scoped>
.shop-container {
  min-height: 100vh;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  position: relative;
  padding-bottom: 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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
@media (max-width: 540px) {
  .shop-container,
  .status-bar,
  .shop-header,
  .bottom-nav {
    max-width: 100vw;
  }
}
</style>
