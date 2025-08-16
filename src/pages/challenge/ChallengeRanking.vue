<!-- src/pages/challenge/ChallengeRanking.vue -->
<template>
  <div class="challenge-ranking">
    <div class="ranking-header">
      <div class="ranking-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'common' }"
          @click="switchTab('common')"
        >
          공통 랭킹
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'coin' }"
          @click="switchTab('coin')"
        >
          개인 랭킹
        </button>
      </div>

      <div class="refresh-section">
        <button class="refresh-btn" @click="refreshData" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
        </button>
        <div v-if="lastUpdated" class="last-updated">
          {{ formatLastUpdated(lastUpdated) }}
        </div>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">랭킹 데이터를 불러오는 중...</p>
    </div>

    <!-- 공통 랭킹 -->
    <div v-else-if="activeTab === 'common'" class="common-ranking">
      <!-- 진행 중 공통 챌린지가 없는 경우 -->
      <div v-if="!commonChallenge" class="ranking-card">
        <div class="ranking-info" style="margin-top: 12px">
          <div class="user-name">
            <strong class="nickname nickname-lg">{{ nickname }}</strong
            >님,
          </div>
          <div class="total-participants">
            이번 달 공통 챌린지가 진행 중이 아니에요.
          </div>
        </div>
      </div>

      <!-- 공통 챌린지 있음 + 미참여 -->
      <div v-else-if="!participating" class="not-participating-container">
        <!-- 메인 카드 -->
        <div class="not-participating-card">
          <!-- 상단 일러스트레이션 -->
          <div class="illustration-section">
            <div class="illustration-container">
              <div class="floating-elements">
                <div class="floating-coin coin-1">💰</div>
                <div class="floating-coin coin-2">🎯</div>
                <div class="floating-coin coin-3">⭐</div>
              </div>
              <div class="main-illustration">
                <div class="challenge-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="sparkle sparkle-1">✨</div>
                <div class="sparkle sparkle-2">✨</div>
                <div class="sparkle sparkle-3">✨</div>
              </div>
            </div>
          </div>

          <!-- 사용자 인사말 -->
          <div class="greeting-section">
            <div class="greeting-text">
              <span class="greeting-nickname">{{ nickname }}</span
              >님,
              <br />
              <span class="greeting-message"
                >이번 달 챌린지에 참여하지 않으셨어요!</span
              >
            </div>
          </div>

          <!-- 정보 카드 -->
          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">📊</div>
              <div class="info-content">
                <h3 class="info-title">현재 참여 현황</h3>
                <p class="info-desc">
                  {{ totalParticipants.toLocaleString() }}명이 참여 중
                </p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">🎁</div>
              <div class="info-content">
                <h3 class="info-title">다음 기회</h3>
                <p class="info-desc">다음 달 챌린지에 참여해보세요!</p>
              </div>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="action-section">
            <button
              class="notify-toggle-btn"
              :class="{ 'notify-active': notifyEnabled }"
              @click="handleNotifyToggle"
              aria-live="polite"
            >
              <div class="btn-content">
                <span class="btn-icon">{{ notifyEnabled ? '🔔' : '🔕' }}</span>
                <span class="btn-text">
                  {{ notifyEnabled ? '알림 설정됨' : '다음 달 알림 받기' }}
                </span>
              </div>
            </button>

            <p class="action-desc">
              {{
                notifyEnabled
                  ? '다음 달 챌린지 시작 시 알림을 받으실 수 있어요!'
                  : '다음 달 챌린지 시작 알림을 받으시겠어요?'
              }}
            </p>
          </div>
        </div>

        <!-- 글래스 토스트 -->
        <transition name="toast-fade">
          <div
            v-if="showToast"
            class="notify-toast"
            :class="toastType === 'applied' ? 'toast-on' : 'toast-off'"
            role="status"
            aria-live="assertive"
          >
            <span class="toast-icon" v-if="toastType === 'applied'">✅</span>
            <span class="toast-icon" v-else>🚫</span>
            <span class="toast-text">
              {{
                toastType === 'applied'
                  ? '알림이 신청되었습니다!'
                  : '챌린지 알림 신청이 취소되었습니다!'
              }}
            </span>
          </div>
        </transition>
      </div>

      <!-- 공통 챌린지 있음 + 참여 중 -->
      <div v-else class="common-participating-card">
        <!-- 헤더 섹션 -->
        <div class="common-header">
          <div class="common-status">
            <div class="status-indicator active"></div>
            <h2 class="common-title">{{ commonChallenge.title }}</h2>
          </div>
        </div>

        <!-- 내 랭킹 섹션 -->
        <div class="my-rank-section">
          <div class="rank-display">
            <div class="rank-circle">
              <span class="rank-label">{{ myCommonRow?.rank }}등</span>
            </div>
            <div class="rank-info">
              <h3 class="user-name">{{ nickname }}님</h3>
              <p class="total-participants">
                총 {{ totalParticipants.toLocaleString() }}명 중
              </p>
            </div>
          </div>
        </div>

        <!-- 진행률 섹션 -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-title">현재 소비액</span>
            <span class="progress-percentage"
              >{{ commonProgressPercent }}%</span
            >
          </div>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: commonProgressPercent + '%' }"
              ></div>
            </div>
            <div class="progress-details">
              <span class="current-amount">{{
                formatCurrency(myCommonRow?.actualValue)
              }}</span>
              <span class="separator">/</span>
              <span class="goal-amount">{{
                formatCurrency(commonChallenge.goalValue)
              }}</span>
            </div>
          </div>
        </div>

        <!-- 랭킹 섹션 -->
        <div class="ranking-section">
          <div class="section-header">
            <h3 class="section-title">실시간 랭킹</h3>
            <span class="section-subtitle">현재 시간 기준</span>
          </div>

          <div class="ranking-list">
            <div
              v-for="(it, idx) in commonRankListSorted"
              :key="idx"
              class="ranking-item"
              :class="{ 'my-rank': isMe(it) }"
            >
              <span class="position-number">{{ it.rank }}</span>
              <span class="user-nickname">{{ it.nickname }}</span>
              <span class="user-amount">{{
                formatCurrency(it.actualValue)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 누적 포인트 랭킹 -->
    <div v-else-if="activeTab === 'coin'" class="coin-ranking">
      <div class="ranking-cards">
        <div
          v-for="(u, i) in coinTop5"
          :key="i"
          class="ranking-card-item"
          :class="{ 'top-rank': i < 3 }"
        >
          <div class="rank-medal">
            <img
              v-if="i === 0"
              src="@/assets/challenge/금메달.png"
              alt="금메달"
              class="medal-icon"
            />
            <img
              v-else-if="i === 1"
              src="@/assets/challenge/은메달.png"
              alt="은메달"
              class="medal-icon"
            />
            <img
              v-else-if="i === 2"
              src="@/assets/challenge/동메달.png"
              alt="동메달"
              class="medal-icon"
            />
            <div v-else class="rank-number">{{ u.rank }}</div>
          </div>
          <div class="user-info">
            <div class="user-name">{{ u.nickname }}</div>
            <div class="user-details">
              <span class="participants"
                >총 {{ totalParticipants.toLocaleString() }}개 참여</span
              >
              <span class="progress-rate"
                >성공률 {{ u.displaySuccessRate }}</span
              >
            </div>
          </div>
          <div class="user-score">
            <div class="score-value">
              {{ formatCurrency(u.cumulativePoint) }}
            </div>
            <div class="score-label">점수</div>
          </div>
        </div>
        <div v-if="coinTop5.length === 0" class="empty">
          아직 랭킹 데이터가 없어요.
        </div>
      </div>

      <div class="my-ranking">
        <h2>내 랭킹</h2>
        <div v-if="myCoinRow" class="my-rank-card">
          <div class="my-rank-info">
            <div class="my-rank-number">{{ myCoinRow.rank }}</div>
            <div class="my-rank-details">
              <div class="my-rank-title">{{ nickname }}</div>
              <div class="my-rank-subtitle">
                총 {{ myCoinRow.challengeCount ?? 0 }}개 챌린지 참여 중
              </div>
            </div>
          </div>
          <div class="my-rank-score">
            <div class="score">
              {{ formatCurrency(myCoinRow.cumulativePoint) }}
            </div>
            <div class="score-label">점수</div>
          </div>
        </div>
        <div v-else class="empty">
          이번 달 포인트가 아직 없어요. 챌린지에 도전해보세요!
        </div>
      </div>
    </div>

    <span class="sr-only" aria-live="polite"></span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
  getChallengeDetail,
  getChallengeList,
  getCommonChallengeRank,
  refreshCommonChallengeRank,
} from '@/api/challenge/challenge';
import {
  getCoinRankTop5WithMe,
  runCoinRankCalculationNow,
} from '@/api/challenge/coinRank';

const auth = useAuthStore();

// 안전한 사용자 프로필
const nickname = computed(
  () => auth?.user?.nickname || auth?.user?.nickName || '나'
);
const userId = computed(() => auth?.user?.id || null);

// 탭/상태
const activeTab = ref('common');
const isLoading = ref(false);
const lastUpdated = ref(null);

// 공통 랭킹 상태
const commonChallenge = ref(null);
const commonRankList = ref([]);
const myCommonRow = ref(null);
const totalParticipants = ref(0);
const participating = ref(false);

// 알림 상태 & 토스트
const notifyEnabled = ref(false);
const showToast = ref(false);
/** 'applied' | 'canceled' */
const toastType = ref(null);

// 정렬
const commonRankListSorted = computed(() =>
  [...commonRankList.value].sort(
    (a, b) => (a.rank || 99999) - (b.rank || 99999)
  )
);

// 게이지 %
const commonProgressPercent = computed(() => {
  const goal = Number(commonChallenge.value?.goalValue || 0);
  const used = Number(myCommonRow.value?.actualValue || 0);
  if (goal <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (used / goal) * 100)));
});

