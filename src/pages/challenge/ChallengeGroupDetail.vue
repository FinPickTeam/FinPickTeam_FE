<template>
  <div class="challenge-group-detail">
    <!-- 참여 확인 모달 -->
    <ChallengeJoinConfirmModal
      :isVisible="showJoinModal"
      :challenge="challenge"
      @close="closeJoinModal"
      @confirm="confirmJoin"
    />

    <!-- 참여 제한 모달 -->
    <ChallengeParticipationLimitModal
      :isVisible="showParticipationLimitModal"
      :personalCount="challengeStore.counts.PERSONAL"
      :groupCount="challengeStore.counts.GROUP"
      @close="showParticipationLimitModal = false"
    />

    <!-- 포인트 부족 모달 -->
    <ChallengeInsufficientPointsModal
      :isVisible="showInsufficientPointsModal"
      :currentPoints="challengeStore.points.userPoints"
      :requiredPoints="challengeStore.points.required.GROUP"
      @close="showInsufficientPointsModal = false"
    />

    <!-- 결과 모달들 (완료 + 미확인 진입 시) -->
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

        <!-- 비공개 챌린지이고 참여중이 아닌 경우: 제목과 기간만 표시 -->
        <div v-if="!challenge.usePassword || challenge.isParticipating">
          <p class="challenge-description">{{ challenge.description }}</p>

          <div class="challenge-stats">
            <div class="stat-item">
              <span class="stat-label">참여자</span>
              <span class="stat-value"
                >{{ challenge.participantsCount || 0 }}명</span
              >
            </div>
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

          <!-- 내 진행률 (참여중일 때만) -->
          <div class="progress-section" v-if="challenge.isParticipating">
            <div class="progress-header">
              <span class="progress-label">달성률</span>
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

          <!-- 참여자 목록 섹션 -->
          <div
            class="members-section"
            v-if="
              challenge.isParticipating &&
              challenge.members &&
              challenge.members.length
            "
          >
            <h3 class="members-title">참여자</h3>

            <div class="avatar-grid">
              <div
                v-for="m in challenge.members"
                :key="m.userId"
                class="avatar-card"
              >
                <AvatarStack
                  :level-id="m.levelId"
                  :top-id="m.topId"
                  :shoes-id="m.shoesId"
                  :accessory-id="m.accessoryId"
                  :gift-card-id="m.giftCardId"
                  :nickname="m.nickname"
                  :size="56"
                />
                <div class="avatar-name" :title="m.nickname">
                  {{ m.nickname }}
                </div>

                <div class="avatar-progress">
                  <div class="avatar-progress-bar">
                    <div
                      class="avatar-progress-fill"
                      :style="{
                        width: Math.round((m.progress || 0) * 100) + '%',
                      }"
                    ></div>
                  </div>
                  <div class="avatar-progress-text">
                    {{ Math.round((m.progress || 0) * 100) }}%
                  </div>
                </div>
              </div>
            </div>

            <p v-if="!challenge.isParticipating" class="members-hint">
              참여 후 멤버들의 진행률이 표시돼요.
            </p>
          </div>
        </div>

        <!-- 모집 현황 (미참여 & 모집중일 때) - 비공개 챌린지에서도 표시 -->
        <div
          class="recruitment-section"
          v-if="!challenge.isParticipating && isRecruiting"
        >
          <div class="progress-header">
            <span class="progress-label">모집 현황</span>
            <span class="progress-percentage"
              >{{ challenge.participantsCount }}/{{ maxParticipants }}명</span
            >
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width:
                  Math.min(
                    100,
                    ((challenge.participantsCount || 0) / maxParticipants) * 100
                  ) + '%',
              }"
            ></div>
          </div>
        </div>

        <!-- 비밀번호 입력 섹션 (비공개 챌린지이고 참여중이 아닌 경우) -->
        <div
          v-if="
            challenge.usePassword &&
            !challenge.isParticipating &&
            showJoinButton
          "
          class="password-section"
        >
          <div class="password-input-container">
            <input
              v-model="password"
              type="password"
              class="password-input"
              placeholder="비밀번호 입력 (숫자 4자리)"
              @keyup.enter="handlePasswordSubmit"
            />
          </div>
        </div>
      </div>

      <!-- 비밀번호 참여 버튼 (비공개 챌린지이고 참여중이 아닌 경우) -->
      <div
        v-if="
          challenge.usePassword && !challenge.isParticipating && showJoinButton
        "
        class="join-section"
      >
        <button class="join-button" @click="handlePasswordSubmit">
          참여하기
        </button>
      </div>

      <!-- 일반 참여 버튼 (공개 챌린지이거나 이미 참여중인 경우) -->
      <div
        class="join-section"
        v-if="
          showJoinButton &&
          (!challenge.usePassword || challenge.isParticipating)
        "
      >
        <button class="join-button" @click="openJoinModal">
          챌린지 참여하기
        </button>
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
  joinChallenge,
  getChallengeResult,
  confirmChallengeResult,
  getChallengeList,
} from '@/api/challenge/challenge.js';
import ChallengeJoinConfirmModal from '@/components/challenge/ChallengeJoinConfirmModal.vue';
import ChallengeFailModal from '@/components/challenge/ChallengeFailModal.vue';
import ChallengeSuccessModal from '@/components/challenge/ChallengeSuccessModal.vue';
import ChallengeParticipationLimitModal from '@/components/challenge/ChallengeParticipationLimitModal.vue';
import ChallengeInsufficientPointsModal from '@/components/challenge/ChallengeInsufficientPointsModal.vue';
import AvatarStack from '@/components/avatar/AvatarStack.vue';
import { useChallengeStore } from '@/stores/challenge';

