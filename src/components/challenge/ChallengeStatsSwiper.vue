<template>
  <Swiper
    :modules="[Pagination, Autoplay]"
    :slides-per-view="1"
    :space-between="20"
    :pagination="{ clickable: true }"
    :loop="false"
    :autoplay="{ delay: 3000, disableOnInteraction: false }"
    class="stats-swiper"
  >
    <SwiperSlide v-for="(item, index) in slides" :key="index">
      <div class="stats-container">
        <!-- 누적 포인트 슬라이드 -->
        <div v-if="item.kind === 'points'" class="points-container">
          <div class="points-number">{{ formatNumber(item.value) }}</div>
          <div class="points-label">월별 누적 포인트</div>
        </div>

        <!-- 요약 통계 슬라이드 -->
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
import { computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * props
 * summary: { totalChallenges, successCount, achievementRate }
 * points: number | null (월별 누적 포인트)
 */
const props = defineProps({
  summary: {
    type: Object,
    default: () => ({
      totalChallenges: 0,
      successCount: 0,
      achievementRate: 0,
    }),
  },
  points: {
    type: [Number, null],
    default: null,
  },
});

const slides = computed(() => {
  const arr = [];
  // 1) 요약 슬라이드
  arr.push({
    kind: 'summary',
    total: props.summary.totalChallenges ?? 0,
    success: props.summary.successCount ?? 0,
    rate: Math.round(props.summary.achievementRate ?? 0),
  });
  // 2) 포인트 슬라이드 (API가 값 줄 때만 표시)
  if (props.points != null) {
    arr.push({ kind: 'points', value: Number(props.points) || 0 });
  }
  return arr;
});

const formatNumber = (n) => Number(n || 0).toLocaleString();
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
