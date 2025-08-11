<template>
  <div class="profile-complete-container">
    <!-- 상단 로고 -->
    <div class="logo-section">
      <h1 class="logo-title">FinPick</h1>
      <p class="logo-subtitle">금융 생활의 새로운 시작</p>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <!-- 투자성향 분석 결과 카드 -->
      <div class="result-main-card">
        <div class="card-header">
          <h2 class="card-title">투자 성향 분석 결과</h2>
          <div class="card-icon"></div>
        </div>

        <div class="investment-result">
          <h3 class="investment-type-title">{{ investmentType }}</h3>
          <p class="investment-subtitle">{{ investmentDescription }}</p>
        </div>
      </div>

      <!-- 투자 성향 요약 -->
      <div class="summary-section">
        <h4 class="summary-title">투자 성향 요약</h4>
        <div class="summary-content">
          <p>{{ detailedDescription }}</p>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="action-section">
      <button class="start-btn" @click="goToHome">핀픽 시작하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 사용자 이름 (실제로는 props나 store에서 가져올 수 있음)
const userName = ref('금맹정음');

// 투자성향 결과 데이터
const investmentType = ref('안정형');
const investmentDescription = ref('안정적인 수익을 추구하는 투자자');
const detailedDescription = ref(
  '원금 손실 위험을 최소화하면서 안정적인 수익을 추구합니다. 예금, 적금, 국채 등 안전한 금융상품을 선호하며, 장기적 관점에서 꾸준한 자산 증식을 목표로 합니다.'
);

// 컴포넌트 마운트 시 사용자 이름 설정
onMounted(() => {
  // URL 파라미터나 쿼리에서 사용자 이름을 가져올 수 있음
  if (route.query.userName) {
    userName.value = route.query.userName;
  }

  // 실제로는 투자성향 분석 결과를 API에서 가져와야 함
  // 임시로 랜덤한 투자성향 결과 설정
  const types = [
    {
      type: '안정형',
      desc: '안정적인 수익을 추구하는 투자자',
      detail:
        '원금 손실 위험을 최소화하면서 안정적인 수익을 추구합니다. 예금, 적금, 국채 등 안전한 금융상품을 선호하며, 장기적 관점에서 꾸준한 자산 증식을 목표로 합니다.',
    },
    {
      type: '안정추구형',
      desc: '약간의 위험을 감수하는 투자자',
      detail:
        '적당한 위험을 감수하고 안정적인 수익을 추구합니다. 혼합형 펀드, 회사채 등에 투자하며, 안정성과 수익성의 균형을 중시합니다.',
    },
    {
      type: '위험중립형',
      desc: '균형 잡힌 포트폴리오를 선호하는 투자자',
      detail:
        '위험과 수익의 균형을 추구하며, 다양한 자산에 분산투자를 선호합니다. 주식과 채권을 적절히 혼합한 포트폴리오를 구성합니다.',
    },
    {
      type: '적극투자형',
      desc: '높은 수익을 위해 위험을 감수하는 투자자',
      detail:
        '높은 수익을 위해 상당한 위험을 감수할 의향이 있습니다. 주식, 주식형 펀드 등 위험도가 높은 상품에 적극 투자합니다.',
    },
    {
      type: '공격투자형',
      desc: '최고 수익을 추구하는 투자자',
      detail:
        '최대 수익을 위해 높은 위험을 기꺼이 감수합니다. 개별 주식, 파생상품 등 고위험 고수익 상품을 선호하며, 시장 변동성을 기회로 활용합니다.',
    },
  ];

  const randomType = types[Math.floor(Math.random() * types.length)];
  investmentType.value = randomType.type;
  investmentDescription.value = randomType.desc;
  detailedDescription.value = randomType.detail;
});

// 홈으로 이동
const goToHome = () => {
  const from = route.query.from || 'signup';
  if (from === 'mypage') {
    router.push('/mypage');
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
.profile-complete-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 16px 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

/* 상단 로고 섹션 */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-title {
  color: #4318d1;
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 8px;
}

.logo-subtitle {
  color: #888;
  font-size: 15px;
  text-align: center;
  font-weight: 400;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: 0;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

/* 메인 결과 카드 */
.result-main-card {
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: relative;
}

.card-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
}

.investment-result {
  text-align: left;
}

.investment-type-title {
  color: white;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.investment-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}

/* 요약 섹션 */
.summary-section {
  margin-bottom: 40px;
}

.summary-title {
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.summary-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-content p {
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  text-align: left;
}

/* 액션 버튼 섹션 */
.action-section {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 24px;
}

.start-btn {
  width: 100%;
  background: linear-gradient(
    to right,
    var(--color-main-light-2),
    var(--color-main-dark)
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.start-btn:active {
  transform: translateY(0);
}
</style>
