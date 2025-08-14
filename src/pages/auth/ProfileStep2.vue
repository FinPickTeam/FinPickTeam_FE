<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <ProfileStepHeader />
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="['progress', { active: step === 2 }]"
      ></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">[문항 2] 투자 목적</div>
      <div class="options">
        <div
            v-for="(option, idx) in options"
            :key="idx"
            :class="['option', { selected: profileStore.answers.question2 === option }]"
            @click="profileStore.answers.question2 = option"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <button class="next-btn" :disabled="profileStore.answers.question2 === null" @click="goNext">
      다음
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// Pinia Store를 가져옵니다.
import { useProfileStore } from '@/stores/profile.js';
import ProfileStepHeader from '@/components/auth/ProfileStepHeader.vue';

const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();

const options = [
  '자산중식',
  '주택마련',
  '생활비',
  '교육비',
  '채무상환',
  '결혼자금',
];

// 로컬 상태 'selected'는 이제 사용하지 않습니다.

const totalSteps = computed(() => {
  const from = route.query.from;
  if (from === 'mypage' || from === 'fund') {
    return 10;
  } else {
    return 5;
  }
});

const goNext = () => {
  // 로컬 상태 대신 Pinia에 저장된 2번 문항 답변을 확인합니다.
  if (profileStore.answers.question2 !== null) {
    const from = route.query.from || 'signup';
    if (from === 'mypage') {
      router.push(`/mypage/financetest/profile-step-3?from=${from}`);
    } else if (from === 'fund') {
      // 펀드 시나리오의 다음 경로는 6단계가 맞는지 확인이 필요합니다.
      router.push(`/mypage/financetest/profile-step-6?from=${from}`);
    } else {
      router.push('/profile-step-3');
    }
  }
};
</script>

<style scoped>
.profile-step-container {
  min-height: 100vh;
  background: #fff;
  padding: 0 20px 32px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.progress-bar {
  display: flex;
  gap: 8px;
  margin: 0 0 32px 0;
  padding: 0 8px;
}
.progress {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background 0.2s;
}
.progress.active {
  background: #6c4cf1;
}
.question-section {
  margin-top: 24px;
  margin-bottom: 40px;
}
.question-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 14px;
  color: #222;
}
.question-desc {
  font-size: 18px;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
}
.question-subtitle {
  font-size: 16px;
  color: #222;
  margin-bottom: 24px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.option {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: left;
  font-size: 16px;
  color: #222;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.option.selected {
  border-color: #8e74e3;
  background: #f3f0fa;
  color: #6c4cf1;
  font-weight: 600;
}
.next-btn {
  width: 100%;
  background: #8e74e3;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: bold;
  margin-top: 48px;
  cursor: pointer;
  transition: background 0.2s;
}
.next-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
.next-btn:hover {
  background: #6c4cf1;
}
@media (max-width: 480px) {
  .profile-step-container {
    padding: 0 8px 16px 8px;
  }
  .next-btn {
    margin-top: 32px;
  }
}
</style>
