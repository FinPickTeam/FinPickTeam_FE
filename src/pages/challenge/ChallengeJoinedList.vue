<template>
  <div class="challenge-joined-list">
    <div class="content">
      <!-- 공통 챌린지 섹션 -->
      <ChallengeSection
        title="공통 챌린지"
        :challenges="commonChallenges"
        type="common"
        icon-class="fas fa-users"
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
      />

      <!-- 성공 테스트 버튼 -->
      <div class="success-test-section">
        <button class="success-test-btn" @click="showSuccessModal">
          챌린지 성공 테스트
        </button>
      </div>
    </div>

    <!-- 챌린지 성공 모달 -->
    <ChallengeSuccessModal
      :is-visible="isSuccessModalVisible"
      :challenge="successChallengeData"
      @close="hideSuccessModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';
import ChallengeSuccessModal from '@/components/challenge/ChallengeSuccessModal.vue';

// 공통 챌린지 데이터
const commonChallenges = ref([
  {
    id: 1,
    title: '매일 저축하기',
    description: '매일 1만원씩 저축하여 30일 동안 30만원 모으기',
    progress: 100,
    remainingDays: 10,
    participants: 1250,
  },
]);

// 개인 챌린지 데이터
const personalChallenges = ref([
  {
    id: 2,
    title: '카페 음료 줄이기',
    description: '한 달 동안 카페 음료 구매를 줄이고 저축하기',
    progress: 80,
    remainingDays: 5,
    target: 50000,
  },
  {
    id: 3,
    title: '교통비 절약하기',
    description: '대중교통을 이용하여 교통비 절약하기',
    progress: 45,
    remainingDays: 15,
    target: 30000,
  },
]);

// 소그룹 챌린지 데이터
const groupChallenges = ref([
  {
    id: 4,
    title: '친구들과 저축 챌린지',
    description: '친구들과 함께 매주 5만원씩 저축하기',
    progress: 70,
    remainingDays: 8,
    participants: 4,
    maxParticipants: 6,
  },
  {
    id: 5,
    title: '가족 저축 챌린지',
    description: '가족과 함께 목표 금액 모으기',
    progress: 55,
    remainingDays: 12,
    participants: 3,
    maxParticipants: 5,
  },
]);

const router = useRouter();

// 성공 모달 관련 상태
const isSuccessModalVisible = ref(false);
const successChallengeData = ref({
  title: '매일 5천원 저축하기',
  description: '매일 5천원씩 저축하여 30일 동안 15만원 모으기',
  targetAmount: 150000,
  currentAmount: 150000,
  duration: 30,
  reward: {
    points: 500,
    badge: '저축 마스터',
  },
});

// 성공 모달 표시
const showSuccessModal = () => {
  isSuccessModalVisible.value = true;
};

// 성공 모달 숨기기
const hideSuccessModal = () => {
  isSuccessModalVisible.value = false;
};

const handleCardClick = (data) => {
  const { challenge, type } = data;

  if (type === 'personal') {
    // 개인 챌린지 상세 페이지로 이동
    router.push({
      name: 'ChallengePersonalDetail',
      params: { id: challenge.id },
      state: { challenge },
    });
  } else if (type === 'group') {
    // 그룹 챌린지 상세 페이지로 이동
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: { challenge },
    });
  } else if (type === 'common') {
    // 공통 챌린지 상세 페이지로 이동
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: { challenge },
    });
  }
};
</script>

<style scoped>
.challenge-joined-list {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  padding-top: 20px;
  padding-bottom: 20px;
}

/* 성공 테스트 버튼 */
.success-test-section {
  margin-top: 20px;
  text-align: center;
  padding: 0 16px;
}

.success-test-btn {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.success-test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}
</style>
