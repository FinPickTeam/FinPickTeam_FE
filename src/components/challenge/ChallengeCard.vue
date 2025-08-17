<template>
  <div class="challenge-card" @click="handleCardClick">
    <!-- 공통 챌린지 어두운 레이어 처리 -->
    <div v-if="isCommon && shouldShowOverlay" class="card-overlay">
      <div class="overlay-message">
        {{ overlayMessage }}
      </div>
    </div>

    <div class="card-header">
      <div class="title-container">
        <i
          v-if="isCreatorFlag && typeUpper !== 'PERSONAL'"
          class="fas fa-crown creator-icon"
          title="내가 생성한 챌린지"
        ></i>
        <h3 class="challenge-title">{{ challenge.title || '제목 없음' }}</h3>
      </div>

      <div class="status-area" v-if="!isRecruitingPage">
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
        <span
          v-if="
            statusUpper === 'RECRUITING' && getRecruitingRemainingDays() > 0
          "
          class="badge badge-recruiting"
          >모집중</span
        >
        <!-- 그룹 챌린지인 경우에만 비공개 아이콘 표시 -->
        <i
          v-if="typeUpper === 'GROUP' && challenge.usePassword"
          class="fas fa-lock visibility-icon"
          title="비공개 챌린지"
        ></i>
      </div>
    </div>

    <div class="card-content">
      <div class="challenge-date">
        {{ formatDate(challenge.startDate) }} ~
        {{ formatDate(challenge.endDate) }}
      </div>

      <div class="progress-info" v-if="isParticipating && progressNum !== null">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: Math.round(progressNum * 100) + '%' }"
          ></div>
        </div>
        <span class="progress-text"
          >{{ Math.round(progressNum * 100) }}% 완료</span
        >
      </div>

      <div class="progress-info" v-else-if="isParticipating">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        <span class="progress-text">0% 완료</span>
      </div>

      <!-- 공통 챌린지 참여자 수 표시 (참여중인 리스트에서) -->
      <div
        v-if="isCommon && !isRecruitingPage && !isParticipating"
        class="common-participants-container"
      >
        <span class="common-participants">{{ curParticipants }}명 참여중</span>
      </div>

      <!-- 모집 카드(참여중 아님) -->
      <div class="participants-info" v-else-if="isRecruitingPage">
        <!-- ✅ 공통: 참여자 수를 오른쪽 하단에 배치 -->
        <div v-if="isCommon" class="common-participants-container">
          <span class="common-participants"
            >{{ curParticipants }}명 참여중</span
          >
        </div>

        <!-- 그룹/개인: 기존 레이아웃 유지 -->
        <template v-else>
          <div class="participants-text">
            <span>{{ curParticipants }}명 참여중</span>
            <span class="max-participants">/ {{ maxParticipants }}명</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${progressRecruiting}%` }"
            ></div>
          </div>
        </template>
      </div>

      <div class="challenge-stats">
        <span class="stat stat-deadline">
          <template
            v-if="
              statusUpper === 'RECRUITING' && getRecruitingRemainingDays() > 0
            "
          >
            모집 마감 D-{{ getRecruitingRemainingDays() }}
          </template>
          <template v-else> D-{{ getRemainingDays() }} </template>
        </span>
        <!-- 카테고리 표시 -->
        <span class="stat stat-category">{{ getCategoryName() }}</span>
        <!-- 참여자 수 표시 (참여중인 챌린지 리스트 페이지에서만 표시, 개인 챌린지 제외) -->
        <span
          v-if="isParticipating && typeUpper !== 'PERSONAL'"
          class="stat stat-participants"
          >{{ getStatText() }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  challenge: { type: Object, required: true, default: () => ({}) },
  isRecruitingPage: { type: Boolean, default: false },
});

const typeUpper = computed(() =>
  (props.challenge?.type || 'GROUP').toUpperCase()
);
const isCommon = computed(() => typeUpper.value === 'COMMON'); // ✅ 공통 여부
const statusUpper = computed(() =>
  (props.challenge?.status || 'RECRUITING').toUpperCase()
);
const isParticipating = computed(
  () =>
    props.challenge?.isParticipating ?? props.challenge?.participating ?? false
);

const progressNum = computed(() => {
  const v =
    props.challenge?.myProgressRate ?? props.challenge?.myProgress ?? null;
  return typeof v === 'number' ? v : null;
});
const isCreatorFlag = computed(
  () =>
    props.challenge?.isMine === true ||
    props.challenge?.isCreator === true ||
    props.challenge?.creator === true
);

// 성공/실패 상태 확인
const isSuccess = computed(() => props.challenge?.isSuccess ?? null);

// 결과 확인 여부
const isResultCheck = computed(() => props.challenge?.isResultCheck ?? false);

const maxParticipants = computed(() => props.challenge?.maxParticipants ?? 6);
const curParticipants = computed(
  () =>
    props.challenge?.participantsCount ?? props.challenge?.participantCount ?? 0
);

const needsResultConfirm = computed(
  () =>
    isParticipating.value &&
    statusUpper.value === 'COMPLETED' &&
    (props.challenge?.isResultCheck === false ||
      props.challenge?.resultChecked === false)
);

const progressRecruiting = computed(() => {
  // 공통은 정원 개념이 없어도 v-if로 막대 자체를 숨기므로 값은 상관없음
  const max = Number(maxParticipants.value) || 1;
  const cur = Number(curParticipants.value) || 0;
  const pct = (cur / max) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}.${String(d.getDate()).padStart(2, '0')}`;
};

