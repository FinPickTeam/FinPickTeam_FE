<template>
  <div class="challenge-personal-detail">
    <!-- 결과 모달들 -->
    <ChallengeSuccessModal
      v-if="showSuccessModal && challengeResult"
      :isVisible="showSuccessModal"
      :challengeResult="challengeResult"
      @close="handleResultConfirm"
    />
    <ChallengeFailModal
      v-if="showFailModal && challengeResult"
      :isVisible="showFailModal"
      :challengeResult="challengeResult"
      @close="handleResultConfirm"
    />

    <!-- 로딩 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">챌린지 정보를 불러오는 중...</p>
    </div>

    <!-- 본문 -->
    <div v-else-if="challenge" class="content">
      <!-- 카테고리 뱃지 -->
      <div
        class="category-chip"
        :style="{
          background: categoryTheme.bg,
          boxShadow: '0 6px 16px ' + categoryTheme.shadow,
        }"
      >
        {{ displayCategory }}
      </div>

      <div class="challenge-info">
        <div class="title-section">
          <h1 class="challenge-title">{{ challenge.title }}</h1>
          <div class="challenge-date">
            {{ formatDate(challenge.startDate) }} ~
            {{ formatDate(challenge.endDate) }}
          </div>
        </div>

        <p class="challenge-description">{{ challenge.description }}</p>

        <div class="challenge-stats">
          <div class="stat-item">
            <span class="stat-label">목표 {{ challenge.goalType }}</span>
            <span class="stat-value"
              >{{ (challenge.goalValue || 0).toLocaleString() }}원</span
            >
          </div>
          <div class="stat-item">
            <span class="stat-label">남은 기간</span>
            <span class="stat-value">D-{{ getRemainingDays() }}</span>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">{{ challenge.goalType }} 진행률</span>
            <span class="progress-percentage"
              >{{ Math.round((challenge.myProgress || 0) * 100) }}%</span
            >
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: Math.round((challenge.myProgress || 0) * 100) + '%',
              }"
            ></div>
          </div>
        </div>

        <div class="personal-info">
          <div class="savings-info">
            <span class="savings-label">현재 {{ challenge.goalType }}</span>
            <span class="savings-amount">
              {{
                Math.round(
                  (challenge.goalValue || 0) * (challenge.myProgress || 0)
                ).toLocaleString()
              }}원
            </span>
          </div>
          <div class="daily-goal">
            <span class="goal-label">목표 {{ challenge.goalType }}</span>
            <span class="goal-amount"
              >{{ (challenge.goalValue || 0).toLocaleString() }}원</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 에러 -->
    <div v-else class="error-container">
      <p class="error-text">챌린지 정보를 불러올 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  getChallengeDetail,
  getChallengeResult,
  confirmChallengeResult,
} from '@/api/challenge/challenge.js';
import ChallengeFailModal from '@/components/challenge/ChallengeFailModal.vue';
import ChallengeSuccessModal from '@/components/challenge/ChallengeSuccessModal.vue';

const route = useRoute();

const loading = ref(true);
const challenge = ref(null);

const showSuccessModal = ref(false);
const showFailModal = ref(false);
const challengeResult = ref(null); // ✅ 실제 API 응답 보관

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const data = await getChallengeDetail(id);
    challenge.value = data;

    // (1) 완료 + (2) 내가 참여중 + (3) 결과 미확인 → 진입 시 결과 모달 자동 표시
    if (
      data?.status === 'COMPLETED' &&
      data?.isParticipating &&
      !data?.isResultCheck
    ) {
      // 결과 데이터 가져오기
      const result = await getChallengeResult(id);
      console.log('=== ChallengePersonalDetail - API 응답 ===');
      console.log('getChallengeResult API 응답:', result);
      console.log('stockRecommendation:', result?.stockRecommendation);
      console.log('==========================================');
      challengeResult.value = result || null;

      // isSuccess 값에 따라 모달 표시
      if (data?.isSuccess === true) {
        showSuccessModal.value = true;
        showFailModal.value = false;
      } else if (data?.isSuccess === false) {
        showSuccessModal.value = false;
        showFailModal.value = true;
      } else {
        // isSuccess가 null인 경우 기존 로직 사용
        if (result?.resultType?.startsWith('SUCCESS')) {
          showSuccessModal.value = true;
        } else {
          showFailModal.value = true;
        }
      }
    } else {
      // 자동 노출 조건 아니면 모달 숨김
      showSuccessModal.value = false;
      showFailModal.value = false;
      challengeResult.value = null;
    }
  } catch (e) {
    console.error('챌린지 상세 조회 실패', e);
    challenge.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);

