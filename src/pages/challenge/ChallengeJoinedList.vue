<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getChallengeList } from '@/api/challenge/challenge.js';
import ChallengeSection from '@/components/challenge/ChallengeSection.vue';
import ChallengeSuccessModal from '@/components/challenge/ChallengeSuccessModal.vue';
import ChallengeFailModal from '@/components/challenge/ChallengeFailModal.vue';

const router = useRouter();

const loading = ref(false);
const error = ref('');
const allJoined = ref([]);

// API 호출
onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const list = await getChallengeList({ participating: true }); // ✅ 상태 필터 제거
    // 백엔드 JSON 키 보정: isParticipating → participating
    const normalized = (list || []).map((c) => ({
      ...c,
      participating:
        typeof c.participating === 'boolean'
          ? c.participating
          : !!c.isParticipating,
      // participantsCount 기본값 케어
      participantsCount: c.participantsCount ?? 0,
    }));

    // (선택) 결과확인 필요 항목 우선 정렬: COMPLETED && participating && !isResultCheck
    normalized.sort((a, b) => {
      const needA =
        a.participating && a.status === 'COMPLETED' && !a.isResultCheck;
      const needB =
        b.participating && b.status === 'COMPLETED' && !b.isResultCheck;
      return Number(needB) - Number(needA);
    });

    allJoined.value = normalized;
  } catch (e) {
    console.error(e);
    error.value = '챌린지 목록을 불러오지 못했습니다.';
  } finally {
    loading.value = false;
  }
});

// 타입별 필터
const commonChallenges = computed(() =>
  allJoined.value.filter((c) => c.type === 'COMMON')
);
const personalChallenges = computed(() =>
  allJoined.value.filter((c) => c.type === 'PERSONAL')
);
const groupChallenges = computed(() =>
  allJoined.value.filter((c) => c.type === 'GROUP')
);

// 라우팅
const goDetail = (challenge) => {
  if (challenge.type === 'COMMON')
    router.push({
      name: 'ChallengeCommonDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge/joined-list' },
    });
  else if (challenge.type === 'GROUP')
    router.push({
      name: 'ChallengeGroupDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge/joined-list' },
    });
  else if (challenge.type === 'PERSONAL')
    router.push({
      name: 'ChallengePersonalDetail',
      params: { id: challenge.id },
      state: { previousPage: '/challenge/joined-list' },
    });
};

const handleCardClick = (payload) => {
  const challenge = payload.challenge || payload;
  goDetail(challenge);
};

// 테스트 모달 유지
const showSuccessModal = ref(false);
const showFailModal = ref(false);
const testChallenge = ref({
  title: '커피값 줄이기 챌린지',
  description: '매일 커피값을 절약하여 한 달 동안 5만원 모으기',
  targetAmount: 50000,
  currentAmount: 50000,
  duration: 30,
  reward: { points: 1000, badge: '절약 마스터' },
});
const testChallengeResult = ref({
  resultType: 'SUCCESS_WIN',
  actualRewardPoint: 110,
  savedAmount: 450000,
  stockRecommendation: {
    stockName: '삼성전자',
    stockCode: '005930',
    currentPrice: 75000,
    priceChange: 2500,
    priceChangeRate: 3.45,
    recommendationReason:
      'AI 반도체 시장 성장과 함께 삼성전자의 기술 경쟁력이 향상되고 있어 투자 가치가 높습니다.',
  },
});
const testFailChallengeResult = ref({
  resultType: 'FAIL',
  actualRewardPoint: 0,
  savedAmount: 30000,
  stockRecommendation: null,
});
const showSuccessModalExample = () => (showSuccessModal.value = true);
const showFailModalExample = () => (showFailModal.value = true);
</script>

<template>
  <div class="challenge-joined-list">
    <ChallengeSuccessModal
      :isVisible="showSuccessModal"
      :challenge="testChallenge"
      :challengeResult="testChallengeResult"
      @close="showSuccessModal = false"
    />
    <ChallengeFailModal
      :isVisible="showFailModal"
      :challengeResult="testFailChallengeResult"
      @close="showFailModal = false"
    />

    <div class="content">
      <div v-if="loading" class="state">불러오는 중...</div>
      <div v-else-if="error" class="state error">{{ error }}</div>
      <template v-else>
        <ChallengeSection
          title="공통 챌린지"
          :challenges="commonChallenges"
          type="common"
          icon-class="fas fa-users"
          empty-message="현재 공통 챌린지에 참여하고 있지 않습니다."
          @cardClick="handleCardClick"
        />

        <ChallengeSection
          title="개인 챌린지"
          :challenges="personalChallenges"
          type="personal"
          icon-class="fas fa-user"
          :max-count="3"
          :show-count="true"
          empty-message="현재 참여중인 개인 챌린지가 없습니다."
          @cardClick="handleCardClick"
        />

        <ChallengeSection
          title="소그룹 챌린지"
          :challenges="groupChallenges"
          type="group"
          icon-class="fas fa-user-friends"
          :max-count="3"
          :show-count="true"
          empty-message="현재 참여중인 소그룹 챌린지가 없습니다."
          @cardClick="handleCardClick"
        />

        <div class="test-buttons">
          <button class="test-success-btn" @click="showSuccessModalExample">
            성공 모달 테스트
          </button>
          <button class="test-fail-btn" @click="showFailModalExample">
            실패 모달 테스트
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.challenge-joined-list {
  padding: 0;
  background: var(--color-bg-light);
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.content {
  padding-top: 20px;
  padding-bottom: 140px;
  min-height: 100%;
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
