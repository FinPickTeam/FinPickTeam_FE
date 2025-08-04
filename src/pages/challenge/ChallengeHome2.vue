<template>
  <div class="challenge-home">
    <div class="header-section">
      <!-- 사용자 인사말 -->
      <div class="greeting-section">
        <div class="greeting">
          안녕하세요, <span class="username">사용자님!</span>
        </div>
      </div>

      <!-- 사용자 통계 섹션 -->
      <div class="stats-section">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number">10</div>
            <div class="stat-label">회</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">8</div>
            <div class="stat-label">회</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">80</div>
            <div class="stat-label">%</div>
          </div>
        </div>
        <div class="pagination-dots">
          <div class="dot active"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>

    <!-- 참여중인 소그룹 섹션 -->
    <div class="participating-section">
      <div class="section-header">
        <i class="fas fa-calendar section-icon"></i>
        <RouterLink to="/challenge2/joined-list" class="section-title-link">
          <h3 class="section-title">참여중인 챌린지</h3>
        </RouterLink>
      </div>
      <div class="challenges-scroll">
        <div class="challenge-card">
          <h4 class="challenge-title">이번 달 외식 10번 이하로 하기</h4>
          <div class="challenge-date">2025.07.01 ~ 07.31</div>
          <div class="challenge-progress">진행률 70%</div>
        </div>
        <div class="challenge-card">
          <h4 class="challenge-title">일주일에 3번 이상 운동하기</h4>
          <div class="challenge-date">2025.07.01 ~ 07.31</div>
          <div class="challenge-progress">진행률 85%</div>
        </div>
        <div class="challenge-card">
          <h4 class="challenge-title">하루 8시간 이상 수면하기</h4>
          <div class="challenge-date">2025.07.01 ~ 07.31</div>
          <div class="challenge-progress">진행률 60%</div>
        </div>
      </div>
    </div>

    <!-- HOT 챌린지 섹션 -->
    <div class="hot-challenges-section">
      <div class="section-header">
        <i class="fas fa-search section-icon"></i>
        <RouterLink to="/challenge2/recruiting-list" class="section-title-link">
          <h3 class="section-title">현재 HOT 한 챌린지</h3>
        </RouterLink>
      </div>
      <div class="challenges-scroll">
        <div class="challenge-card hot">
          <div class="hot-banner">
            <i class="fas fa-fire"></i>
            <span>HOT</span>
          </div>
          <h4 class="challenge-title">커피 5회 이하 마시기</h4>
          <div class="challenge-date">2020.00.00 - 11.31</div>
          <div class="challenge-participants">(4명 / 5명)</div>
          <button class="participate-btn">참여하러 가기</button>
        </div>
        <div class="challenge-card hot">
          <div class="hot-banner">
            <i class="fas fa-fire"></i>
            <span>HOT</span>
          </div>
          <h4 class="challenge-title">커피 5회 이하 마시기</h4>
          <div class="challenge-date">2020.00.00 - 11.31</div>
          <div class="challenge-participants">(4명 / 5명)</div>
          <button class="participate-btn">참여하러 가기</button>
        </div>
        <div class="challenge-card hot">
          <div class="hot-banner">
            <i class="fas fa-fire"></i>
            <span>HOT</span>
          </div>
          <h4 class="challenge-title">커피 5회 이하 마시기</h4>
          <div class="challenge-date">2020.00.00 - 11.31</div>
          <div class="challenge-participants">(4명 / 5명)</div>
          <button class="participate-btn">참여하러 가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 필요한 로직이 있다면 여기에 추가
</script>

<style scoped>
.challenge-home {
  padding: 0;
  background: var(--color-bg-light);
  min-height: 100vh;
}

/* 헤더 섹션 */
.header-section {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to right, #c8c4f8, var(--color-main-dark));
  border-radius: 0;
  padding: 16px 16px 0px 16px;
  margin-bottom: 12px;
  margin-top: -22px;
  margin-left: -16px;
  margin-right: -16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  gap: 16px;
}

.header-icon {
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* 인사말 섹션 */
.greeting-section {
  margin-bottom: 2px;
}

.greeting {
  color: #fff;
  font-size: var(--font-size-title-sub);
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 35px;
}

.username {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-title-main);
}

/* 통계 섹션 */
.stats-section {
  background: transparent;
  border-radius: 16px;
  margin-bottom: 24px;
}

.stats-container {
  display: flex;
  background: #fff;
  border-radius: 18px;
  padding: 30px 30px;
  width: 90%;
  max-width: 320px;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
}

.stat-number {
  font-family: 'JalnanGothic', var(--font-main);
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
  color: #222;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e0e0e0;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.dot.active {
  background: #6b46c1;
}

/* 섹션 공통 스타일 */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 16px;
  color: #6b46c1;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.section-title-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.section-title-link:hover {
  opacity: 0.8;
}

/* 참여중인 소그룹 */
.participating-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

.challenge-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  min-width: 280px;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.challenge-progress {
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
  font-size: 12px;
}

/* HOT 챌린지 */
.hot-challenges-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

.challenges-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.challenge-card.hot {
  min-width: 280px;
  position: relative;
}

.hot-banner {
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 8px 12px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.hot-banner i {
  font-size: 14px;
  color: #ff9800;
}

.challenge-card.hot .challenge-title {
  margin-top: 40px;
}

.challenge-participants {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.participate-btn {
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s ease;
}

.participate-btn:hover {
  transform: translateY(-1px);
}

/* 스크롤바 스타일링 */
.challenges-scroll::-webkit-scrollbar {
  height: 4px;
}

.challenges-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.challenges-scroll::-webkit-scrollbar-thumb {
  background: #6b46c1;
  border-radius: 2px;
}

.challenges-scroll::-webkit-scrollbar-thumb:hover {
  background: #5a3d9e;
}
</style>
