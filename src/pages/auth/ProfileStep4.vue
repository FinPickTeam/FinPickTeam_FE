<template>
  <div class="profile-step-container">
    <!-- 상단 네비게이션 -->
    <ProfileStepHeader />
    <!-- 진행 바 -->
    <div class="progress-bar">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="['progress', { active: step === 4 }]"
      ></div>
    </div>
    <!-- 질문 -->
    <div class="question-section">
      <div class="question-title">
        [문항 4] 투자경험이 있는 금융투자상품과 투자경험 기간
      </div>
      <!-- <div class="question-desc">투자경험</div> -->
      <div class="options">
        <div
          v-for="(option, idx) in options"
          :key="idx"
          :class="['option', { selected: selected === idx }]"
          @click="selected = idx"
        >
          {{ option }}
        </div>
      </div>
    </div>
    <!-- 완료 버튼 -->
    <button class="next-btn" :disabled="selected === null" @click="goNext">
      완료
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProfileStepHeader from '@/components/auth/ProfileStepHeader.vue';

const router = useRouter();
const route = useRoute();

const options = [
  '국채, 지방채, 보증채, MMF 등 [초저위험]',
  '금융채, 신용도가 높은 회사채, 채권형펀드, 원금지급형 ELS 등 [저위험]',
  '신용도 중간 등급의 회사채, 원금의 일부만 보장되는 ELS, 혼합형 펀드 등 [중위험]',
  '신용도가 낮은 회사채, 주식, 원금이 보장되지 않는 ELS, 시장수익률 수준의 수익을 추구하는 주식형펀드 등 [고위험]',
  'ELW, 선물옵션, 시장수익률 이상의 수익을 추구하는 주식형펀드, 파생상품펀드, 주식 신용거래등 [초고위험]',
];
const selected = ref(null);

// 동적 progress-bar 설정
const totalSteps = ref(4); // 기본값

// 라우터 쿼리에서 from 파라미터 확인하여 단계 수 결정
if (route.query.from === 'mypage') {
  totalSteps.value = 10; // 투자성향 재검사는 9단계
} else {
  totalSteps.value = 5; // 회원가입은 4단계
}

const goNext = () => {
  if (selected.value !== null) {
    const from = route.query.from || 'signup';
    if (from === 'mypage') {
      router.push(`/mypage/financetest/profile-step-5?from=mypage`);
    } else {
      router.push('/profile-step-5');
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
