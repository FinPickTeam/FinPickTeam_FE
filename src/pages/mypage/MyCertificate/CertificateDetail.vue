<template>
  <div class="certificate-detail-container">
    <!-- 상단 헤더 -->
    <div class="certificate-header">
      <button class="certificate-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="certificate-title">간편 비밀번호 정보</span>
      <div class="certificate-header-right"></div>
    </div>

    <!-- 인증서 정보 카드 -->
    <div class="certificate-info-card">
      <div class="info-row">
        <span class="info-label">상태</span>
        <span class="info-value status-normal">정상</span>
      </div>
      <div class="info-row">
        <span class="info-label">생성일</span>
        <span class="info-value">2025-08-01</span>
      </div>
      <div class="info-row">
        <span class="info-label">만료일</span>
        <span class="info-value">2026-07-31</span>
      </div>
      <div class="info-row">
        <span class="info-label">유효기간</span>
        <span class="info-value">1년</span>
      </div>
      <div class="info-row">
        <span class="info-label">발급기관명</span>
        <span class="info-value">FinPick</span>
      </div>
    </div>

    <!-- 하단 네비게이션 -->
    <Navbar />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar.vue";

// FontAwesome 아이콘 등록
library.add(faAngleLeft);

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.certificate-detail-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px;
}

.certificate-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #ececec;
  position: sticky;
  top: 0;
  z-index: 100;
}

.certificate-back {
  background: none;
  border: none;
  font-size: 20px;
  color: #222;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.certificate-back:hover {
  background: #f3f3f3;
}

.certificate-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}

.certificate-header-right {
  width: 36px;
}

.certificate-info-card {
  background: #fff;
  margin: 16px;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  border: 1px solid #e0e0e0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: #222;
  font-weight: 600;
}

.info-value.status-normal {
  color: #059669;
  font-weight: 600;
}

@media (max-width: 430px) {
  .certificate-detail-container {
    width: 100vw;
  }
}
</style>
