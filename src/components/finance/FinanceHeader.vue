<template>
  <header class="finance-header">
    <div class="header-left">
      <button class="icon-btn" @click="goBack">
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <div class="header-icons">
      <button class="icon-btn" @click="goToDictionary">
        <i class="fas fa-search"></i>
      </button>
      <button class="icon-btn heart-btn" @click="toggleFavorite">
        <i
          :class="['fas', isFavorite ? 'fa-heart' : 'fa-heart']"
          style="color: #e25a5a"
        ></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isFavorite = ref(true); // 하트 활성화 여부(임시)

const goBack = () => {
  const currentRoute = router.currentRoute.value.name;
  const query = router.currentRoute.value.query;
  
  // 상세 페이지인 경우 이전 탭으로 이동
  if (currentRoute?.includes('Detail')) {
    const fromTab = query.from || '전체 보기'; // 기본값은 전체 보기
    
    if (currentRoute === 'DepositDetail') {
      router.push({ 
        path: '/finance/deposit', 
        query: { tab: fromTab }
      });
    } else if (currentRoute === 'InstallmentDetail') {
      router.push({ 
        path: '/finance/installment', 
        query: { tab: fromTab }
      });
    } else if (currentRoute === 'FundDetail') {
      router.push({ 
        path: '/finance/fund', 
        query: { tab: fromTab }
      });
    } else if (currentRoute === 'StockDetail') {
      router.push({ 
        path: '/finance/stock', 
        query: { tab: fromTab }
      });
    } else {
      // 알 수 없는 상세 페이지인 경우 이전 페이지로
      router.back();
    }
  } else {
    // 메인 금융 페이지인 경우 홈으로 이동
    router.push('/');
  }
};
const goToDictionary = () => {
  router.push('/dictionary');
};
const toggleFavorite = () => {
  router.push('/finance/favorite-products');
};
</script>

<style scoped>
.finance-header {
  width: 100%;
  max-width: 390px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg-light);
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  padding: 6px;
}

.header-icons {
  display: flex;
  gap: 12px;
}

.heart-btn i {
  color: #e25a5a;
  font-size: 20px;
}
</style>
