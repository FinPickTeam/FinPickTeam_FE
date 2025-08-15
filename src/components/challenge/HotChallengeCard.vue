<template>
  <div class="challenge-card hot" @click="handleCardClick">
    <div class="hot-banner">
      <i class="fas fa-fire"></i>
      <span>HOT</span>
    </div>
    <div class="challenge-header">
      <h4 class="challenge-title">{{ challenge.title }}</h4>
      <div class="challenge-category">
        {{ getCategoryName(challenge.categoryId) }}
      </div>
    </div>
    <div class="challenge-date">
      {{ formatDate(challenge.startDate) }} ~
      {{ formatDate(challenge.endDate) }}
    </div>
    <div class="challenge-participants">
      <div class="participants-info">
        <span class="participants-text"
          >{{ challenge.participantsCount }}명 참여중</span
        >
        <!-- ✅ 공통은 정원 없음 → 정원 텍스트 숨김 -->
        <span v-if="!isCommon" class="max-participants">/ 6명</span>
      </div>

      <!-- ✅ 공통은 정원 기반 게이지 제거 -->
      <div v-if="!isCommon" class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${(challenge.participantsCount / 6) * 100}%` }"
        ></div>
      </div>
    </div>
    <button class="participate-btn" @click.stop="handleParticipate">
      참여하러 가기
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '',
      type: 'GROUP',
      categoryId: 1,
      startDate: '',
      endDate: '',
      participating: false,
      myProgressRate: null,
      participantsCount: 0,
      isResultCheck: false,
    }),
  },
});

const emit = defineEmits(['participate', 'click', 'cardClick']);

// 공통 챌린지 여부 확인
const isCommon = computed(() => {
  return props.challenge.type === 'COMMON';
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}.${String(date.getDate()).padStart(2, '0')}`;
};

// 카테고리 이름 반환 함수
const getCategoryName = (categoryId) => {
  // categoryName을 한글로 매핑
  const categoryMapping = {
    total: '전체 소비',
    food: '식비',
    snack: '카페·간식',
    transport: '교통비',
    shopping: '미용·쇼핑',
  };
  return (
    categoryMapping[props.challenge.categoryName] ||
    props.challenge.categoryName ||
    '기타'
  );
};

const handleParticipate = () => {
  emit('participate', props.challenge);
};

const handleCardClick = () => {
  emit('cardClick', {
    challenge: props.challenge,
    type: props.challenge.type.toLowerCase(),
  });
  emit('click', props.challenge);
};
</script>

<style scoped>
.challenge-card.hot {
  min-width: 280px;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.challenge-card.hot:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hot-banner {
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 8px 12px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.hot-banner i {
  font-size: 14px;
  color: #ff9800;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 40px 0 8px 0;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: 8px;
}

.challenge-category {
  font-size: 12px;
  color: var(--color-main);
  background: rgba(107, 70, 193, 0.1);
  padding: 6px 12px;
  border-radius: 14px;
  white-space: nowrap;
  font-weight: 500;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.challenge-participants {
  margin-bottom: 16px;
}

.participants-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.participants-text {
  font-size: 14px;
  color: #666;
}

.max-participants {
  font-size: 14px;
  color: #999;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  border-radius: 3px;
  transition: width 0.3s ease;
}

.participate-btn {
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s ease;
}

.participate-btn:hover {
  transform: translateY(-1px);
}
</style>
