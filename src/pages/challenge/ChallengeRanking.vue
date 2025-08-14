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
          누적 포인트
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
      <div v-if="!commonChallenge" class="ranking-card">
        <div class="ranking-info" style="margin-top: 12px;">
          <div class="user-name">{{ nickname }}님</div>
          <div class="total-participants">이번 달 공통 챌린지가 진행 중이 아니에요.</div>
        </div>
      </div>

      <div v-else-if="!participating" class="ranking-card">
        <div class="target-section">
          <div class="target-icon">
            <img
                src="@/assets/challenge/target-dynamic-color.png"
                alt="타겟"
                class="target-image"
            />
          </div>
        </div>
        <div class="ranking-info">
          <div class="user-name">{{ nickname }}님</div>
          <div class="total-participants">이번 달 공통 챌린지에 참여하지 않았습니다.</div>
          <button class="notify-btn" @click="toggleNotify">
            <span class="bell">🔔</span> 다음 달 모집 알림 받기
          </button>
          <div v-if="notifyEnabled" class="notify-hint">알림 신청이 저장되었습니다.</div>
        </div>
      </div>

      <div v-else class="ranking-card">
        <div class="target-section">
          <div class="target-icon">
            <img
                src="@/assets/challenge/target-dynamic-color.png"
                alt="타겟"
                class="target-image"
            />
          </div>
        </div>

        <div class="ranking-info">
          <div class="user-name">{{ nickname }}님은 현재</div>
          <div class="total-participants">
            <strong>{{ totalParticipants.toLocaleString() }}</strong> 명 중
          </div>
          <div class="rank-position">{{ myCommonRow?.rank }}등</div>
        </div>

        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: commonProgressPercent + '%' }"></div>
          </div>
          <div class="progress-labels">
            <span>0</span>
            <span>{{ formatCurrency(myCommonRow?.actualValue) }} / {{ formatCurrency(commonChallenge.goalValue) }}</span>
            <span>{{ formatCurrency(commonChallenge.goalValue) }}</span>
          </div>
        </div>

        <div class="rank-list">
          <ul>
            <li v-for="(it, idx) in commonRankListSorted" :key="idx" :class="{ me: isMe(it) }">
              <span class="pos">#{{ it.rank }}</span>
              <span class="name">{{ it.nickname }}</span>
              <span class="value">{{ formatCurrency(it.actualValue) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 누적 포인트 랭킹 -->
    <div v-else-if="activeTab === 'coin'">
      <div class="ranking-list">
        <h3>상위 랭커</h3>
        <table v-if="coinTop5.length">
          <thead>
          <tr>
            <th>순위</th>
            <th>닉네임</th>
            <th>참여수</th>
            <th>성공률</th>
            <th class="right">월 누적 포인트</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(u, i) in coinTop5" :key="i">
            <td>#{{ u.rank }}</td>
            <td>{{ u.nickname }}</td>
            <td>{{ u.challengeCount ?? 0 }}</td>
            <td>{{ formatRate(u.successRate) }}</td>
            <td class="right">{{ formatCurrency(u.cumulativePoint) }}</td>
          </tr>
          </tbody>
        </table>
        <div v-else class="empty">아직 랭킹 데이터가 없어요.</div>
      </div>

      <div class="my-ranking">
        <h2>내 랭킹</h2>
        <div v-if="myCoinRow" class="my-rank-card">
          <div class="my-rank-info">
            <div class="my-rank-number">{{ myCoinRow.rank }}</div>
            <div class="my-rank-details">
              <h3>{{ myCoinRow.nickname }}</h3>
              <p>총 {{ myCoinRow.challengeCount ?? 0 }}개 챌린지 참여</p>
            </div>
          </div>
          <div class="my-rank-score">
            <div class="score">{{ formatCurrency(myCoinRow.cumulativePoint) }}</div>
            <div class="score-label">월 포인트 (성공률 {{ formatRate(myCoinRow.successRate) }})</div>
          </div>
        </div>
        <div v-else class="empty">이번 달 포인트가 아직 없어요. 챌린지에 도전해보세요!</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
  getChallengeDetail,
  getChallengeList,
  getCommonChallengeRank,
  refreshCommonChallengeRank
} from '@/api/challenge/challenge';
import { getCoinRankTop5WithMe } from '@/api/challenge/coinRank';

const auth = useAuthStore();

// ✅ auth.user 기반으로 안전하게 참조
const nickname = computed(() =>
    auth?.user?.nickname || auth?.user?.nickName || '나'
);
const userId = computed(() => auth?.user?.id || null);

// 탭/상태
const activeTab = ref('common');
const isLoading = ref(false);
const lastUpdated = ref(null);

// ---------- 공통 랭킹 ----------
const commonChallenge = ref(null); // { id, title, goalValue }
const commonRankList = ref([]);    // [{ nickname, rank, actualValue }]
const myCommonRow = ref(null);
const totalParticipants = ref(0);
const participating = ref(false);
const notifyEnabled = ref(false);

// 정렬 보정(혹시 백엔드 정렬이 보장되지 않는 경우 대비)
const commonRankListSorted = computed(() =>
    [...commonRankList.value].sort((a, b) => (a.rank || 99999) - (b.rank || 99999))
);

// 게이지 %
const commonProgressPercent = computed(() => {
  const goal = Number(commonChallenge.value?.goalValue || 0);
  const used = Number(myCommonRow.value?.actualValue || 0);
  if (goal <= 0) return 0;
  const p = Math.min(100, Math.max(0, (used / goal) * 100));
  return Math.round(p);
});

const isMe = (row) => {
  if (!row) return false;
  if (row.userId != null && userId.value != null) {
    return Number(row.userId) === Number(userId.value);
  }
  return row.nickname === nickname.value; // 보조
};

const findCurrentCommonChallenge = async () => {
  // 현재 달 진행중 COMMON 챌린지 1개 선택
  try {
    const list = await getChallengeList({ type: 'COMMON', status: 'IN_PROGRESS' });
    if (!Array.isArray(list) || list.length === 0) return null;

    const c = list[0];

    // 필요하면 상세로 확정값을 받기 (participant_count, goal_value 모두)
    const detail = await getChallengeDetail(c.id);

    return {
      id: c?.id,
      title: c?.title,
      goalValue: detail?.goalValue ?? c?.goalValue ?? 0,
      participantCount: detail?.participantCount ?? c?.participantCount ?? 0,
    };
  } catch {
    return null;
  }
};

const loadCommonRank = async () => {
  commonChallenge.value = await findCurrentCommonChallenge();
  if (!commonChallenge.value?.id) {
    // 진행중 공통 챌린지가 없음
    commonRankList.value = [];
    myCommonRow.value = null;
    totalParticipants.value = 0;
    participating.value = false;
    return;
  }

  try {
    const rows = await getCommonChallengeRank(commonChallenge.value.id); // List<ChallengeRankResponseDTO>
    commonRankList.value = Array.isArray(rows) ? rows : [];
    // 화면 표시는 DB 기준으로
    totalParticipants.value = Number(commonChallenge.value.participantCount ?? 0);

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
    await refreshCommonChallengeRank(commonChallenge.value.id); // 서버 재계산
  } catch {
    // 재계산 실패해도 기존 값 표시
  }
  await loadCommonRank();
};

// ---------- 코인 랭킹 ----------
const coinRows = ref([]);  // [{ userId, nickname, rank, cumulativePoint, challengeCount, successRate }]

// Top5는 '랭크값' 기준으로 정확히 상위 5명만
const coinTop5 = computed(() =>
    [...coinRows.value]
        .filter((r) => Number.isInteger(r.rank) && r.rank <= 5)
        .sort((a, b) => a.rank - b.rank)
);

// 내 랭킹은 userId 매칭(없으면 닉네임 보조)
const myCoinRow = computed(() => {
  if (!coinRows.value?.length) return null;
  const byId = coinRows.value.find((r) => r.userId === userId.value);
  if (byId) return byId;
  return coinRows.value.find((r) => r.nickname === nickname.value) || null;
});

const loadCoinRank = async () => {
  const uid = userId.value;
  if (!uid) {
    coinRows.value = [];
    return;
  }
  try {
    const rows = await getCoinRankTop5WithMe(uid); // List<ChallengeCoinRankResponseDTO>
    // successRate, challengeCount 등이 누락될 수 있으니 기본값 보정
    coinRows.value = (rows || []).map((r) => ({
      userId: r.userId ?? null,
      nickname: r.nickname ?? '-',
      rank: Number.isInteger(r.rank) ? r.rank : null,
      cumulativePoint: Number(r.cumulativePoint ?? 0),
      challengeCount: Number(r.challengeCount ?? r.totalChallenges ?? 0),
      successRate: toIntPercent(r.successRate ?? (toIntPercentSafe(r.successCount, r.totalChallenges))),
    }));
  } catch {
    coinRows.value = [];
  }
};

// ---------- 공통 ----------
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
      // 코인 랭킹은 스케줄러가 매일 계산 → 클라에선 재조회만
      await loadCoinRank();
    }
    lastUpdated.value = new Date();
  } finally {
    isLoading.value = false;
  }
};

