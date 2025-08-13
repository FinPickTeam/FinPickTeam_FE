<!-- src/components/challenge/ParticipatingChallengeCard.vue -->
<template>
  <div class="challenge-card" @click="handleCardClick">
    <!-- ✅ 미확인 배지 -->
    <div v-if="isUnconfirmed" class="badge-unconfirmed">미확인</div>

    <h4 class="challenge-title">{{ challenge.title }}</h4>
    <div class="challenge-date">
      {{ formatDate(challenge.startDate) }} ~
      {{ formatDate(challenge.endDate) }}
    </div>

    <div class="challenge-footer">
      <div class="progress-category-group">
        <div class="challenge-progress" v-if="challenge.myProgressRate !== null">
          진행률 {{ Math.round(challenge.myProgressRate * 100) }}%
        </div>
        <div class="challenge-progress" v-else>진행률 0%</div>

        <div class="challenge-category">
          {{ getCategoryName(challenge.categoryId) }}
        </div>
        <div class="challenge-type">
          {{ getChallengeTypeName(challenge.type) }}
        </div>
      </div>
    </div>
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
      type: 'PERSONAL',
      categoryId: 1,
      categoryName: '',
      startDate: '',
      endDate: '',
      participating: false,
      myProgressRate: null,
      participantsCount: 0,
      isResultCheck: false,
      status: 'RECRUITING',
    }),
  },
});

const emit = defineEmits(['click', 'cardClick']);

const handleCardClick = () => {
  emit('cardClick', {
    challenge: props.challenge,
    type: props.challenge.type.toLowerCase(),
  });
};

// “완료 & 미확인” 여부
const isUnconfirmed = computed(() => {
  return props.challenge?.status === 'COMPLETED' && !props.challenge?.isResultCheck;
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 카테고리 이름 반환 함수
const getCategoryName = (categoryId) => {
  // 서버가 categoryName을 내려주면 그걸 우선 사용
  if (props.challenge?.categoryName) return props.challenge.categoryName;

  // (구) local dummy 대비 호환
  const categories = { 1: '전체 소비', 2: '식비', 3: '카페·간식', 4: '교통비', 5: '미용·쇼핑' };
  return categories[categoryId] || '기타';
};

// 챌린지 타입 이름 반환 함수
const getChallengeTypeName = (type) => {
  const types = { COMMON: '공통', PERSONAL: '개인', GROUP: '그룹' };
  return types[type] || '기타';
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

/* ✅ 미확인 배지 */
.badge-unconfirmed {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4f;
  color: #fff;
  font-weight: 700;
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}
.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
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
.challenge-type {
  font-size: 12px;
  color: #666;
  background: rgba(102, 102, 102, 0.1);
  padding: 6px 12px;
  border-radius: 14px;
  white-space: nowrap;
  font-weight: 500;
}
.challenge-progress {
  font-size: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-main-dark) 0%, var(--color-main-light) 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 14px;
  display: inline-block;
}
</style>
