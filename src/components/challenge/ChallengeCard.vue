<template>
  <div class="challenge-card" @click="handleCardClick">
    <div class="card-header">
      <h3 class="challenge-title">{{ challenge.title || '제목 없음' }}</h3>

      <div class="status-area">
        <span v-if="isCreatorFlag" class="badge badge-owner" title="내가 생성한 챌린지">내가 만든</span>
        <span v-if="needsResultConfirm" class="badge badge-danger" title="결과 확인 페이지에서 보상 확정이 필요합니다">결과 확인 필요</span>
        <span class="badge" :class="getStatusClass(statusUpper)">{{ getStatusName(statusUpper) }}</span>
        <div class="challenge-type">{{ getChallengeTypeName(typeUpper) }}</div>
      </div>
    </div>

    <div class="card-content">
      <div class="challenge-date">
        {{ formatDate(challenge.startDate) }} ~ {{ formatDate(challenge.endDate) }}
      </div>

      <div class="progress-info" v-if="isParticipating && progressNum !== null">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: Math.round(progressNum * 100) + '%' }"></div>
        </div>
        <span class="progress-text">{{ Math.round(progressNum * 100) }}% 완료</span>
      </div>

      <div class="progress-info" v-else-if="isParticipating">
        <div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>
        <span class="progress-text">0% 완료</span>
      </div>

      <div class="participants-info" v-if="!isParticipating && isRecruitingPage">
        <div class="participants-text">
          <span>{{ curParticipants }}명 참여중</span>
          <span class="max-participants">/ {{ maxParticipants }}명</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressRecruiting}%` }"></div>
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
import { computed } from 'vue';

const props = defineProps({
  challenge: { type: Object, required: true, default: () => ({}) },
  isRecruitingPage: { type: Boolean, default: false },
});

const typeUpper = computed(() => (props.challenge?.type || 'GROUP').toUpperCase());
const statusUpper = computed(() => (props.challenge?.status || 'RECRUITING').toUpperCase());
const isParticipating = computed(() => props.challenge?.isParticipating ?? props.challenge?.participating ?? false);
const progressNum = computed(() => {
  const v = props.challenge?.myProgressRate ?? props.challenge?.myProgress ?? null;
  return (typeof v === 'number') ? v : null;
});
const isCreatorFlag = computed(() =>
    (props.challenge?.isMine === true) ||
    (props.challenge?.isCreator === true) ||
    (props.challenge?.creator === true)
);

const maxParticipants = computed(() => props.challenge?.maxParticipants ?? 6);
const curParticipants = computed(() => props.challenge?.participantsCount ?? props.challenge?.participantCount ?? 0);

const needsResultConfirm = computed(() =>
    isParticipating.value &&
    statusUpper.value === 'COMPLETED' &&
    (props.challenge?.isResultCheck === false || props.challenge?.resultChecked === false)
);

const progressRecruiting = computed(() => {
  const max = Number(maxParticipants.value) || 1;
  const cur = Number(curParticipants.value) || 0;
  const pct = (cur / max) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
};

const getChallengeTypeName = (t) => ({ COMMON:'공통', PERSONAL:'개인', GROUP:'그룹' }[t] || '챌린지');
const getStatusName = (s) => ({ RECRUITING:'모집중', CLOSED:'모집마감', IN_PROGRESS:'진행중', COMPLETED:'완료' }[s] || '상태');
const getStatusClass = (s) => {
  switch (s) {
    case 'RECRUITING': return 'badge-recruiting';
    case 'CLOSED': return 'badge-closed';
    case 'IN_PROGRESS': return 'badge-inprogress';
    case 'COMPLETED': return 'badge-completed';
    default: return 'badge-default';
  }
};

const getRemainingDays = () => {
  const end = props.challenge?.endDate ? new Date(props.challenge.endDate) : null;
  if (!end || Number.isNaN(end.getTime())) return 0;
  const today = new Date();
  const diff = Math.ceil((end - today) / (1000*60*60*24));
  return Math.max(0, diff);
};
const getStatText = () => (isParticipating.value ? '참여중' : `${curParticipants.value}명 참여`);

const emit = defineEmits(['cardClick']);
const handleCardClick = () => emit('cardClick', { challenge: props.challenge, type: typeUpper.value.toLowerCase() });
</script>

<style scoped>
.challenge-card{background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.1);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}
.challenge-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.15)}
.card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:8px}
.challenge-title{font-size:16px;font-weight:700;color:#333;margin:0;flex:1}
.status-area{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.challenge-type{font-size:12px;color:#666;background:rgba(102,102,102,.1);padding:4px 8px;border-radius:12px;white-space:nowrap;font-weight:500}
.badge{font-size:11px;padding:4px 8px;border-radius:10px;white-space:nowrap}
.badge-default{background:#eee;color:#666}
.badge-recruiting{background:#e6f3ff;color:#1976d2}
.badge-closed{background:#f5f5f5;color:#888}
.badge-inprogress{background:#e8f5e9;color:#2e7d32}
.badge-completed{background:#f3e5f5;color:#6a1b9a}
.badge-danger{background:#ffe5e5;color:#d32f2f;font-weight:700}
.badge-owner{background:#e8f0fe;color:#1a73e8;font-weight:700}
.card-content{display:flex;flex-direction:column;gap:12px}
.challenge-date{font-size:14px;color:#666;margin:0;line-height:1.4}
.progress-info{display:flex;align-items:center;gap:12px}
.progress-bar{flex:1;height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(to right,var(--color-main),var(--color-main-light));border-radius:4px;transition:width .3s ease}
.progress-text{font-size:12px;color:#666;min-width:60px}
.participants-info{display:flex;flex-direction:column;gap:8px}
.participants-text{display:flex;align-items:center;gap:4px;font-size:12px;color:#666}
.max-participants{color:#999}
.participants-info .progress-bar{width:100%;flex:none}
.challenge-stats{display:flex;gap:16px}
.stat{font-size:12px;color:#999;background:#f5f5f5;padding:4px 8px;border-radius:8px}
</style>
