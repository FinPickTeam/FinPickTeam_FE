<!-- src/components/challenge/ParticipatingChallengeCard.vue -->
<template>
  <div class="challenge-card" @click="handleCardClick">
    <div class="card-header">
      <h3 class="challenge-title">{{ challenge.title }}</h3>

      <div class="status-area">
        <span
          v-if="needsResultConfirm"
          class="badge"
          :class="isSuccess ? 'badge-success' : 'badge-danger'"
          title="결과 확인 페이지에서 보상 확정이 필요합니다"
        >
          <!-- 성공/실패 상태 표시 원 -->
          <div
            v-if="isSuccess !== null"
            class="status-indicator"
            :class="isSuccess ? 'success' : 'failure'"
            @click.stop="handleCardClick"
          ></div>
          결과 확인
        </span>
      </div>
    </div>

    <div class="card-content">
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
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 10px;
  white-space: nowrap;
}

.badge-danger {
  background: #ffe5e5;
  color: #d32f2f;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-success {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 성공/실패 상태 표시 원 */
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 8px;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.status-area {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
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
  font-weight: 500;
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
