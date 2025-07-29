<template>
  <div class="diaryhome-scroll-container">
    <div class="diaryhome-container">
      <!-- 상단 헤더 -->
      <div class="diaryhome-header">
        <button class="diaryhome-back" @click="goBack">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </button>
        <div class="diaryhome-header-icons">
          <button class="diaryhome-icon-btn">
            <font-awesome-icon :icon="['fas', 'search']" />
          </button>
          <button class="diaryhome-icon-btn">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>

      <!-- 월간 소비/달력 영역 -->
      <div class="diaryhome-month-card">
        <div class="diaryhome-month-row">
          <span class="diaryhome-month-arrow">&lt;</span>
          <span class="diaryhome-month-title">7월</span>
        </div>
        <div class="diaryhome-month-amount">
          800,000<span class="diaryhome-won">원</span>
        </div>
        <div class="diaryhome-month-desc">
          지난 달보다 <span class="diaryhome-more">20만원 더</span> 쓰는 중
        </div>
        <!-- 달력 박스 -->
        <div class="diaryhome-calendar-box">
          <div class="diaryhome-calendar-row diaryhome-calendar-header">
            <span v-for="d in days" :key="d">{{ d }}</span>
          </div>
          <div class="diaryhome-calendar-row diaryhome-calendar-days">
            <span v-for="n in 7" :key="n" :class="{ selected: n + 2 === 6 }">{{
              n + 2
            }}</span>
          </div>
        </div>
        <div class="diaryhome-calendar-date-row">
          <span class="diaryhome-calendar-date">7월 6일 수요일</span>
          <span class="diaryhome-calendar-arrow" @click="goCalendarDetail">
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </span>
        </div>
      </div>
      <hr class="diaryhome-divider" />
      <!-- 카드 내역 리스트 -->
      <div class="diaryhome-list-section">
        <div class="diaryhome-list-item" v-for="i in 4" :key="i">
          <img class="diaryhome-bank-logo" :src="kakaoLogo" alt="은행로고" />
          <div class="diaryhome-list-info">
            <div class="diaryhome-list-amount">+250,000원</div>
            <div class="diaryhome-list-name">
              KB IT’s Your Life 6개월 정기예금
            </div>
          </div>
        </div>
      </div>

      <!-- 이번 달 남은 돈 -->
      <div class="diaryhome-summary-section">
        <div class="diaryhome-summary-title">이번 달 남은 돈</div>
        <div class="diaryhome-summary-date">7월 6일 기준</div>
        <div class="diaryhome-summary-table">
          <div class="diaryhome-summary-row">
            <span>수입</span>
            <span class="diaryhome-summary-income">+10,000,000</span>
          </div>
          <div class="diaryhome-summary-row">
            <span>소비</span>
            <span class="diaryhome-summary-spend">-800,000</span>
          </div>
          <div class="diaryhome-summary-row diaryhome-summary-left">
            <span>남은 금액</span>
            <span class="diaryhome-summary-left-amount">9,200,000</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faSearch,
  faPlus,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft, faSearch, faPlus, faAngleRight);

// 은행 로고 이미지 import
import kakaoLogo from "@/assets/bank_logo/카카오뱅크.png";

const router = useRouter();
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
const goToReport = () => {
  router.push("/openbanking/myhome");
};
const goCalendarDetail = () => {
  router.push("/openbanking/diary");
};
const days = ["일", "월", "화", "수", "목", "금", "토"];
</script>

<style scoped>
.diaryhome-scroll-container {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.diaryhome-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.diaryhome-container {
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #f7f8fa;
  font-family: "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  padding-bottom: 80px;
}
.diaryhome-header {
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
.diaryhome-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}
.diaryhome-back:hover {
  background: #f3f3f3;
}
.diaryhome-header-icons {
  display: flex;
  gap: 12px;
}
.diaryhome-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}
.diaryhome-icon-btn:hover {
  background: #f3f3f3;
}

.diaryhome-month-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 18px 16px 16px 16px;
  padding: 22px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.diaryhome-month-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
}
.diaryhome-month-arrow {
  color: #4318d1;
  font-size: 1.2rem;
  cursor: pointer;
}
.diaryhome-month-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.diaryhome-month-amount {
  font-size: 2.1rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 2px;
}
.diaryhome-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 2px;
}
.diaryhome-month-desc {
  font-size: 1rem;
  color: #888;
  margin-bottom: 8px;
}
.diaryhome-more {
  color: #e11d48;
  font-weight: 600;
}
.diaryhome-calendar {
  margin-bottom: 6px;
}
.diaryhome-calendar-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #888;
}
.diaryhome-calendar-header {
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
}
.diaryhome-calendar-days {
  color: #888;
}
.diaryhome-calendar-date {
  font-size: 0.95rem;
  color: #888;
  margin-top: 2px;
}

.diaryhome-list-section {
  margin: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.diaryhome-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 1px 4px rgba(67, 24, 209, 0.04);
}
.diaryhome-bank-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  object-fit: cover;
  border: 1px solid #ececec;
}
.diaryhome-list-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.diaryhome-list-amount {
  font-size: 1.05rem;
  color: #4318d1;
  font-weight: 700;
}
.diaryhome-list-name {
  font-size: 0.98rem;
  color: #222;
  font-weight: 500;
}

.diaryhome-summary-section {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 0 16px 16px 16px;
  padding: 18px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.diaryhome-summary-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.diaryhome-summary-date {
  font-size: 0.95rem;
  color: #888;
}
.diaryhome-summary-table {
  margin-top: 8px;
}
.diaryhome-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #222;
  margin-bottom: 2px;
}
.diaryhome-summary-income {
  color: #4318d1;
  font-weight: 700;
}
.diaryhome-summary-spend {
  color: #e11d48;
  font-weight: 700;
}
.diaryhome-summary-left {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4318d1;
  margin-top: 6px;
}
.diaryhome-summary-left-amount {
  color: #4318d1;
  font-size: 1.2rem;
  font-weight: 800;
}

.diaryhome-report-btn {
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  background: #ece9fd;
  color: #4318d1;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.diaryhome-report-btn:hover {
  background: #e0d7fa;
}

.diaryhome-calendar-box {
  /* border: 2px solid #764ba2; */
  border-radius: 16px;
  padding: 12px 10px 8px 10px;
  margin-bottom: 8px;
  background: #fff;
}
.diaryhome-calendar-days span.selected {
  background: #764ba2;
  color: #fff;
  border-radius: 8px;
  padding: 2px 8px;
  font-weight: 700;
}
.diaryhome-calendar-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 2px 8px 2px;
  font-size: 1rem;
  color: #222;
}
.diaryhome-calendar-arrow {
  color: #4318d1;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
.diaryhome-divider {
  border: none;
  border-top: 1.5px solid #ececec;
  margin: 0 0 10px 0;
}

@media (max-width: 430px) {
  .diaryhome-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
