<template>
  <div class="challenge-ranking">
    <div class="ranking-header">
      <div class="ranking-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'common' }"
          @click="activeTab = 'common'"
        >
          공통 랭킹
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'personal' }"
          @click="activeTab = 'personal'"
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

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">랭킹 데이터를 불러오는 중...</p>
    </div>

    <!-- 공통 랭킹 화면 -->
    <div v-else-if="activeTab === 'common'" class="common-ranking">
      <div class="ranking-card">
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
          <div class="user-name">김철수님은 현재</div>
          <div class="total-participants"><strong>1,000,000</strong> 명 중</div>
          <div class="rank-position">1등</div>
        </div>

        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 75%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 개인 랭킹 화면 -->
    <div v-else-if="activeTab === 'personal'">
      <div class="ranking-list">
        <div
          v-for="(challenge, index) in rankingData"
          :key="challenge.id"
          class="ranking-item"
          :class="{ 'top-three': index < 3 }"
        >
          <div
            class="rank-number"
            :class="{
              'top-rank': index < 3,
              'rank-1': index === 0,
              'rank-2': index === 1,
              'rank-3': index === 2,
            }"
          >
            <span v-if="index >= 3">{{ index + 1 }}</span>
            <img
              v-if="index === 0"
              src="@/assets/challenge/금메달.png"
              alt="금메달"
              class="medal-image"
            />
            <img
              v-if="index === 1"
              src="@/assets/challenge/은메달.png"
              alt="은메달"
              class="medal-image"
            />
            <img
              v-if="index === 2"
              src="@/assets/challenge/동메달.png"
              alt="동메달"
              class="medal-image"
            />
          </div>
          <div class="challenge-info">
            <h3 class="user-nickname">{{ challenge.nickname }}</h3>
            <div class="challenge-stats">
              <span class="participants"
                >{{ challenge.participants }}명 참여</span
              >
              <span class="progress">진행률 {{ challenge.progress }}%</span>
            </div>
          </div>
          <div class="challenge-score">
            <div class="score">{{ challenge.score.toLocaleString() }}</div>
            <div class="score-label">점수</div>
          </div>
        </div>
      </div>

      <div class="my-ranking">
        <h2>내 랭킹</h2>
        <div class="my-rank-card">
          <div class="my-rank-info">
            <div class="my-rank-number">15</div>
            <div class="my-rank-details">
              <h3>내가 참여한 챌린지</h3>
              <p>총 3개 챌린지 참여 중</p>
            </div>
          </div>
          <div class="my-rank-score">
            <div class="score">2,450</div>
            <div class="score-label">점수</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeTab = ref('common');
const isLoading = ref(false);
const lastUpdated = ref(null);

const rankingData = ref([
  {
    id: 1,
    nickname: '김민서',
    participants: 156,
    progress: 85,
    score: 8450,
  },
  {
    id: 2,
    nickname: '이영희',
    participants: 142,
    progress: 72,
    score: 7890,
  },
  {
    id: 3,
    nickname: '박민수',
    participants: 98,
    progress: 65,
    score: 6720,
  },
  {
    id: 4,
    nickname: '최지영',
    participants: 87,
    progress: 58,
    score: 5430,
  },
  {
    id: 5,
    nickname: '홍길동',
    participants: 87,
    progress: 58,
    score: 4239,
  },
]);