// 내 행 구분
const isMe = (row) => {
  if (!row) return false;
  if (row.userId != null && userId.value != null) {
    return Number(row.userId) === Number(userId.value);
  }
  return row.nickname === nickname.value;
};

// 현재 공통 챌린지
const findCurrentCommonChallenge = async () => {
  try {
    const list = await getChallengeList({
      type: 'COMMON',
      status: 'IN_PROGRESS',
    });
    if (!Array.isArray(list) || list.length === 0) return null;

    const c = list[0];
    const detail = await getChallengeDetail(c.id);

    return {
      id: c?.id,
      title: c?.title,
      goalValue: detail?.goalValue ?? c?.goalValue ?? 0,
      participantCount: detail?.participantsCount ?? c?.participantsCount ?? 0,
    };
  } catch {
    return null;
  }
};

const loadCommonRank = async () => {
  commonChallenge.value = await findCurrentCommonChallenge();
  if (!commonChallenge.value?.id) {
    commonRankList.value = [];
    myCommonRow.value = null;
    totalParticipants.value = 0;
    participating.value = false;
    return;
  }

  try {
    const rows = await getCommonChallengeRank(commonChallenge.value.id);
    commonRankList.value = Array.isArray(rows) ? rows : [];
    totalParticipants.value = Number(
      commonChallenge.value.participantCount ?? 0
    );

    myCommonRow.value = commonRankList.value.find((r) => isMe(r)) || null;
    participating.value = !!myCommonRow.value;
  } catch {
    commonRankList.value = [];
    myCommonRow.value = null;
    totalParticipants.value = 0;
    participating.value = false;
  }
};

