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
        @cardClick="handleCardClick"
      />

      <!-- 소그룹 챌린지 섹션 -->
      <ChallengeSection
        title="소그룹 챌린지"
        :challenges="groupChallenges"
        type="group"
        icon-class="fas fa-user-friends"
        :isRecruitingPage="true"
        @cardClick="handleCardClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';
import challengeListData from './challenge_list.json';

// 모집중인 챌린지 필터링 (participating: false)
const recruitingChallenges = computed(() => {
  return challengeListData.data.filter((challenge) => !challenge.participating);
});

// 공통 챌린지 필터링 (모집중이면서 COMMON 타입)
const commonChallenges = computed(() => {
  return recruitingChallenges.value.filter(
    (challenge) => challenge.type === 'COMMON'
  );
});

// 소그룹 챌린지 필터링 (모집중이면서 GROUP 타입)
const groupChallenges = computed(() => {
  return recruitingChallenges.value.filter(
    (challenge) => challenge.type === 'GROUP'
  );
});

const router = useRouter();

const handleCardClick = (data) => {
  const { challenge, type } = data;

  // 챌린지 타입에 따른 라우팅
  if (challenge.type === 'COMMON') {
    // 공통 챌린지 상세 페이지로 이동 (ID 기반)
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge/recruiting-list',
        challengeData: challenge,
      },
    });
  } else if (challenge.type === 'GROUP') {
    // 소그룹 챌린지 상세 페이지로 이동 (ID 기반)
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge/recruiting-list',
        challengeData: challenge,
      },
    });
  }
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
  padding-top: 20px;
  padding-bottom: 140px;
}
</style>
