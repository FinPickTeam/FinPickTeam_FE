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
  min-height: 844px;
  background-color: #fff;
  padding: 0 20px 80px 20px;
  box-sizing: border-box;
  position: relative;
}

.certificate-container::-webkit-scrollbar {
  display: none;
}

/* 헤더 스타일 */
.dictionary-header-bar {
  margin-top: 0;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 56px;
  padding: 0 20px;
  margin-bottom: 18px;
  z-index: 1100;
  background: #fff;
  border-bottom: 1px solid #ececec;
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
  margin: 80px auto 16px auto;
  padding: 10px 14px;
  background: #e8f5e8;
  border-radius: 8px;
  text-align: center;
}

.security-text {
  color: #2e7d32;
  font-size: 13px;
  font-weight: 500;
}

/* 인증서 카드 */
.certificate-card {
  width: 100%;
  max-width: 160px;
  margin: 0 auto 16px auto;
  padding: 20px 16px;
  background: var(--color-main-light);
  border-radius: 16px;
  color: white;
  aspect-ratio: 0.58;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 240px;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
}

.certificate-name {
  font-size: 12px;
  font-weight: 600;
}

.user-icon {
  font-size: 16px;
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
  font-size: 18px;
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
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.status-badge {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 600;
}

/* 메뉴 리스트 */
.menu-list {
  margin: 6px 0 0 0;
  max-width: 390px;
  width: 100%;
  padding: 0 30px 0 30px;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-bottom: 0;
  padding-bottom: 0;
  background: #fff;
  border-radius: 12px;
}

.menu-item {
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  font-size: 15px;
  color: var(--color-text);
  box-sizing: border-box;
  word-break: keep-all;
  overflow-x: hidden;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f9f9f9;
}

.menu-item:last-child {
  border-bottom: 1px solid #f3f4f6;
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

.danger-chevron {
  color: var(--color-accent);
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
