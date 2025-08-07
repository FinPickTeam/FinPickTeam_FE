<template>
  <Swiper
    :modules="[Pagination]"
    :slides-per-view="1.1"
    :space-between="12"
    pagination
    class="stats-swiper"
  >
    <SwiperSlide v-for="(item, index) in statsData" :key="index">
      <div class="stats-container">
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
          <div class="stat-number">{{ item.rate }}%</div>
          <div class="stat-label">달성률</div>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// 더미 통계 데이터 (슬라이드 여러 개로 만들고 싶을 경우)
const statsData = [
  { total: 10, success: 8, rate: 80 },
  { total: 7, success: 5, rate: 71 },
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
