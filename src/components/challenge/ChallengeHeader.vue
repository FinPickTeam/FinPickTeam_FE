<template>
  <header class="challenge-header">
    <div class="header-left">
      <button class="icon-btn" @click="goBack">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h1 v-if="title" class="header-title">{{ title }}</h1>
    </div>

    <div class="header-icons">
      <button class="icon-btn" @click="handleCreateClick">
        <i class="fas fa-pen-to-square"></i>
      </button>
      <button class="icon-btn" @click="goToRanking">
        <i class="fas fa-landmark"></i>
      </button>
    </div>

    <!-- 챌린지 참여 제한 모달 -->
    <ChallengeParticipationLimitModal
      :is-visible="showParticipationLimitModal"
      :personal-count="personalChallengeCount"
      :group-count="groupChallengeCount"
      @close="closeParticipationLimitModal"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeParticipationLimitModal from './ChallengeParticipationLimitModal.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  participatingChallenges: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();
const showParticipationLimitModal = ref(false);

// 개인 챌린지와 소그룹 챌린지 개수 계산
const personalChallengeCount = computed(() => {
  return props.participatingChallenges.filter(
    (challenge) => challenge.type === 'PERSONAL'
  ).length;
});

const groupChallengeCount = computed(() => {
  return props.participatingChallenges.filter(
    (challenge) => challenge.type === 'GROUP'
  ).length;
});

// 챌린지 생성 가능 여부 확인
const canCreateChallenge = computed(() => {
  return personalChallengeCount.value < 3 && groupChallengeCount.value < 3;
});

const goBack = () => {
  // 현재 라우트에 따라 다른 동작 수행
  const currentRoute = router.currentRoute.value.name;

  if (
    currentRoute === 'ChallengeCreate' ||
    currentRoute === 'ChallengeRanking'
  ) {
    // 챌린지 생성 페이지나 랭킹 페이지에서는 ChallengeHome으로 이동
    router.push('/challenge');
  } else if (currentRoute === 'ChallengeHome') {
    // 챌린지 홈 페이지에서는 메인 홈페이지로 이동
    router.push('/');
  } else if (
    currentRoute === 'ChallengePersonalDetail' ||
    currentRoute === 'ChallengeGroupDetail' ||
    currentRoute === 'ChallengeCommonDetail'
  ) {
    // 챌린지 상세 페이지에서는 이전 페이지로 이동
    // 라우터 state에서 이전 페이지 정보를 확인
    const previousPage = router.currentRoute.value.state?.previousPage;

    if (previousPage) {
      // 이전 페이지 정보가 있으면 해당 페이지로 이동
      router.push(previousPage);
    } else {
      // 이전 페이지 정보가 없으면 브라우저 히스토리 사용
      router.back();
    }
  } else {
    // 다른 페이지에서는 이전 페이지로 이동
    router.back();
  }
};

const handleCreateClick = () => {
  if (canCreateChallenge.value) {
    // 챌린지 생성 가능한 경우
    router.push('/challenge/create');
  } else {
    // 챌린지 생성 불가능한 경우 모달 표시
    showParticipationLimitModal.value = true;
  }
};

const closeParticipationLimitModal = () => {
  showParticipationLimitModal.value = false;
};

const goToRanking = () => router.push('/challenge/ranking');
</script>

<style scoped>
.challenge-header {
  width: 100%;
  max-width: 390px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 6px;
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: bold;
  font-family: var(--font-main);
  margin: 0;
}

.header-icons {
  display: flex;
  gap: 12px;
}
</style>
