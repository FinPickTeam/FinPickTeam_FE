<template>
  <div class="challenge-joined-list">
    <!-- 성공 모달 -->
    <ChallengeSuccessModal
      :isVisible="showSuccessModal"
      :challenge="testChallenge"
      @close="showSuccessModal = false"
    />

    <!-- 실패 모달 -->
    <ChallengeFailModal
      :isVisible="showFailModal"
      :challengeTitle="testChallengeTitle"
      :progressRate="testProgressRate"
      :goalValue="testGoalValue"
      @close="showFailModal = false"
      @retry="handleRetry"
    />
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

      <!-- 테스트용 모달 버튼들 -->
      <div class="test-buttons">
        <button class="test-success-btn" @click="showSuccessModalExample">
          성공 모달 테스트
        </button>
        <button class="test-fail-btn" @click="showFailModalExample">
          실패 모달 테스트
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';
import ChallengeSuccessModal from '@/components/challenge/ChallengeSuccessModal.vue';
import ChallengeFailModal from '@/components/challenge/ChallengeFailModal.vue';
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

// 모달 상태 관리
const showSuccessModal = ref(false);
const showFailModal = ref(false);

// 테스트용 데이터
const testChallenge = ref({
  title: '커피값 줄이기 챌린지',
  description: '매일 커피값을 절약하여 한 달 동안 5만원 모으기',
  targetAmount: 50000,
  currentAmount: 50000,
  duration: 30,
  reward: {
    points: 1000,
    badge: '절약 마스터',
  },
});
const testGoalValue = ref(100000);

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

// 모달 핸들러 함수들

const handleRetry = () => {
  console.log('챌린지 재도전');
  showFailModal.value = false;
  // 여기에 재도전 로직 추가
};

// 테스트용 모달 표시 함수들
const showSuccessModalExample = () => {
  showSuccessModal.value = true;
};

const showFailModalExample = () => {
  showFailModal.value = true;
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

.test-buttons {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-success-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.test-success-btn:hover {
  transform: translateY(-2px);
}

.test-fail-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.test-fail-btn:hover {
  transform: translateY(-2px);
}
</style>
