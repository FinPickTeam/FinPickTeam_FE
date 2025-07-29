<template>
  <div class="myhome-scroll-container">
    <!-- 상단 헤더 -->
    <div class="obmyhome-header">
      <button class="obmyhome-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <div class="obmyhome-header-icons">
        <button class="obmyhome-icon-btn">
          <font-awesome-icon :icon="['fas', 'search']" />
        </button>
        <button class="obmyhome-icon-btn">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
      </div>
    </div>

    <!-- 자산 정보 카드 -->
    <div class="obmyhome-asset-card">
      <div class="obmyhome-asset-row">
        <span class="obmyhome-asset-title">총 자산</span>
        <span class="obmyhome-asset-time">07:28 갱신</span>
      </div>
      <div class="obmyhome-asset-amount">
        10,000,000<span class="obmyhome-asset-won">원</span>
      </div>
      <div class="obmyhome-asset-diff">
        <font-awesome-icon
          :icon="['fas', 'triangle-exclamation']"
          class="obmyhome-asset-diff-icon"
        />
        <span class="obmyhome-asset-diff-text">전월 대비 12.5%</span>
      </div>
    </div>

    <!-- 계좌 리스트 -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">계좌</span>
        <button class="obmyhome-section-more">&gt;</button>
      </div>
      <div class="obmyhome-account-list">
        <div
          class="obmyhome-account-item"
          v-for="(acc, idx) in accounts"
          :key="idx"
        >
          <img class="obmyhome-bank-logo" :src="acc.logo" alt="은행로고" />
          <div class="obmyhome-account-info">
            <div class="obmyhome-account-name">{{ acc.name }}</div>
            <div class="obmyhome-account-balance">
              {{ acc.balance.toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 소비 정보 -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">소비</span>
        <button class="obmyhome-section-more">&gt;</button>
      </div>
      <table class="obmyhome-spend-table">
        <thead>
          <tr>
            <th>최대 소비</th>
            <th>카테고리</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>7일 소비</td>
            <td>식비</td>
            <td>120,000</td>
          </tr>
        </tbody>
      </table>
      <button class="obmyhome-report-btn" @click="goToDiary">
        월간 리포트 보기
      </button>
    </div>

    <!-- 하단 네비게이션 -->
    <Navbar />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "../../components/Navbar.vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faSearch,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft, faSearch, faPlus, faTriangleExclamation);

// 은행 로고 이미지 import
import kakaoLogo from "@/assets/bank_logo/카카오뱅크.png";

const router = useRouter();
const goBack = () => {
  router.push("/");
};

const accounts = ref([
  {
    logo: kakaoLogo,
    name: "KB IT’s Your Life 6개월 정기예금",
    balance: 250000,
  },
  {
    logo: kakaoLogo,
    name: "KB IT’s Your Life 6개월 정기예금",
    balance: 250000,
  },
]);

const goToDiary = () => {
  router.push("/openbanking/diaryhome");
};
</script>

<style scoped>
.myhome-scroll-container {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.myhome-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.obmyhome-container {
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #f7f8fa;
  font-family: "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  padding-bottom: 0;
}
.obmyhome-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}
.obmyhome-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}
.obmyhome-back:hover {
  background: #f3f3f3;
}
.obmyhome-header-icons {
  display: flex;
  gap: 12px;
}
.obmyhome-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}
.obmyhome-icon-btn:hover {
  background: #f3f3f3;
}

.obmyhome-asset-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 18px 16px 16px 16px;
  padding: 22px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.obmyhome-asset-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.obmyhome-asset-title {
  font-size: 1.05rem;
  color: #888;
  font-weight: 500;
}
.obmyhome-asset-time {
  font-size: 0.85rem;
  color: #bdbdbd;
}
.obmyhome-asset-amount {
  font-size: 2.1rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 2px;
}
.obmyhome-asset-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 2px;
}
.obmyhome-asset-diff {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.95rem;
  color: #e11d48;
  font-weight: 500;
}
.obmyhome-asset-diff-icon {
  color: #e11d48;
  font-size: 1rem;
}

.obmyhome-section-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 0 16px 16px 16px;
  padding: 18px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.obmyhome-section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.obmyhome-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.obmyhome-section-more {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #bdbdbd;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.obmyhome-section-more:hover {
  background: #f3f3f3;
}
.obmyhome-account-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.obmyhome-account-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f8fa;
  border-radius: 12px;
  padding: 10px 14px;
}
.obmyhome-bank-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  object-fit: cover;
  border: 1px solid #ececec;
}
.obmyhome-account-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.obmyhome-account-name {
  font-size: 0.98rem;
  color: #222;
  font-weight: 500;
}
.obmyhome-account-balance {
  font-size: 1.05rem;
  color: #4318d1;
  font-weight: 700;
}

.obmyhome-spend-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.obmyhome-spend-table th,
.obmyhome-spend-table td {
  padding: 7px 4px;
  text-align: left;
  font-size: 0.98rem;
}
.obmyhome-spend-table th {
  color: #888;
  font-weight: 500;
  border-bottom: 1px solid #ececec;
}
.obmyhome-spend-table td {
  color: #222;
  font-weight: 500;
}
.obmyhome-report-btn {
  width: 100%;
  background: #ece9fd;
  color: #4318d1;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.15s;
}
.obmyhome-report-btn:hover {
  background: #e0d7fa;
}

@media (max-width: 430px) {
  .obmyhome-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
