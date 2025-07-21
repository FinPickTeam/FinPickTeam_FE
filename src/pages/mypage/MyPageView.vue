<template>
  <div class="mypage-container">
    <Headerbar />
    <!-- Profile Section -->
    <div class="profile-section">
      <div class="profile-circle avatar-profile">
        <div class="avatar-img-wrap">
          <img :src="baseAvatar" class="avatar-img" alt="아바타" />
          <img
            v-if="wearingShirt"
            :src="shirtImg"
            class="shirt-img"
            alt="상의"
          />
        </div>
        <button class="profile-edit-btn" @click="goToAvatarShop">
          <span class="hanger-icon">🧥</span>
        </button>
      </div>
    </div>

    <!-- User Info Card -->
    <div class="user-info-card">
      <div class="info-item">
        <div class="info-label">안정자산 추구</div>
        <div class="info-subtitle">나의 투자성향</div>
      </div>
      <div class="info-item">
        <div class="info-value">5,400</div>
        <div class="info-subtitle">
          <span class="coin-icon">🪙</span> 포인트
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
          "
        >
          <span>회원정보 관리</span>
          <span class="chevron">&gt;</span>
        </router-link>
      </div>
      <div class="menu-item" @click="goToQuizHistory">
        <span>금융 퀴즈 히스토리</span>
        <span class="chevron">&gt;</span>
      </div>
      <div class="menu-item">
        <span>푸시알림</span>
        <label class="toggle-switch">
          <input type="checkbox" v-model="pushEnabled" />
          <span class="slider" :class="{ active: pushEnabled }"></span>
        </label>
      </div>
      <div class="menu-item">
        <span>알림 상세설정</span>
        <span class="chevron">&gt;</span>
      </div>
      <div class="menu-item" @click="handleLogout">
        <span>로그아웃</span>
        <span class="chevron">&gt;</span>
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
          "
        >
          <span>회원탈퇴</span>
          <span class="chevron">&gt;</span>
        </router-link>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAvatarStore } from "../../stores/avatar.js";
import baseAvatar from "./avatar-base.png";
import shirtImg from "./shirt-yellow.png";
import Headerbar from "../../components/Headerbar.vue";
import Navbar from "../../components/Navbar.vue";

const router = useRouter();
const pushEnabled = ref(true);

const avatarStore = useAvatarStore();
const { wearingShirt } = storeToRefs(avatarStore);

const handleLogout = () => {
  // 로그아웃 로직 (필요시 추가)
  // 예: 로컬 스토리지 클리어, 세션 삭제 등

  // 로그인 페이지로 이동
  router.push("/login");
};

const goToQuizHistory = () => {
  router.push("/quiz-history");
};

const goToAvatarShop = () => {
  router.push("/avatar-shop");
};
</script>

<style scoped>
.mypage-container {
  min-height: 100vh;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  position: relative;
  padding-bottom: 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.profile-section,
.user-info-card,
.menu-list {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  display: block;
}
.profile-section {
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile-circle.avatar-profile {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.avatar-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.user-info-card {
  margin-top: 18px;
  padding: 18px 0;
  border: 2px solid #e1bee7;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  width: 100%;
}
.menu-list {
  margin-top: 18px;
  padding: 0;
  width: 100%;
}
.menu-item {
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}
.menu-item:last-child {
  border-bottom: none;
}
.app-title,
.info-label,
.info-value,
.info-subtitle {
  text-align: center;
  width: 100%;
}
.status-icons {
  display: flex;
  gap: 5px;
}
.app-header {
  text-align: center;
  padding: 18px 0 0 0;
  max-width: 540px;
  margin: 0 auto;
}
.app-title {
  font-size: 28px;
  font-weight: bold;
  color: #4a148c;
  margin: 0;
}
.profile-circle.avatar-profile {
  background: #fff !important;
  border: 2px solid #e1ce93d8;
  overflow: visible;
  position: relative;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  min-width: 120px;
  min-height: 120px;
}
.avatar-img {
  width: 90px;
  height: 90px;
  z-index: 1;
  display: block;
}
.shirt-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90px;
  height: 90px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}
.profile-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #666;
  border: 2.5px solid #fff;
  color: #fff;
  font-size: 22px;
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
  font-size: 22px;
  line-height: 1;
}
.user-info-card {
  margin: 18px 12px 0 12px;
  padding: 18px 8px;
  border: 2px solid #e1bee7;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 480px;
  min-width: 0;
  font-size: 15px;
  background: #fff;
  box-sizing: border-box;
}
.info-item {
  text-align: center;
  flex: 1;
}
.info-label,
.info-value {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}
.info-subtitle {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.coin-icon {
  font-size: 14px;
}
.menu-list {
  margin: 18px 0 0 0;
  max-width: 480px;
  padding: 0 8px;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #333;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item.danger {
  color: #f44336;
}
.chevron {
  color: #ccc;
  font-size: 18px;
}
.toggle-switch {
  width: 44px;
  height: 24px;
  background: #e0e0e0;
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
  background: #fff;
  border-radius: 50%;
  transition: 0.2s;
}
.toggle-switch .slider.active {
  left: 20px;
  background: #4a148c;
}
.toggle-switch input:checked + .slider {
  left: 20px;
  background: #4a148c;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 540px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 100;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #9c27b0;
  font-size: 12px;
  cursor: pointer;
}
.nav-item.active {
  color: #4a148c;
}
.nav-icon {
  font-size: 20px;
}
.nav-label {
  font-size: 10px;
}
@media (max-width: 540px) {
  .mypage-container,
  .status-bar,
  .app-header,
  .user-info-card,
  .menu-list,
  .menu-item,
  .bottom-nav {
    max-width: 100vw;
    width: 100vw;
  }
}
</style>