const refreshCommon = async () => {
  if (!commonChallenge.value?.id) return;
  try {
    await refreshCommonChallengeRank(commonChallenge.value.id);
  } catch {}
  await loadCommonRank();
};

// 코인 랭킹
const coinRows = ref([]);

const coinTop5 = computed(() =>
  [...coinRows.value]
    .filter((r) => Number.isInteger(Number(r.rank)) && Number(r.rank) <= 5)
    .sort((a, b) => Number(a.rank) - Number(b.rank))
);

const myCoinRow = computed(() => {
  if (!coinRows.value?.length) return null;
  const uid = Number(userId.value ?? -1);
  const byId = coinRows.value.find((r) => Number(r.userId) === uid);
  if (byId) return byId;
  return coinRows.value.find((r) => r.nickname === nickname.value) || null;
});

const toIntPercentSafe = (successCount, total) => {
  const s = Number(successCount ?? 0);
  const t = Number(total ?? 0);
  if (t <= 0) return 0;
  return Math.round((s / t) * 100);
};
const toIntPercent = (v) => {
  const n = Number(v ?? 0);
  if (!isFinite(n)) return 0;
  return Math.round(n);
};

const loadCoinRank = async () => {
  const uid = userId.value;
  if (!uid) {
    coinRows.value = [];
    return;
  }
  try {
    const rows = await getCoinRankTop5WithMe(uid);
    coinRows.value = (rows || []).map((r) => {
      const pct = toIntPercent(
        r.successRate ?? toIntPercentSafe(r.successCount, r.totalChallenges)
      );
      return {
        userId: r.userId ?? null,
        nickname: r.nickname ?? '-',
        rank: Number.isInteger(r.rank) ? r.rank : null,
        cumulativePoint: Number(r.cumulativePoint ?? 0),
        challengeCount: Number(r.challengeCount ?? r.totalChallenges ?? 0),
        successRate: pct,
        displaySuccessRate: `${pct}%`, // ✅ 템플릿은 문자열만 사용
      };
    });
  } catch {
    coinRows.value = [];
  }
};