const handleResultConfirm = async () => {
  try {
    await confirmChallengeResult(route.params.id);
  } catch (e) {
    console.warn('결과 확인 실패(멱등 가능):', e?.message || e);
  } finally {
    showSuccessModal.value = false;
    showFailModal.value = false;
    challengeResult.value = null;
    await fetchDetail(); // 최신 상태 반영
  }
};

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getRemainingDays = () => {
  if (!challenge.value?.endDate) return 0;
  const end = new Date(challenge.value.endDate);
  const today = new Date();
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/* ---------- 카테고리 뱃지 ---------- */
const CATEGORY_FALLBACK_BY_ID = {
  1: '전체 소비 줄이기',
  2: '식비 줄이기',
  3: '카페·간식 줄이기',
  4: '교통비 줄이기',
  5: '미용·쇼핑 줄이기',
};

const categoryKey = computed(() => {
  const name =
    challenge.value?.categoryName ||
    CATEGORY_FALLBACK_BY_ID[challenge.value?.categoryId];
  if (!name) return 'default';
  if (name.includes('전체')) return 'total';
  if (name.includes('식비')) return 'food';
  if (name.includes('카페') || name.includes('간식')) return 'snack';
  if (name.includes('교통')) return 'transport';
  if (name.includes('미용') || name.includes('쇼핑')) return 'beauty';
  return 'default';
});

const displayCategory = computed(
  () =>
    challenge.value?.categoryName ||
    CATEGORY_FALLBACK_BY_ID[challenge.value?.categoryId] ||
    '카테고리'
);

const categoryTheme = computed(() => {
  const map = {
    total: {
      bg: 'linear-gradient(135deg,#6C5CE7,#8E7CFF)',
      shadow: 'rgba(108,92,231,.3)',
    },
    food: {
      bg: 'linear-gradient(135deg,#F0932B,#F5A623)',
      shadow: 'rgba(240,147,43,.3)',
    },
    snack: {
      bg: 'linear-gradient(135deg,#FF7675,#FF9AA2)',
      shadow: 'rgba(255,118,117,.3)',
    },
    transport: {
      bg: 'linear-gradient(135deg,#00B894,#55EFC4)',
      shadow: 'rgba(0,184,148,.3)',
    },
    beauty: {
      bg: 'linear-gradient(135deg,#0984E3,#74B9FF)',
      shadow: 'rgba(9,132,227,.3)',
    },
    default: {
      bg: 'linear-gradient(135deg,var(--color-main),var(--color-main-dark))',
      shadow: 'rgba(102,51,204,.28)',
    },
  };
  return map[categoryKey.value] || map.default;
});
</script>

<style scoped>
.challenge-personal-detail {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 카테고리 뱃지 */
.category-chip {
  align-self: flex-start;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.2px;
  padding: 8px 12px;
  border-radius: 9999px;
  margin-bottom: 12px;
}

/* 로딩 스타일 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #666;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 스타일 */
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px 16px;
}

.error-text {
  font-size: 16px;
  color: #666;
  text-align: center;
}

.content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); /* 헤더 높이를 제외한 전체 높이 */
}

.challenge-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.title-section {
  margin-bottom: 12px;
}

.challenge-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.challenge-description {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.challenge-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #666;
}

.progress-percentage {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.progress-bar {
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

.personal-info {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.savings-info,
.daily-goal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.savings-info:last-child,
.daily-goal:last-child {
  margin-bottom: 0;
}

.savings-label,
.goal-label {
  font-size: 14px;
  color: #666;
}

.savings-amount,
.goal-amount {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
</style>
