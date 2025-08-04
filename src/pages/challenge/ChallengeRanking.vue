<template>
  <div class="challenge-ranking">
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

    <!-- 공통 랭킹 화면 -->
    <div v-if="activeTab === 'common'" class="common-ranking">
      <div class="ranking-card">
        <div class="target-section">
          <div class="target-icon">
            <div class="target">
              <div class="target-rings">
                <div class="ring outer"></div>
                <div class="ring middle"></div>
                <div class="ring inner"></div>
                <div class="bullseye"></div>
              </div>
              <div class="arrow"></div>
            </div>
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
    <div v-if="activeTab === 'personal'">
      <div class="ranking-list">
        <div
          v-for="(challenge, index) in rankingData"
          :key="challenge.id"
          class="ranking-item"
          :class="{ 'top-three': index < 3 }"
        >
          <div class="rank-number" :class="{ 'top-rank': index < 3 }">
            {{ index + 1 }}
          </div>
          <div class="challenge-info">
            <h3 class="challenge-title">{{ challenge.title }}</h3>
            <div class="challenge-stats">
              <span class="participants"
                >{{ challenge.participants }}명 참여</span
              >
              <span class="progress">진행률 {{ challenge.progress }}%</span>
            </div>
            <div class="challenge-category">
              <span class="category-tag">{{ challenge.category }}</span>
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
import { ref } from 'vue';

const activeTab = ref('common');

const rankingData = ref([
  {
    id: 1,
    title: '일주일에 3번 이상 운동하기',
    participants: 156,
    progress: 85,
    category: '건강',
    score: 8450,
  },
  {
    id: 2,
    title: '하루 8시간 이상 수면하기',
    participants: 142,
    progress: 72,
    category: '건강',
    score: 7890,
  },
  {
    id: 3,
    title: '커피 5회 이하 마시기',
    participants: 98,
    progress: 65,
    category: '라이프스타일',
    score: 6720,
  },
  {
    id: 4,
    title: '매일 독서 30분하기',
    participants: 87,
    progress: 58,
    category: '학습',
    score: 5430,
  },
  {
    id: 5,
    title: '일주일에 2번 이상 요리하기',
    participants: 76,
    progress: 45,
    category: '라이프스타일',
    score: 4210,
  },
  {
    id: 6,
    title: '매일 물 2L 마시기',
    participants: 134,
    progress: 78,
    category: '건강',
    score: 3890,
  },
  {
    id: 7,
    title: '일주일에 1번 이상 정리정돈하기',
    participants: 65,
    progress: 52,
    category: '라이프스타일',
    score: 3450,
  },
  {
    id: 8,
    title: '매일 영어 단어 10개 외우기',
    participants: 89,
    progress: 68,
    category: '학습',
    score: 3120,
  },
]);
</script>

<style scoped>
.challenge-ranking {
  padding: 16px 16px 20px 16px;
  background: var(--color-bg-light);
  min-height: 100vh;
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
  padding: 32px 24px;
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
  font-size: 18px;
}

.rank-position {
  font-size: 32px;
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
  background: linear-gradient(135deg, #b0a8f8, #8b7cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.ranking-tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #fff5f5 0%, #fef7ff 100%);
  border-radius: 12px;
  margin-bottom: 8px;
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
}

.rank-number.top-rank:nth-child(1) {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.rank-number.top-rank:nth-child(2) {
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%);
}

.rank-number.top-rank:nth-child(3) {
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
}

.challenge-info {
  flex: 1;
  margin-right: 16px;
}

.challenge-title {
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

.challenge-category {
  margin-top: 4px;
}

.category-tag {
  background: linear-gradient(
    135deg,
    var(--color-main-light) 0%,
    var(--color-main) 100%
  );
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
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