const route = useRoute();
const challengeStore = useChallengeStore();

const loading = ref(true);
const challenge = ref(null);

// join modal
const showJoinModal = ref(false);
const password = ref('');
const isPasswordVerified = ref(false); // 비밀번호 검증 상태 추가

// participation limit modal
const showParticipationLimitModal = ref(false);

// insufficient points modal
const showInsufficientPointsModal = ref(false);

// result modals
const showSuccessModal = ref(false);
const showFailModal = ref(false);
const challengeResult = ref(null); // ✅ 실제 결과 보관

// 백엔드가 주는 값 우선 사용
const maxParticipants = computed(() => challenge.value?.maxParticipants ?? 6);

const isRecruiting = computed(() => challenge.value?.status === 'RECRUITING');
const isMine = computed(() => !!challenge.value?.isMine);
const showJoinButton = computed(
  () =>
    isRecruiting.value &&
    !challenge.value?.isParticipating &&
    !isMine.value &&
    (challenge.value?.participantsCount || 0) < maxParticipants.value
);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const data = await getChallengeDetail(id);
    challenge.value = data;

    // 참여 중인 챌린지 목록을 가져와서 store 업데이트
    try {
      const participatingList = await getChallengeList({ participating: true });
      challengeStore.updateCountsFromList(participatingList || []);
    } catch (e) {
      console.error('참여 중인 챌린지 목록 조회 실패:', e);
    }

    // 포인트 정보 업데이트
    try {
      await challengeStore.fetchCoinStatus();
    } catch (e) {
      console.error('포인트 정보 조회 실패:', e);
    }

    // 완료 + 미확인 → 결과 모달
    if (
      data?.status === 'COMPLETED' &&
      data?.isParticipating &&
      !data?.isResultCheck
    ) {
      // 결과 데이터 가져오기
      const result = await getChallengeResult(id);
      console.log('=== ChallengeGroupDetail - API 응답 ===');
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
          console.log('success', showSuccessModal.value);
        } else {
          showFailModal.value = true;
        }
      }
    } else {
      showSuccessModal.value = false;
      showFailModal.value = false;
      challengeResult.value = null;
    }
  } catch (e) {
    console.error(e);
    challenge.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);

const checkParticipationLimit = () => {
  // 그룹 챌린지 참여 제한 체크
  if (challengeStore.isTypeFull('GROUP')) {
    showParticipationLimitModal.value = true;
    return false;
  }
  return true;
};