// 공통
const switchTab = async (tab) => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  await loadTab();
};

const loadTab = async () => {
  isLoading.value = true;
  try {
    if (activeTab.value === 'common') {
      await loadCommonRank();
    } else {
      await loadCoinRank();
    }
    lastUpdated.value = new Date();
  } finally {
    isLoading.value = false;
  }
};

const refreshData = async () => {
  isLoading.value = true;
  try {
    if (activeTab.value === 'common') {
      await refreshCommon();
    } else {
      try {
        await runCoinRankCalculationNow();
      } catch {}
      await loadCoinRank();
    }
    lastUpdated.value = new Date();
  } finally {
    isLoading.value = false;
  }
};

/** 알림 토글 (토스트는 상태와 분리해서 정확한 문구 보장) */
const handleNotifyToggle = () => {
  const next = !notifyEnabled.value;
  notifyEnabled.value = next;
  localStorage.setItem('common-rank-notify', next ? '1' : '0');
  toastType.value = next ? 'applied' : 'canceled';
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 1800);
};

// 유틸
const formatLastUpdated = (date) =>
  date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
const formatCurrency = (n) => (Number(n) || 0).toLocaleString();

// 마운트
onMounted(async () => {
  // 안전 파싱: '1'만 true로 취급 (기타 값/없음은 false)
  notifyEnabled.value = localStorage.getItem('common-rank-notify') === '1';
  await loadTab();
});
</script>

<style scoped>
/* 레이아웃 기본 */
.challenge-ranking {
  padding: 16px 16px 20px 16px;
  background: var(--color-bg-light);
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 20px;
  padding-bottom: 170px;
  box-sizing: border-box;
}

/* 헤더 */
.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.ranking-tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin-right: 16px;
}
.tab-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  color: #fff;
}
.refresh-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.refresh-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(107, 70, 193, 0.3);
}
.refresh-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.4);
}
.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.last-updated {
  font-size: 10px;
  color: #666;
  text-align: center;
  white-space: nowrap;
}

/* 로딩 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 40px 20px;
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
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading-text {
  font-size: 16px;
  color: #666;
}

/* 공통 랭킹 전용 스타일 */
.common-ranking {
  display: flex;
  flex-direction: column;
}

/* 기존 카드 스타일 (미참여, 빈 상태용) */
.ranking-card {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 0 24px 32px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 360px;
  width: 100%;
  margin: 0 auto;
}

/* 공통 참여 중 카드 */
.common-participating-card {
  background: var(--color-bg);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 공통 헤더 */
.common-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.common-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4caf50;
}

.status-indicator.active {
  background-color: #ff9800;
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
}

.common-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* 내 랭킹 섹션 */
.my-rank-section {
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 16px;
  border: 1px solid #e8f0ff;
}

.rank-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.rank-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  animation: rankPulse 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

.rank-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  animation: rankShake 0.6s ease-in-out;
}

.rank-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
}