// 랭킹 데이터 불러오기 함수
const fetchRankingData = async () => {
  isLoading.value = true;

  try {
    // 실제로는 API 호출
    // const response = await fetch('/api/challenge/ranking');
    // const data = await response.json();
    // rankingData.value = data;

    // 시뮬레이션을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 랜덤하게 데이터 업데이트 (실제로는 API에서 받은 데이터)
    rankingData.value = rankingData.value.map((item) => ({
      ...item,
      score: Math.floor(Math.random() * 5000) + 3000,
      progress: Math.floor(Math.random() * 40) + 50,
    }));

    // 업데이트 시간 기록
    lastUpdated.value = new Date();

    console.log('랭킹 데이터 새로고침 완료');
  } catch (error) {
    console.error('랭킹 데이터 로드 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 새로고침 함수
const refreshData = () => {
  fetchRankingData();
};

// 마지막 업데이트 시간 포맷팅 함수
const formatLastUpdated = (date) => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// 컴포넌트 마운트 시 초기 데이터만 설정 (자동 새로고침 없음)
onMounted(() => {
  // 초기 데이터는 이미 rankingData에 설정되어 있으므로 추가 로드 불필요
  // 사용자가 수동으로 새로고침 버튼을 눌러야만 데이터가 업데이트됨
});
</script>

<style scoped>
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

/* 헤더 스타일 */
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
  transition: all 0.2s ease;
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

.refresh-btn i {
  font-size: 16px;
}

.refresh-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.last-updated {
  font-size: 10px;
  color: #666;
  text-align: center;
  white-space: nowrap;
}

/* 로딩 스타일 */
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

/* 공통 랭킹 스타일 */
.common-ranking {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.ranking-card {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 0px 24px 32px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  width: 100%;
}

.target-section {
  margin-bottom: 24px;
}

.target-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.target {
  position: relative;
  width: 80px;
  height: 80px;
}

.target-rings {
  position: relative;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid #fff;
}

.ring.outer {
  width: 100%;
  height: 100%;
  background: #ff6b6b;
  border-color: #ff5252;
}

.ring.middle {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  background: #fff;
  border-color: #ff6b6b;
}

.ring.inner {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  background: #ff6b6b;
  border-color: #ff5252;
}

.bullseye {
  position: absolute;
  width: 20%;
  height: 20%;
  top: 40%;
  left: 40%;
  background: #ff5252;
  border-radius: 50%;
}

.arrow {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 40px;
  background: linear-gradient(to bottom, #ffd700, #ffed4e);
  border-radius: 2px;
}

.arrow::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -4px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #ffd700;
}

.ranking-info {
  margin-bottom: 24px;
}

.user-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.total-participants {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.total-participants strong {
  font-weight: bold;
  font-size: 24px;
}

.rank-position {
  font-size: 52px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.progress-section {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #fff;
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
  color: white;
}

.ranking-list {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item:hover {
  background: #f8f9fa;
}

.ranking-item.top-three {
  background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
  border-radius: 12px;
  margin-bottom: 8px;
}

.ranking-item.top-three:nth-child(1) {
  background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
}

.ranking-item.top-three:nth-child(2) {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
}

.ranking-item.top-three:nth-child(3) {
  background: linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%);
}

.rank-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f4;
  border-radius: 50%;
  font-weight: bold;
  color: #666;
  margin-right: 16px;
}

.rank-number.top-rank {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-number.rank-1 {
  background: transparent;
}

.rank-number.rank-2 {
  background: transparent;
}

.rank-number.rank-3 {
  background: transparent;
}

.medal-image {
  width: 30px;
  height: 60px;
  object-fit: contain;
}

.challenge-info {
  flex: 1;
  margin-right: 16px;
}

.user-nickname {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.challenge-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.participants,
.progress {
  font-size: 12px;
  color: #666;
}

.challenge-score {
  text-align: center;
  min-width: 60px;
}

.score {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-main);
  margin-bottom: 2px;
}

.score-label {
  font-size: 10px;
  color: #666;
}

.my-ranking {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.my-ranking h2 {
  font-size: 18px;
  font-weight: bold;
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
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-dark) 100%
  );
  border-radius: 50%;
  font-weight: bold;
  color: white;
  font-size: 20px;
}

.my-rank-details h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.my-rank-details p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.my-rank-score {
  text-align: center;
}

.my-rank-score .score {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-main);
  margin-bottom: 2px;
}

.my-rank-score .score-label {
  font-size: 10px;
  color: #666;
}
</style>
