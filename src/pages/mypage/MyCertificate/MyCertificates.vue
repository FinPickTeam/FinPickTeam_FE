<template>
  <div class="certificate-container">
    <!-- 헤더 영역 -->
    <div class="dictionary-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="dictionary-header-title">인증서 관리</span>
    </div>

    <!-- 보안 배너 -->
    <div class="security-banner">
      <span class="security-text">인증서가 안전하게 보호됩니다</span>
    </div>

    <!-- 인증서 카드 -->
    <div class="certificate-card">
      <div class="certificate-header">
        <span class="certificate-name">FinPick 인증서</span>
        <div class="user-icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
      </div>
      <div class="certificate-info">
        <div class="user-name">{{ userName }}</div>
        <div class="expiry-info">
          <span class="expiry-date">2028-07-31</span>
          <span class="status-badge">정상</span>
        </div>
      </div>
    </div>

    <!-- 메뉴 리스트 -->
    <div class="menu-list">
      <div class="menu-item" @click="goToCertificateInfo">
        <span>인증서 정보</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>
      <div class="menu-item" @click="goToPasswordChange">
        <span>비밀번호 변경</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faAngleRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../../../stores/user.js";

library.add(faAngleLeft, faAngleRight, faUser);

const router = useRouter();
const userStore = useUserStore();

// ARS 인증에서 입력한 사용자 이름 가져오기
const userName = computed(() => {
  const name = userStore.getUserName();
  return name || "사용자";
});

function goBack() {
  router.back();
}

function goToCertificateInfo() {
  router.push("/certificate-detail");
}

function goToPasswordChange() {
  router.push("/certificate-password-change");
}
</script>

<style scoped>
.certificate-container {
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  padding: 120px 20px 80px 20px;
  box-sizing: border-box;
}

.certificate-container::-webkit-scrollbar {
  display: none;
}

/* 헤더 스타일 */
.dictionary-header-bar {
  margin-top: 32px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0;
  margin-bottom: 18px;
  z-index: 1100;
}

.dictionary-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
  z-index: 1200;
}

.back-btn:hover {
  background: #f3f3f3;
}

/* 보안 배너 */
.security-banner {
  width: 100%;
  max-width: 350px;
  margin: 0 auto 20px auto;
  padding: 12px 16px;
  background: #e8f5e8;
  border-radius: 8px;
  text-align: center;
}

.security-text {
  color: #2e7d32;
  font-size: 14px;
  font-weight: 500;
}

/* 인증서 카드 */
.certificate-card {
  width: 100%;
  max-width: 180px;
  margin: 0 auto 20px auto;
  padding: 24px 20px;
  background: var(--color-main-light);
  border-radius: 16px;
  color: white;
  aspect-ratio: 0.58;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 280px;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
}

.certificate-name {
  font-size: 13px;
  font-weight: 600;
}

.user-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.certificate-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0;
}

.expiry-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.expiry-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
}

.status-badge {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

/* 메뉴 리스트 */
.menu-list {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  background: #fff;
  overflow: hidden;
}

.menu-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #333;
  font-size: 15px;
  color: #000000;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f9f9f9;
}

.menu-item:last-child {
  border-bottom: 2px solid #000;
}

.menu-item.danger {
  color: #e53935;
}

.chevron {
  color: #ccc;
  font-size: 17px;
}

.danger-chevron {
  color: #e53935;
}

/* 토글 스위치 */
.toggle-switch {
  width: 44px;
  height: 24px;
  background: #e0e0e0;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  transition: background 0.2s;
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
}

.toggle-switch input:checked + .slider {
  left: 20px;
}

.toggle-switch input:checked ~ .toggle-switch {
  background: #4caf50;
}

.toggle-switch input:checked ~ .slider.active {
  background: #4caf50;
}

@media (max-width: 540px) {
  .certificate-container {
    max-width: 100vw;
  }
}
</style>
