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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';

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

const handleCardClick = (data) => {
  const { challenge, type } = data;

  if (type === 'personal') {
    // 개인 챌린지 상세 페이지로 이동
    router.push({
      path: `/challenge/personal-detail/${challenge.id}`,
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
</style>
