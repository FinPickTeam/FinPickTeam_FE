<template>
  <div class="challenge-container">
    <div class="challenge-header">
      <button class="back-btn">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="challenge-title">챌린지</span>
      <div class="header-icons">
        <font-awesome-icon :icon="['fas', 'pen']" class="header-icon" />
        <font-awesome-icon :icon="['fas', 'trash']" class="header-icon" />
      </div>
    </div>
    <div class="challenge-box">
      <div class="greeting">
        안녕하세요, <span class="username">사용자님!</span>
      </div>
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-value">10</div>
          <div class="stat-label">회</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">8</div>
          <div class="stat-label">회</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">80</div>
          <div class="stat-label">%</div>
        </div>
      </div>
      <div class="carousel-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <font-awesome-icon
          :icon="['fas', 'calendar-alt']"
          class="section-icon"
        />
        참여중인 소그룹
      </div>
      <div class="group-list">
        <div class="group-card" v-for="i in 3" :key="i">
          <div class="group-title">커피 5회 이하 마시기</div>
          <div class="group-date">2020.00.00 ~ 11.11</div>
          <div class="group-progress">(70%)</div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title hot">
        <font-awesome-icon :icon="['fas', 'search']" class="section-icon" />
        현재 HOT 한 챌린지
      </div>
      <div class="hot-list">
        <div class="hot-card" v-for="i in 3" :key="i">
          <font-awesome-icon :icon="['fas', 'fire']" class="hot-icon" />
          <div class="hot-title">커피 5회 이하 마시기</div>
          <div class="hot-date">2020.00.00 ~ 11.11</div>
          <div class="hot-progress">(4명 / 5명)</div>
          <button class="hot-btn">참여하러 가기</button>
        </div>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import Navbar from "../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faPen,
  faTrash,
  faCalendarAlt,
  faSearch,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft, faPen, faTrash, faCalendarAlt, faSearch, faFire);
</script>

<style scoped>
.challenge-container {
  width: 390px;
  min-height: 844px;
  background: #f7f8fa;
  margin: 0 auto;
  font-family: var(--font-main);
  position: relative;
  box-sizing: border-box;
  padding-bottom: 80px;
}
.challenge-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 18px 0 18px;
  background: linear-gradient(
    135deg,
    var(--color-main-light) 0%,
    var(--color-main) 100%
  );
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  height: 64px;
  position: relative;
}
.back-btn {
  background: none;
  border: none;
  font-size: var(--font-size-title-sub);
  color: #222;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
}
.challenge-title {
  font-size: var(--font-size-title-main);
  font-weight: var(--font-weight-bold);
  color: #fff;
  flex: 1;
  text-align: center;
}
.header-icons {
  display: flex;
  gap: 10px;
}
.header-icon {
  color: #fff;
  font-size: var(--font-size-title-sub);
  cursor: pointer;
}
.challenge-box {
  background: linear-gradient(
    135deg,
    var(--color-main-light) 0%,
    var(--color-main) 100%
  );
  padding: 0 0 4px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.greeting {
  color: #fff;
  font-size: var(--font-size-title-sub);
  margin-top: 12px;
  margin-bottom: 12px;
}
.username {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-main);
}
.stats-card {
  display: flex;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(67, 24, 209, 0.08);
  padding: 18px 0;
  width: 90%;
  max-width: 320px;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: #222;
  margin-bottom: 2px;
}
.stat-label {
  color: #888;
  font-size: var(--font-size-body);
}
.carousel-dots {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  justify-content: center;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.4;
}
.dot.active {
  opacity: 1;
  background: #fff;
  border: 2px solid var(--color-main);
}
.section {
  margin: 18px 0 0 0;
  padding: 0 18px;
}
.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-title.hot {
  color: #4318d1;
}
.section-icon {
  font-size: 18px;
  color: #4318d1;
}
.group-list {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}
.group-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.08);
  padding: 18px 14px;
  min-width: 120px;
  max-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.98rem;
}
.group-title {
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
  text-align: center;
}
.group-date {
  color: #888;
  font-size: 0.92rem;
  margin-bottom: 4px;
}
.group-progress {
  color: #4318d1;
  font-size: 0.95rem;
  font-weight: 600;
}
.hot-list {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}
.hot-card {
  background: #e7e0fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.08);
  padding: 18px 14px 14px 14px;
  min-width: 120px;
  max-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.98rem;
  position: relative;
}
.hot-icon {
  color: #ff9800;
  font-size: 32px;
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
}
.hot-title {
  font-weight: bold;
  color: #222;
  margin-top: 18px;
  margin-bottom: 6px;
  text-align: center;
}
.hot-date {
  color: #888;
  font-size: 0.92rem;
  margin-bottom: 4px;
}
.hot-progress {
  color: #4318d1;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.hot-btn {
  background: #4318d1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
}
.hot-btn:hover {
  background: #6c4cf1;
}
</style>
