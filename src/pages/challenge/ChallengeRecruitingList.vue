<template>
  <div class="challenge-recruiting-list">
    <div class="content">
      <!-- 공통 챌린지 섹션 -->
      <ChallengeSection
        title="공통 챌린지"
        :challenges="commonChallenges"
        type="common"
        icon-class="fas fa-users"
        :isRecruitingPage="true"
        emptyMessage="현재 모집 중인 공통 챌린지가 없습니다."
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

// 데이터 로드
onMounted(async () => {
  loading.value = true;
  try {
    // 모집중인 챌린지와 공통 챌린지를 모두 가져오기
    const [recruitingList, commonList] = await Promise.all([
      getChallengeList({ status: 'RECRUITING' }),
      getChallengeList({ type: 'COMMON' }),
    ]);

    // 모집중인 챌린지
    const recruiting = Array.isArray(recruitingList) ? recruitingList : [];

    // 공통 챌린지 (모집 상태와 관계없이)
    const common = Array.isArray(commonList) ? commonList : [];

    // 중복 제거 (ID 기준)
    const allChallenges = [...recruiting];
    common.forEach((commonChallenge) => {
      if (!allChallenges.find((c) => c.id === commonChallenge.id)) {
        allChallenges.push(commonChallenge);
      }
    });

    allRecruiting.value = allChallenges;
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || '목록 조회 실패';
    allRecruiting.value = [];
  } finally {
    loading.value = false;
  }
});

// 타입 분리
const commonChallenges = computed(() =>
  allRecruiting.value.filter((c) => (c?.type || '').toUpperCase() === 'COMMON')
);
const groupChallenges = computed(() =>
  allRecruiting.value.filter((c) => (c?.type || '').toUpperCase() === 'GROUP')
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
</style>