// 알림(로컬 저장)
const toggleNotify = () => {
  notifyEnabled.value = !notifyEnabled.value;
  localStorage.setItem('common-rank-notify', notifyEnabled.value ? '1' : '0');
};

// 유틸
const formatLastUpdated = (date) =>
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

const formatCurrency = (n) => (Number(n) || 0).toLocaleString();

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
const formatRate = (v) => `${toIntPercent(v)}%`;

// 마운트
onMounted(async () => {
  notifyEnabled.value = localStorage.getItem('common-rank-notify') === '1';
  await loadTab();
});
</script>

<style scoped>
/* (기존 스타일 그대로) */
.challenge-ranking {
  padding: 16px 16px 20px 16px;
  background: var(--color-bg-light);
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 40px;
  padding-bottom: 140px;
  box-sizing: border-box;
}

/* 헤더 */
.ranking-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.ranking-tabs { display:flex; background:white; border-radius:12px; padding:4px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1; margin-right:16px; }
.tab-btn { flex:1; padding:12px 16px; border:none; background:transparent; border-radius:8px; font-size:14px; font-weight:500; color:#666; cursor:pointer; transition:all .2s; }
.tab-btn.active {
  background: linear-gradient(135deg, var(--color-main) 0%, var(--color-main-dark) 100%);
  color:#fff;
}
.refresh-section { display:flex; flex-direction:column; align-items:center; gap:4px; }
.refresh-btn { width:30px; height:30px; border:none; background:linear-gradient(135deg, var(--color-main) 0%, var(--color-main-dark) 100%); border-radius:50%; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; box-shadow:0 2px 8px rgba(107,70,193,0.3); }
.refresh-btn:hover:not(:disabled){ transform:scale(1.05); box-shadow:0 4px 12px rgba(107,70,193,0.4); }
.refresh-btn:disabled { opacity:.6; cursor:not-allowed; }
.last-updated { font-size:10px; color:#666; text-align:center; white-space:nowrap; }

/* 로딩 */
.loading-container { display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:300px; padding:40px 20px; }
.loading-spinner { width:40px; height:40px; border:4px solid #f3f3f3; border-top:4px solid var(--color-main); border-radius:50%; animation:spin 1s linear infinite; margin-bottom:16px; }
@keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
.loading-text { font-size:16px; color:#666; text-align:center; }

/* 공통 랭킹 */
.common-ranking { display:flex; justify-content:center; align-items:flex-start; min-height:60vh; }
.ranking-card { background:var(--color-bg); border-radius:16px; padding:0 24px 32px 24px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); max-width:360px; width:100%; }
.target-section { margin-bottom:24px; }
.target-icon { display:flex; justify-content:center; margin-bottom:16px; }
.ranking-info { margin-bottom:16px; }
.user-name, .total-participants { font-size:16px; color:#333; margin-bottom:8px; }
.total-participants strong { font-weight:700; font-size:24px; }
.rank-position { font-size:48px; font-weight:800; color:#333; margin-bottom:16px; }

.progress-section { margin-top:12px; }
.progress-bar { width:100%; height:8px; background:#fff; border-radius:4px; overflow:hidden; }
.progress-fill { height:100%; background:linear-gradient(to right, var(--color-main), var(--color-main-light)); border-radius:4px; transition:width .3s; }
.progress-labels { display:flex; justify-content:space-between; font-size:12px; color:#666; margin-top:6px; }

.rank-list ul { list-style:none; padding:0; margin:16px 0 0; }
.rank-list li { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f0f0f0; }
.rank-list li.me { background:rgba(255,215,0,0.15); }
.pos { width:48px; font-weight:700; }
.name { flex:1; text-align:left; }
.value { min-width:100px; text-align:right; }
.notify-btn { margin-top:8px; padding:8px 12px; border:1px solid #ddd; border-radius:6px; background:white; }
.bell{ margin-right:6px; }
.notify-hint { font-size:12px; color:#666; margin-top:6px; }

/* 누적 포인트 */
.ranking-list { background:white; border-radius:16px; padding:16px; margin-bottom:24px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
table{ width:100%; border-collapse:collapse; }
th,td{ padding:8px; border-bottom:1px solid #f0f0f0; text-align:left; }
th.right, td.right { text-align:right; }
.empty { color:#777; padding:8px 0; }

.my-ranking { background:white; border-radius:16px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
.my-ranking h2 { font-size:18px; font-weight:700; color:#333; margin-bottom:16px; }
.my-rank-card { display:flex; align-items:center; justify-content:space-between; padding:16px; background:linear-gradient(135deg,#f8f9ff 0%,#f0f4ff 100%); border-radius:12px; border:1px solid #e8f0ff; }
.my-rank-info { display:flex; align-items:center; gap:16px; }
.my-rank-number { width:50px; height:50px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--color-main) 0%, var(--color-main-dark) 100%); border-radius:50%; font-weight:800; color:white; font-size:20px; }
.my-rank-details h3 { font-size:16px; font-weight:600; color:#333; margin:0 0 4px 0; }
.my-rank-details p { font-size:12px; color:#666; margin:0; }
.my-rank-score { text-align:right; }
.my-rank-score .score { font-size:20px; font-weight:800; color:var(--color-main); margin-bottom:2px; }
.my-rank-score .score-label { font-size:10px; color:#666; }
</style>