.rank-number {
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.rank-label {
  font-size: 32px;
  font-weight: 900;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.rank-info {
  flex: 1;
  text-align: left;
}

.rank-info .user-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.rank-info .total-participants {
  font-size: 14px;
  color: #666;
}

/* 진행률 섹션 */
.progress-section {
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-main);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 6px;
  transition: width 0.5s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-details {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.current-amount {
  font-weight: 700;
  color: var(--color-main);
}

.separator {
  color: #999;
}

.goal-amount {
  color: #666;
}

/* 랭킹 섹션 */
.ranking-section {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 16px; */
  padding-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 16px 10px;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s ease;
  gap: 10px;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item:hover {
  background-color: #fafafa;
}

.ranking-item.my-rank {
  background: linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%);
}

.ranking-item.my-rank:hover {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.position-number {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-main);
  line-height: 1;
  min-width: 40px;
  text-align: center;
}

.ranking-item.my-rank .position-number {
  color: #f57c00;
}

.user-nickname {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.user-amount {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-main);
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: 100px;
}

.ranking-item.my-rank .user-amount {
  color: #f57c00;
}

.rank-indicator {
  width: 24px;
  text-align: center;
}

.rank-indicator i {
  color: #ff9800;
  font-size: 16px;
  animation: starPulse 2s ease-in-out infinite;
}

@keyframes starPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 랭킹 원형 애니메이션 */
@keyframes rankPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }
}

@keyframes rankShake {
  0%,
  100% {
    transform: scale(1.05) rotate(0deg);
  }
  25% {
    transform: scale(1.05) rotate(-2deg);
  }
  75% {
    transform: scale(1.05) rotate(2deg);
  }
}

/* 내부 반짝임 효과 */
.rank-circle::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shimmer 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(0deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(360deg);
  }
}

/* ===== 미참여 사용자 UI 개선 ===== */
.not-participating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.not-participating-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 12px 32px rgba(107, 70, 193, 0.12);
  border: 1px solid rgba(107, 70, 193, 0.08);
  max-width: 380px;
  width: 100%;

  overflow: hidden;
}

.not-participating-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--color-main) 0%,
    var(--color-main-light) 100%
  );
  border-radius: 24px 24px 0 0;
}

/* 일러스트레이션 섹션 */
.illustration-section {
  margin-bottom: 32px;
  position: relative;
}

.illustration-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-coin {
  position: absolute;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
  opacity: 0.8;
}

.coin-1 {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.coin-2 {
  top: 20%;
  right: 20%;
  animation-delay: 1s;
}

.coin-3 {
  bottom: 15%;
  left: 25%;
  animation-delay: 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.main-illustration {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.challenge-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
  position: relative;
  z-index: 2;
}

.challenge-icon i {
  font-size: 36px;
  color: white;
  animation: trophyGlow 2s ease-in-out infinite;
}

@keyframes trophyGlow {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
}

.sparkle {
  position: absolute;
  font-size: 16px;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle-1 {
  top: -10px;
  left: 20px;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 10px;
  right: 15px;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: -5px;
  left: 50%;
  animation-delay: 1.4s;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
}

/* 인사말 섹션 */
.greeting-section {
  margin-bottom: 32px;
  text-align: center;
}

.greeting-text {
  font-size: 18px;
  line-height: 1.5;
  color: #333;
}

.greeting-nickname {
  font-weight: 800;
  color: var(--color-main);
  font-size: 20px;
}

.greeting-message {
  font-weight: 500;
  color: #666;
  margin-top: 4px;
  display: inline-block;
}

/* 정보 카드 */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(107, 70, 193, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 70, 193, 0.15);
}

.info-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
}

.info-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 액션 섹션 */
.action-section {
  text-align: center;
}

.notify-toggle-btn {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border: 2px solid rgba(107, 70, 193, 0.2);
  color: var(--color-main); /* 기본 폰트 색상 추가 */
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

.notify-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 70, 193, 0.2);
}

.notify-toggle-btn.notify-active {
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-color: var(--color-main);
  color: white;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  font-size: 16px;
  font-weight: 600;
}

