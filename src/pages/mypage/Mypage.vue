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
          <img
            v-if="wearingPants"
            :src="pantsImg"
            class="pants-img"
            alt="바지"
          />
          <img
            v-if="wearingAcc"
            :src="sunglassImg"
            class="acc-img"
            alt="액세서리"
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
        <div class="info-value">{{ coin.value }}</div>
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
            justify-content: space-between;
          "
        >
          <span>회원정보 관리</span>
          <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
        </router-link>
      </div>
      <div class="menu-item" @click="goToQuizHistory">
        <span>금융 퀴즈 히스토리</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
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
    <!-- 페이지 하단에 네비게이션 바 추가 -->
    <Navbar />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAvatarStore } from "../../stores/avatar.js";
import baseAvatar from "./avatar/avatar-base.png";
import shirtImg from "./avatar/shirt-yellow.png";
import pantsImg from "./avatar/pants.png";
import sunglassImg from "./avatar/sunglass.png";
import Headerbar from "@/components/Headerbar.vue";
import Navbar from "@/components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleRight);

const router = useRouter();
const pushEnabled = ref(true);

const avatarStore = useAvatarStore();
const { wearingShirt, wearingPants, wearingAcc, coin } =
  storeToRefs(avatarStore);

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
  max-width: 390px;
  margin: 0 auto;
  background: var(--color-bg);
  position: relative;
  padding-bottom: 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: var(--font-main);
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
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 390px;
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
.user-info-card {
  margin-top: 14px;
  padding: 14px 0;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg);
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 390px;
  min-width: 0;
  font-size: 14px;
  box-sizing: border-box;
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
.coin-icon {
  font-size: 13px;
}
.menu-list {
  margin: 14px 0 0 0;
  max-width: 390px;
  padding: 0 4px;
}
.menu-item {
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
  color: var(--color-text);
}
.menu-item:last-child {
  border-bottom: none;
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
  padding: 8px 0;
  z-index: 100;
}
@media (max-width: 540px) {
  .mypage-container,
  .status-bar,
  .app-header,
  .user-info-card,
  .menu-list,
  .menu-item {
    max-width: 100vw;
    width: 100vw;
    min-width: 0 !important;
    box-sizing: border-box;
  }
  .mypage-container {
    margin: 0;
    padding: 0 2vw;
    overflow-x: hidden;
  }
  .user-info-card,
  .menu-list {
    padding: 0 1vw;
    min-width: 0 !important;
  }
  .menu-item,
  .info-item {
    min-width: 0 !important;
    flex-shrink: 1;
  }
  .bottom-nav {
    left: 0;
    right: 0;
    transform: none;
    max-width: 100vw;
    width: 100vw;
  }
}
.danger-chevron {
  color: var(--color-accent) !important;
}
</style>
