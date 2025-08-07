<template>
  <Swiper
    :modules="[Pagination, Autoplay]"
    :slides-per-view="1"
    :space-between="20"
    :pagination="{
      clickable: true,
    }"
    :loop="true"
    :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }"
    class="stats-swiper"
  >
    <SwiperSlide v-for="(item, index) in statsData" :key="index">
      <div class="stats-container">
        <!-- 누적 포인트 슬라이드 -->
        <div v-if="item.points" class="points-container">
          <div class="points-number">{{ item.points.toLocaleString() }}</div>
          <div class="points-label">포인트</div>
        </div>

        <!-- 기존 통계 슬라이드 -->
        <div v-else class="stats-content">
          <div class="stat-item">
            <div class="stat-number">{{ item.total }}</div>
            <div class="stat-label">회</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ item.success }}</div>
            <div class="stat-label">회</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ item.rate }}</div>
            <div class="stat-label">%</div>
          </div>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// 더미 통계 데이터 (슬라이드 여러 개로 만들고 싶을 경우)
const statsData = [
  { total: 10, success: 8, rate: 80 },
  { points: 1250 }, // 누적 포인트 슬라이드
];
</script>

<style scoped>
.stats-swiper {
  padding: 2px 0 10px 0;
  width: 100%;
}

.stats-container {
  display: flex;
  background: #fff;
  border-radius: 18px;
  padding: 30px;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  width: 90%;
  max-width: 320px;
  margin: 0 auto;
  min-height: 100px;
}

.stat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.stat-number {
  font-family: 'JalnanGothic', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #222;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e0e0e0;
}

/* 누적 포인트 스타일 */
.points-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.points-number {
  font-family: 'JalnanGothic', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #222;
}

.points-label {
  font-size: 14px;
  color: #666;
}

.stats-content {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}

/* Swiper pagination 커스터마이징 */
:deep(.swiper-pagination) {
  bottom: 0;
  position: relative;
  margin-top: 2px;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: #ddd;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: #6b46c1;
}
</style>