const getChallengeTypeName = (t) =>
  ({ COMMON: '공통', PERSONAL: '개인', GROUP: '그룹' }[t] || '챌린지');
const getStatusName = (s) =>
  ({
    RECRUITING: '모집중',
    CLOSED: '모집마감',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
  }[s] || '상태');
const getStatusClass = (s) => {
  switch (s) {
    case 'RECRUITING':
      return 'badge-recruiting';
    case 'CLOSED':
      return 'badge-closed';
    case 'IN_PROGRESS':
      return 'badge-inprogress';

    default:
      return 'badge-default';
  }
};

const getRemainingDays = () => {
  const end = props.challenge?.endDate
    ? new Date(props.challenge.endDate)
    : null;
  if (!end || Number.isNaN(end.getTime())) return 0;
  const today = new Date();
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

const getRecruitingRemainingDays = () => {
  const start = props.challenge?.startDate
    ? new Date(props.challenge.startDate)
    : null;
  if (!start || Number.isNaN(start.getTime())) return 0;
  const today = new Date();
  const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};
const getStatText = () => `${curParticipants.value} / 6`;

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

// 공통 챌린지 오버레이 관련 computed
const shouldShowOverlay = computed(() => {
  if (!isCommon.value) return false;

  if (props.isRecruitingPage) {
    // 모집중인 챌린지 리스트 페이지: 모집 기간이 아닌 경우
    return getRecruitingRemainingDays() <= 0;
  } else {
    // 참여중인 챌린지 리스트 페이지: 참여하지 않은 경우
    return !isParticipating.value;
  }
});

const overlayMessage = computed(() => {
  if (!isCommon.value) return '';

  if (props.isRecruitingPage) {
    // 모집 기간이 아닌 경우
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    const nextDate = `${nextMonth.getFullYear()}.${String(
      nextMonth.getMonth() + 1
    ).padStart(2, '0')}.${String(nextMonth.getDate()).padStart(2, '0')}`;
    return `이번 모집은 종료되었습니다.\n다음 공통 챌린지는 ${nextDate} 00:00에 신청 가능합니다!`;
  } else {
    // 참여하지 않은 경우
    return '현재 공통 챌린지에 참여하고 있지 않습니다.';
  }
});

const emit = defineEmits(['cardClick']);
const handleCardClick = () =>
  emit('cardClick', {
    challenge: props.challenge,
    type: typeUpper.value.toLowerCase(),
  });
</script>

<style scoped>
.challenge-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: not-allowed;
}

.overlay-message {
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
  white-space: pre-line;
  padding: 0 16px;
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
  gap: 8px;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.creator-icon {
  color: #ffd700;
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  animation: crown-glow 2s ease-in-out infinite alternate;
}

@keyframes crown-glow {
  from {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2)) brightness(1);
  }
  to {
    filter: drop-shadow(0 1px 4px rgba(255, 215, 0, 0.4)) brightness(1.1);
  }
}

.challenge-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
}
.status-area {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
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
.badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 10px;
  white-space: nowrap;
}
.badge-default {
  background: #eee;
  color: #666;
}
.badge-recruiting {
  background: #e6f3ff;
  color: #1976d2;
}
.badge-closed {
  background: #f5f5f5;
  color: #888;
}
.badge-inprogress {
  background: #e8f5e9;
  color: #2e7d32;
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
  background: #e0e0e0;
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

.common-participants-container {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 5;
}

.common-participants {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid rgba(107, 70, 193, 0.2);
}
.max-participants {
  color: #999;
}
.participants-info .progress-bar {
  width: 100%;
  flex: none;
}
.challenge-stats {
  display: flex;
  gap: 6px;
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
.stat {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.stat-deadline {
  color: #d32f2f;
  background: #ffebee;
  border: 1px solid #ffcdd2;
}

.stat-category {
  color: #1976d2;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
}

.stat-participants {
  color: #388e3c;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.visibility-icon {
  color: #f57c00;
  font-size: 14px;
  margin-left: 4px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: all 0.2s ease;
}

.visibility-icon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(245, 124, 0, 0.3));
}
</style>
