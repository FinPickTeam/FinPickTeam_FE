<template>
  <div class="challenge-recruiting-list">
    <ChallengeHeader title="모집 중인 챌린지" />

    <div class="content">
      <!-- 공통 챌린지 섹션 -->
      <ChallengeSection
        title="공통 챌린지"
        :challenges="commonChallenges"
        type="common"
        icon-class="fas fa-users"
        @cardClick="handleCardClick"
      />

      <!-- 소그룹 챌린지 섹션 -->
      <ChallengeSection
        title="소그룹 챌린지"
        :challenges="groupChallenges"
        type="group"
        icon-class="fas fa-user-friends"
        @cardClick="handleCardClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeHeader from '@/components/challenge/ChallengeHeader.vue';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';

// 공통 챌린지 데이터 (모집 중)
const commonChallenges = ref([
  {
    id: 1,
    title: '매일 저축하기',
    description: '매일 1만원씩 저축하여 30일 동안 30만원 모으기',
    progress: 0, // 모집 중이므로 진행률 0
    remainingDays: 30,
    participants: 1250,
    maxParticipants: 2000,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
  },
]);

// 소그룹 챌린지 데이터 (모집 중)
const groupChallenges = ref([
  {
    id: 2,
    title: '친구들과 저축 챌린지',
    description: '친구들과 함께 매주 5만원씩 저축하기',
    progress: 0,
    remainingDays: 15,
    participants: 2,
    maxParticipants: 6,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    creator: '김철수',
  },
  {
    id: 3,
    title: '가족 저축 챌린지',
    description: '가족과 함께 목표 금액 모으기',
    progress: 0,
    remainingDays: 20,
    participants: 1,
    maxParticipants: 5,
    startDate: '2024-01-25',
    endDate: '2024-02-25',
    creator: '이영희',
  },
  {
    id: 4,
    title: '동네 친구들과 절약 챌린지',
    description: '동네 친구들과 함께 생활비 절약하기',
    progress: 0,
    remainingDays: 12,
    participants: 3,
    maxParticipants: 6,
    startDate: '2024-01-30',
    endDate: '2024-02-28',
    creator: '박민수',
  },
  {
    id: 5,
    title: '회사 동료들과 투자 챌린지',
    description: '회사 동료들과 함께 주식 투자 학습하기',
    progress: 0,
    remainingDays: 25,
    participants: 4,
    maxParticipants: 6,
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    creator: '최지영',
  },
]);

const router = useRouter();

const handleCardClick = (data) => {
  const { challenge, type } = data;

  if (type === 'common') {
    // 공통 챌린지 상세 페이지로 이동
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: { challenge },
    });
  } else if (type === 'group') {
    // 소그룹 챌린지 상세 페이지로 이동
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: { challenge },
    });
  }
};
</script>

<style scoped>
.challenge-recruiting-list {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
