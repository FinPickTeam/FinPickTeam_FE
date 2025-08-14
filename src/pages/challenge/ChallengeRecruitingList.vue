<template>
  <div class="challenge-recruiting-list">
    <div class="content">
      <!-- 공통 챌린지 섹션 (공지 박스는 섹션 내부에 표시) -->
      <ChallengeSection
        title="공통 챌린지"
        :challenges="commonChallenges"
        type="common"
        icon-class="fas fa-users"
        :isRecruitingPage="true"
        :notice="!isFirstDay ? noticeText : ''"
        :emptyMessage="
          isFirstDay
            ? '현재 모집 중인 공통 챌린지가 없습니다.'
            : '이번 모집은 종료되었습니다.'
        "
        @cardClick="handleCardClick"
      />

      <!-- 소그룹 챌린지 섹션 (필터 토글을 섹션 제목 우측에 배치) -->
      <ChallengeSection
        title="소그룹 챌린지"
        :challenges="groupChallenges"
        type="group"
        icon-class="fas fa-user-friends"
        :isRecruitingPage="true"
        :emptyMessage="'현재 모집 중인 소그룹 챌린지가 없습니다.'"
        @cardClick="handleCardClick"
      >
        <template #right>
          <label class="toggle-chip">
            <input type="checkbox" v-model="includeParticipating" />
            <span class="chip-label">내가 참여중인 챌린지도 보기</span>
          </label>
        </template>
      </ChallengeSection>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';
import { getChallengeList } from '@/api/challenge/challenge.js';

const router = useRouter();

const loading = ref(false);
const error = ref('');
const allRecruiting = ref([]);
const includeParticipating = ref(false);

// 월 1일 체크
const isFirstDay = computed(() => new Date().getDate() === 1);

// 다음달 1일 포맷
const nextRecruitDate = computed(() => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
});

// 공지 문구
const noticeText = computed(
  () =>
    `이번 모집은 종료되었어요. 다음 공통 챌린지는 ${nextRecruitDate.value} 00:00에 신청 가능!`
);

// 데이터 로드
onMounted(async () => {
  loading.value = true;
  try {
    const list = await getChallengeList({ status: 'RECRUITING' });
    allRecruiting.value = Array.isArray(list) ? list : [];
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || '목록 조회 실패';
    allRecruiting.value = [];
  } finally {
    loading.value = false;
  }
});

// 필터링 (기본: 참여중 제외)
const recruitingBase = computed(() => {
  if (includeParticipating.value) return allRecruiting.value;
  return allRecruiting.value.filter(
    (c) => !c?.isParticipating && !c?.participating
  );
});

// 타입 분리
const commonChallenges = computed(() =>
  recruitingBase.value.filter((c) => (c?.type || '').toUpperCase() === 'COMMON')
);
const groupChallenges = computed(() =>
  recruitingBase.value.filter((c) => (c?.type || '').toUpperCase() === 'GROUP')
);

// 카드 클릭
const goDetail = (challenge) => {
  if (challenge.type === 'COMMON')
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge/recruiting-list' },
    });
  else if (challenge.type === 'GROUP')
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge/recruiting-list' },
    });
  else if (challenge.type === 'PERSONAL')
    router.push({
      name: 'ChallengePersonalDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge/recruiting-list' },
    });
};

const handleCardClick = (payload) => {
  const challenge = payload.challenge || payload;
  goDetail(challenge);
};
</script>

<style scoped>
.challenge-recruiting-list {
  padding: 0;
  background: var(--color-bg-light);
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 12px;
  padding-bottom: 140px;
}

/* 섹션 헤더 우측 토글을 칩 형태로 */
.toggle-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.toggle-chip input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.chip-label {
  font-size: 12px;
  color: #555;
  background: #f3f4f6; /* 밝은 회색 */
  border: 1px solid #e5e7eb; /* 경계선 */
  padding: 6px 10px;
  border-radius: 9999px;
}
</style>
