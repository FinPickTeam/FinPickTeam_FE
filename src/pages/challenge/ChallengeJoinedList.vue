<template>
  <div class="challenge-joined-list">
    <div class="content">
      <!-- 공통 챌린지 섹션 -->
      <ChallengeSection
        title="공통 챌린지"
        :challenges="commonChallenges"
        type="common"
        icon-class="fas fa-users"
        @cardClick="handleCardClick"
      />

      <!-- 개인 챌린지 섹션 -->
      <ChallengeSection
        title="개인 챌린지"
        :challenges="personalChallenges"
        type="personal"
        icon-class="fas fa-user"
        :max-count="3"
        :show-count="true"
        @cardClick="handleCardClick"
      />

      <!-- 소그룹 챌린지 섹션 -->
      <ChallengeSection
        title="소그룹 챌린지"
        :challenges="groupChallenges"
        type="group"
        icon-class="fas fa-user-friends"
        :max-count="3"
        :show-count="true"
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

// 참여중인 챌린지 필터링 (participating: true)
const joinedChallenges = computed(() => {
  return challengeListData.data.filter((challenge) => challenge.participating);
});

// 공통 챌린지 필터링 (참여중이면서 COMMON 타입)
const commonChallenges = computed(() => {
  return joinedChallenges.value.filter(
    (challenge) => challenge.type === 'COMMON'
  );
});

// 개인 챌린지 필터링 (참여중이면서 PERSONAL 타입)
const personalChallenges = computed(() => {
  return joinedChallenges.value.filter(
    (challenge) => challenge.type === 'PERSONAL'
  );
});

// 소그룹 챌린지 필터링 (참여중이면서 GROUP 타입)
const groupChallenges = computed(() => {
  return joinedChallenges.value.filter(
    (challenge) => challenge.type === 'GROUP'
  );
});

const router = useRouter();

const handleCardClick = (data) => {
  const { challenge, type } = data;

  // 챌린지 타입에 따른 라우팅
  if (challenge.type === 'PERSONAL') {
    // 개인 챌린지 상세 페이지로 이동 (ID 기반)
    router.push({
      name: 'ChallengePersonalDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge/joined-list',
        challengeData: challenge,
      },
    });
  } else if (challenge.type === 'GROUP') {
    // 그룹 챌린지 상세 페이지로 이동 (ID 기반)
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge/joined-list',
        challengeData: challenge,
      },
    });
  } else if (challenge.type === 'COMMON') {
    // 공통 챌린지 상세 페이지로 이동 (ID 기반)
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: {
        previousPage: '/challenge/joined-list',
        challengeData: challenge,
      },
    });
  }
};
</script>

<style scoped>
.challenge-joined-list {
  padding: 0;
  background: var(--color-bg-light);
  min-height: 100vh;
}

.content {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
