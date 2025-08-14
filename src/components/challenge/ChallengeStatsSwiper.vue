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
 * common: { id, title, status, startDate, endDate, participantsCount } | null
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
  common: {
    type: [Object, null],
    default: null,
  },
});

const emit = defineEmits(['open-common']);

const slides = computed(() => {
  const arr = [];
  // 1) 요약
  arr.push({
    kind: 'summary',
    total: props.summary.totalChallenges ?? 0,
    success: props.summary.successCount ?? 0,
    rate: Math.round(props.summary.achievementRate ?? 0),
  });
  // 2) 월 누적 포인트
  if (props.points != null) {
    arr.push({ kind: 'points', value: Number(props.points) || 0 });
  }
  // 3) 공통 챌린지
  if (props.common?.id) {
    arr.push({
      kind: 'common',
      id: props.common.id,
      title: props.common.title || '공통 챌린지',
      status: props.common.status || 'RECRUITING',
      startDate: props.common.startDate || null,
      endDate: props.common.endDate || null,
      participantsCount: Number(props.common.participantsCount || 0),
    });
  }
  return arr;
});

const formatNumber = (n) => Number(n || 0).toLocaleString();

const daysLeft = (endDateStr) => {
  if (!endDateStr) return null;
  const today = new Date();
  const end = new Date(endDateStr);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return isNaN(diff) ? null : diff;
};

const openCommon = (s) => {
  if (s?.id) emit('open-common');
};
</script>

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
      <div
          class="stats-container"
          :class="{ clickable: item.kind === 'common' }"
          @click="item.kind === 'common' ? openCommon(item) : null"
      >
        <!-- 1) 요약 -->
        <div v-if="item.kind === 'summary'" class="stats-content">
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

        <!-- 2) 포인트 -->
        <div v-else-if="item.kind === 'points'" class="points-container">
          <div class="points-number">{{ formatNumber(item.value) }}</div>
          <div class="points-label">월별 누적 포인트</div>
        </div>

        <!-- 3) 공통 챌린지 -->
        <div v-else-if="item.kind === 'common'" class="common-container">
          <div class="common-badge">공통 챌린지</div>
          <div class="common-title">{{ item.title }}</div>
          <div class="common-sub">
            <span class="chip" :data-variant="item.status">
              {{ item.status === 'RECRUITING' ? '모집중' : item.status === 'IN_PROGRESS' ? '진행중' : '종료' }}
            </span>
            <span class="sep">·</span>
            <span>참여 {{ formatNumber(item.participantsCount) }}명</span>
            <template v-if="daysLeft(item.endDate) !== null && item.status !== 'COMPLETED'">
              <span class="sep">·</span>
              <span>D-{{ daysLeft(item.endDate) }}</span>
            </template>
          </div>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>

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
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  width: 90%;
  max-width: 320px;
  margin: 0 auto;
  min-height: 100px;
}
.stats-container.clickable { cursor: pointer; }

.stat-item { display:flex; flex-direction:row; align-items:center; justify-content:center; gap:10px; }
.stat-number { font-family: 'JalnanGothic', sans-serif; font-size: 1.5rem; font-weight: 900; color: #222; }
.stat-label { font-size: 14px; color: #666; }
.stat-divider { width:1px; height:40px; background:#e0e0e0; }

.points-container { display:flex; flex-direction:row; align-items:center; justify-content:center; gap:10px; width:100%; }
.points-number { font-family:'JalnanGothic', sans-serif; font-size:1.5rem; font-weight:900; color:#222; }
.points-label { font-size:14px; color:#666; }

.stats-content { display:flex; width:100%; justify-content:space-around; align-items:center; }

.common-container { display:flex; flex-direction:column; width:100%; align-items:center; gap:8px; }
.common-badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#f3f0ff; color:#6b46c1; font-weight:700; }
.common-title { font-weight:900; color:#222; text-align:center; font-size:1.05rem; line-height:1.2; }
.common-sub { color:#666; font-size:13px; display:flex; align-items:center; gap:6px; }
.sep { color:#ccc; }
.chip {
  font-size: 12px; padding: 2px 8px; border-radius: 999px; background:#eee; color:#444; font-weight:600;
}
.chip[data-variant="RECRUITING"] { background:#eaf2ff; color:#1e61d6; }
.chip[data-variant="IN_PROGRESS"] { background:#eafff1; color:#1e9d5a; }
.chip[data-variant="COMPLETED"] { background:#f5f5f5; color:#888; }

:deep(.swiper-pagination){ bottom:0; position:relative; margin-top:2px; }
:deep(.swiper-pagination-bullet){ width:8px; height:8px; background:#ddd; opacity:1; }
:deep(.swiper-pagination-bullet-active){ background:#6b46c1; }
</style>
