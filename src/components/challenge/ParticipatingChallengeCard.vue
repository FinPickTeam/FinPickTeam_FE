<!-- src/components/challenge/ParticipatingChallengeCard.vue -->
<template>
  <div class="challenge-card" @click="handleCardClick">
    <!-- 결과 확인 배지 -->
    <span
      v-if="needsResultConfirm && isSuccess !== null"
      class="badge"
      :class="isSuccess ? 'badge-success' : 'badge-danger'"
      :title="`결과 확인 페이지에서 보상 확정이 필요합니다 (isSuccess: ${isSuccess}, type: ${typeof isSuccess})`"
    >
      <!-- 성공/실패 상태 표시 원 -->
      <div
        class="status-indicator"
        :class="isSuccess ? 'success' : 'failure'"
        :title="`상태: ${isSuccess ? '성공' : '실패'} (값: ${isSuccess})`"
        @click.stop="handleCardClick"
      ></div>
      결과 확인
    </span>

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
      isSuccess: null,
      status: 'RECRUITING',
      usePassword: false,
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
  return (
    props.challenge?.status === 'COMPLETED' && !props.challenge?.isResultCheck
  );
});

// 결과 확인이 필요한지 여부
const needsResultConfirm = computed(() => {
  return (
    props.challenge?.status === 'COMPLETED' && !props.challenge?.isResultCheck
  );
});

// 성공/실패 여부
const isSuccess = computed(() => {
  const success = props.challenge?.isSuccess ?? null;
  console.log('ParticipatingChallengeCard - isSuccess 디버깅:', {
    challengeId: props.challenge?.id,
    isSuccess: success,
    type: typeof success,
    challenge: props.challenge,
    computedValue: success,
  });
  return success;
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
  // 서버가 categoryName을 내려주면 그걸 우선 사용
  if (props.challenge?.categoryName) return props.challenge.categoryName;

  // (구) local dummy 대비 호환
  const categories = {
    1: '전체 소비',
    2: '식비',
    3: '카페·간식',
    4: '교통비',
    5: '미용·쇼핑',
  };
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

/* 결과 확인 배지 */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 10px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.badge-danger {
  background: #ffe5e5;
  color: #d32f2f;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-success {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.status-indicator:hover {
  transform: scale(1.2);
}

.status-indicator.success {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 50%, #388e3c 100%);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.4),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
}

.status-indicator.failure {
  background: linear-gradient(135deg, #ef5350 0%, #f44336 50%, #d32f2f 100%);
  box-shadow: 0 2px 6px rgba(244, 67, 54, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.4),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 6px 12px;
  border-radius: 14px;
  display: inline-block;
}
</style>
