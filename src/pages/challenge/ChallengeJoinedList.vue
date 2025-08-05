<template>
  <div class="challenge-joined-list">
    <ChallengeHeader title="참여 중인 챌린지" />

    <div class="content">
      <!-- 공통 챌린지 섹션 -->
      <section class="challenge-section">
        <h2 class="section-title">
          <i class="fas fa-users"></i>
          공통 챌린지
        </h2>
        <div class="challenge-cards">
          <div
            v-for="challenge in commonChallenges"
            :key="challenge.id"
            class="challenge-card"
          >
            <div class="card-header">
              <h3 class="challenge-title">{{ challenge.title }}</h3>
            </div>
            <div class="card-content">
              <p class="challenge-description">{{ challenge.description }}</p>
              <div class="progress-info">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: challenge.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text"
                  >{{ challenge.progress }}% 완료</span
                >
              </div>
              <div class="challenge-stats">
                <span class="stat">D-{{ challenge.remainingDays }}</span>
                <span class="stat">{{ challenge.participants }}명 참여</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 개인 챌린지 섹션 -->
      <section class="challenge-section">
        <h2 class="section-title">
          <i class="fas fa-user"></i>
          개인 챌린지
          <span class="count">({{ personalChallenges.length }}/3)</span>
        </h2>
        <div class="challenge-cards">
          <div
            v-for="challenge in personalChallenges"
            :key="challenge.id"
            class="challenge-card"
          >
            <div class="card-header">
              <h3 class="challenge-title">{{ challenge.title }}</h3>
            </div>
            <div class="card-content">
              <p class="challenge-description">{{ challenge.description }}</p>
              <div class="progress-info">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: challenge.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text"
                  >{{ challenge.progress }}% 완료</span
                >
              </div>
              <div class="challenge-stats">
                <span class="stat">D-{{ challenge.remainingDays }}</span>
                <span class="stat">{{ challenge.target }}원 목표</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 소그룹 챌린지 섹션 -->
      <section class="challenge-section">
        <h2 class="section-title">
          <i class="fas fa-user-friends"></i>
          소그룹 챌린지
          <span class="count">({{ groupChallenges.length }}/3)</span>
        </h2>
        <div class="challenge-cards">
          <div
            v-for="challenge in groupChallenges"
            :key="challenge.id"
            class="challenge-card"
          >
            <div class="card-header">
              <h3 class="challenge-title">{{ challenge.title }}</h3>
            </div>
            <div class="card-content">
              <p class="challenge-description">{{ challenge.description }}</p>
              <div class="progress-info">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: challenge.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text"
                  >{{ challenge.progress }}% 완료</span
                >
              </div>
              <div class="challenge-stats">
                <span class="stat">D-{{ challenge.remainingDays }}</span>
                <span class="stat"
                  >{{ challenge.participants }}/{{
                    challenge.maxParticipants
                  }}명</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChallengeHeader from '@/components/challenge/ChallengeHeader.vue';

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

.challenge-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 16px 16px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  font-size: 16px;
  color: #666;
}

.count {
  font-size: 14px;
  color: #666;
  font-weight: normal;
  margin-left: 8px;
}

.challenge-cards {
  padding: 0 16px;
}

.challenge-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

.challenge-stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 8px;
}
</style>
