<template>
  <div class="challenge-card" @click="$emit('click')">
    <h4 class="challenge-title">{{ challenge.title }}</h4>
    <div class="challenge-date">
      {{ formatDate(challenge.startDate) }} ~
      {{ formatDate(challenge.endDate) }}
    </div>
    <div class="challenge-footer">
      <div class="progress-category-group">
        <div
          class="challenge-progress"
          v-if="challenge.myProgressRate !== null"
        >
          진행률 {{ Math.round(challenge.myProgressRate * 100) }}%
        </div>
        <div class="challenge-progress" v-else>진행률 0%</div>
        <div class="challenge-category">
          {{ getCategoryName(challenge.categoryId) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  challenge: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '',
      type: 'PERSONAL',
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

defineEmits(['click']);

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
  const categories = {
    1: '전체 소비',
    2: '식비',
    3: '카페·간식',
    4: '교통비',
    5: '미용·쇼핑',
  };
  return categories[categoryId] || '기타';
};
</script>

<style scoped>
.challenge-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  min-width: 280px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.challenge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.challenge-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
}

.progress-category-group {
  display: flex;
  align-items: center;
  gap: 8px;
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

.challenge-progress {
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 6px 12px;
  border-radius: 14px;
  display: inline-block;
  font-size: 12px;
}
</style>
