<template>
  <div class="challenge-card" @click="handleCardClick">
    <div class="card-header">
      <h3 class="challenge-title">{{ challenge.title }}</h3>
      <div class="challenge-type">
        {{ getChallengeTypeName(challenge.type) }}
      </div>
    </div>
    <div class="card-content">
      <div class="challenge-date">
        {{ formatDate(challenge.startDate) }} ~
        {{ formatDate(challenge.endDate) }}
      </div>
      <!-- 참여중인 챌린지: 개인 진행률 표시 -->
      <div
        class="progress-info"
        v-if="challenge.participating && challenge.myProgressRate !== null"
      >
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: Math.round(challenge.myProgressRate * 100) + '%' }"
          ></div>
        </div>
        <span class="progress-text"
          >{{ Math.round(challenge.myProgressRate * 100) }}% 완료</span
        >
      </div>
      <div class="progress-info" v-else-if="challenge.participating">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        <span class="progress-text">0% 완료</span>
      </div>

      <!-- 모집중인 챌린지 리스트 페이지에서만 보여줌 -->
      <div
        class="participants-info"
        v-if="!challenge.participating && isRecruitingPage"
      >
        <div class="participants-text">
          <span>{{ challenge.participantsCount }}명 참여중</span>
          <span class="max-participants">/ 6명</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(challenge.participantsCount / 6) * 100}%` }"
          ></div>
        </div>
      </div>
      <div class="challenge-stats">
        <span class="stat">{{ getRemainingDays() }}일 남음</span>
        <span class="stat">{{ getStatText() }}</span>
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
  isRecruitingPage: {
    type: Boolean,
    default: false,
  },
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

// 챌린지 타입 이름 반환 함수
const getChallengeTypeName = (type) => {
  const types = {
    COMMON: '공통',
    PERSONAL: '개인',
    GROUP: '그룹',
  };
  return types[type] || '기타';
};

// 남은 일수 계산 함수
const getRemainingDays = () => {
  if (!props.challenge.endDate) return 0;
  const endDate = new Date(props.challenge.endDate);
  const today = new Date();
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const getStatText = () => {
  if (props.challenge.participating) {
    return '참여중';
  } else {
    return `${props.challenge.participantsCount}명 참여`;
  }
};

const emit = defineEmits(['cardClick']);

const handleCardClick = () => {
  emit('cardClick', {
    challenge: props.challenge,
    type: props.challenge.type.toLowerCase(),
  });
};
</script>

<style scoped>
.challenge-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.challenge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 8px;
}

.challenge-type {
  font-size: 12px;
  color: #666;
  background: rgba(102, 102, 102, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  white-space: nowrap;
  font-weight: 500;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

.participants-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.participants-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.max-participants {
  color: #999;
}

/* participants-info 내부의 progress-bar 스타일 조정 */
.participants-info .progress-bar {
  width: 100%;
  flex: none;
}

.challenge-stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 8px;
}
</style>