const checkPoints = () => {
  // 포인트 부족 체크
  if (!challengeStore.hasEnoughPointsForType('GROUP')) {
    showInsufficientPointsModal.value = true;
    return false;
  }
  return true;
};

const openJoinModal = () => {
  // 참여 제한 체크
  if (!checkParticipationLimit()) {
    return;
  }

  // 포인트 부족 체크
  if (!checkPoints()) {
    return;
  }

  showJoinModal.value = true;
};

const closeJoinModal = () => {
  showJoinModal.value = false;
};

const handlePasswordSubmit = async () => {
  if (!password.value.trim()) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  // 참여 제한 체크
  if (!checkParticipationLimit()) {
    return;
  }

  // 포인트 부족 체크
  if (!checkPoints()) {
    return;
  }

  try {
    // 비밀번호 검증만 수행 (실제 참여는 하지 않음)
    // TODO: 백엔드에서 비밀번호 검증 전용 API가 필요할 수 있음
    // 현재는 joinChallenge를 사용하되, 실제 참여는 모달에서 처리
    await joinChallenge(route.params.id, { password: password.value });
    password.value = '';
    isPasswordVerified.value = true; // 비밀번호 검증 완료
    // 비밀번호 검증 성공 후 확인 모달 표시
    showJoinModal.value = true;
  } catch (e) {
    alert(e?.response?.data?.message || '비밀번호가 올바르지 않습니다.');
  }
};

const confirmJoin = async () => {
  try {
    // 비밀번호가 있는 챌린지의 경우 이미 검증된 상태이므로 바로 참여
    // 비밀번호가 없는 챌린지의 경우 일반 참여
    if (isPasswordVerified.value) {
      // 비밀번호가 이미 검증된 경우, 실제 참여는 이미 완료된 상태
      // 페이지 새로고침만 수행
      isPasswordVerified.value = false; // 상태 초기화
    } else {
      // 일반 참여
      await joinChallenge(route.params.id);
    }
    showJoinModal.value = false;
    // 참여 완료 후 현재 페이지 새로고침하여 참여 상태 업데이트
    await fetchDetail();
  } catch (e) {
    alert(e?.response?.data?.message || '참여에 실패했어요.');
    showJoinModal.value = false;
  }
};

const handleResultConfirm = async () => {
  try {
    await confirmChallengeResult(route.params.id);
  } catch (_) {}
  showSuccessModal.value = false;
  showFailModal.value = false;
  challengeResult.value = null;
  await fetchDetail();
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
/* 기존 스타일 + 아바타 그리드 추가 */
.challenge-group-detail {
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

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.avatar-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-name {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
}

.avatar-progress {
  margin-top: 6px;
  width: 100%;
}
.avatar-progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
}
.avatar-progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
}
.avatar-progress-text {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.members-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #888;
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
  min-height: calc(
    100vh - 80px - 68px
  ); /* 헤더와 네비바 높이를 제외한 전체 높이 */
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
  grid-template-columns: repeat(3, 1fr);
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

.recruitment-section {
  margin-bottom: 20px;
}

.group-info {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.creator-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.creator-label {
  font-size: 14px;
  color: #666;
}

.creator-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.join-section {
  padding: 20px 0;
  width: 100%;
  max-width: 500px;
}

.join-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.join-button:hover {
  transform: translateY(-2px);
}

/* 비밀번호 입력 섹션 스타일 */
.password-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.password-info {
  text-align: center;
  margin-bottom: 20px;
}

.password-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  font-family: var(--font-main);
}

.password-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-family: var(--font-main);
}

.password-input-container {
  margin-bottom: 20px;
}

.password-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-family: var(--font-main);
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.password-input:focus {
  outline: none;
  border-color: var(--color-main);
}

.joined-button {
  width: 100%;
  padding: 16px;
  background-color: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: not-allowed;
}

/* 참여자 목록 스타일 */
.members-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.members-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.member-nickname {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.member-progress {
  font-size: 12px;
  color: #666;
}

.member-progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.member-progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style>