.btn-toggle-indicator {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.notify-toggle-btn.notify-active .btn-toggle-indicator {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* 닉네임/등수 크게 */
.nickname {
  font-weight: 800;
  font-size: 18px;
  color: #222;
}
.nickname-lg {
  font-size: 20px;
}
.rank-lg {
  font-size: 22px;
}

.user-headline {
  margin-bottom: 2px;
}
.participants-secondary {
  font-size: 13px;
  margin-top: 2px;
}

/* 참여 O 강조 */
.highlight-rank {
  font-weight: 800;
  color: var(--color-main);
  margin: 0 2px;
}
.muted {
  color: #777;
  font-weight: 500;
}

/* 게이지 */
.progress-section {
  margin-top: 16px;
}
.progress-header {
  text-align: left;
  font-size: 12px;
  color: #9aa0a6;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 4px;
  transition: width 0.3s;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}

/* 리스트 캡션 */
.list-caption {
  margin-top: 28px;
  font-size: 12px;
  color: #9aa0a6;
  text-align: left;
}

/* 랭킹 리스트 */
.rank-list ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
}
.rank-list li {
  position: relative; /* ✅ 배경 오버레이용 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}
.rank-list li.me::before {
  /* ✅ 내 칸 색칠을 가로로 더 넓게 */
  content: '';
  position: absolute;
  left: -16px;
  right: -16px;
  top: 0;
  bottom: 0;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  z-index: 0;
}
.row-content {
  position: relative;
  z-index: 1;
} /* 텍스트는 오버레이 위 */
.row-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pos {
  width: 40px;
  font-weight: 800;
  color: var(--color-main-dark);
  text-align: left;
}
.rank-list li.me .pos {
  color: var(--color-main);
}
.name {
  flex: 1;
  text-align: left;
  color: #222;
}
.value {
  min-width: 100px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--color-main);
  font-weight: 700;
}

/* ===== 기존 미참여 스타일 정리 ===== */
/* 이전 스타일들은 새로운 UI로 대체되었습니다 */

/* ===== 토스트 (하단 중앙) ===== */
.notify-toast {
  position: fixed;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.4);
  min-width: 280px;
  max-width: 320px;
  justify-content: center;
}
.toast-on {
  background: linear-gradient(
    135deg,
    rgba(230, 244, 234, 0.9),
    rgba(214, 240, 223, 0.92)
  );
  color: #126a35;
}
.toast-off {
  background: linear-gradient(
    135deg,
    rgba(253, 236, 234, 0.92),
    rgba(250, 225, 222, 0.94)
  );
  color: #a21414;
}
.toast-icon {
  font-size: 16px;
}
.toast-text {
  letter-spacing: -0.2px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.38s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

/* 누적 포인트 */
.coin-ranking {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ranking-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ranking-card-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 16px;
}
.ranking-card-item.top-rank {
  background: linear-gradient(135deg, #fff2cc 0%, #ffeaa7 100%);
  border: 1px solid #ffd54f;
}
.ranking-card-item:nth-child(2) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
}
.ranking-card-item:nth-child(3) {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 1px solid #ffb74d;
}
.rank-medal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}
.medal-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.rank-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
  font-weight: 700;
  font-size: 16px;
  color: #666;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.user-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}
.participants {
  color: #666;
}
.progress-rate {
  color: var(--color-main);
  font-weight: 500;
}
.user-score {
  text-align: right;
  flex-shrink: 0;
}
.score-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-main);
  margin-bottom: 2px;
}
.score-label {
  font-size: 12px;
  color: #666;
}

.empty {
  color: #777;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.my-ranking {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.my-ranking h2 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}
.my-rank-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 1px solid #e8f0ff;
}
.my-rank-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.my-rank-number {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  font-weight: 800;
  color: white;
  font-size: 24px;
}
.my-rank-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.my-rank-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.my-rank-subtitle {
  font-size: 12px;
  color: #666;
}
.my-rank-score {
  text-align: right;
}
.my-rank-score .score {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-main);
  margin-bottom: 2px;
}
.my-rank-score .score-label {
  font-size: 12px;
  color: #666;
}

/* ===== 기존 이미지 스타일 정리 ===== */
/* 새로운 일러스트레이션으로 대체되었습니다 */

/* 스크린 리더용 텍스트 숨김 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
