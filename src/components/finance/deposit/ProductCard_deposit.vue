<!-- 상품 카드 컴포넌트 -->
<template>
  <div class="product-card" @click="goToDetail">
    <!-- 은행 로고 -->
    <div class="bank-logo">
      <img
        :src="getLogoUrl(product.depositBankName)"
        :alt="`${product.depositBankName} 로고`"
        class="logo-img"
      />
    </div>
    <!-- 텍스트 정보 -->
    <div class="card-main">
      <div class="card-title-row">
        <span class="product-title">{{ product.depositProductName }}</span>
        <span
          class="heart"
          :class="{ active: isFavorite }"
          @click.stop="toggleFavorite"
          >♥</span
        >
      </div>
      <div class="product-summary">{{ product.depositSummary }}</div>
      <div class="product-info-row">12개월 기준</div>
      <div class="rate-row">
        <span class="max-rate">최고 연 {{ product.depositMaxRate }}%</span>
        <span class="basic-rate">기본 연 {{ product.depositBasicRate }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite.js';

const props = defineProps({
  product: Object,
});

const router = useRouter();
const favoriteStore = useFavoriteStore();
const isFavorite = computed(() => favoriteStore.isFavorite(props.product));

function toggleFavorite() {
  if (isFavorite.value) {
    favoriteStore.removeFavorite(props.product);
  } else {
    favoriteStore.addFavorite(props.product);
  }
}

function goToDetail() {
  router.push(`/finance/deposit/${props.product.id}`);
}

const bankLogoMap = {
  국민은행: 'KB국민은행.png',
  농협은행: 'NH농협은행.png',
  IBK기업은행: 'IBK기업은행.png',
  한국산업은행: 'KDB산업은행.png',
  SC제일은행: 'SC제일은행.png',
  수협은행: '수협은행.png',
  우리은행: '우리은행.png',
  하나은행: '하나은행.png',
  카카오뱅크: '카카오뱅크.png',
  케이뱅크: '케이뱅크.png',
  토스뱅크: '토스뱅크.png',
  IM뱅크: 'iM뱅크.png',
  광주은행: '광주은행.png',
  전북은행: '전북은행.png',
  신한은행: '신한은행.png',
  제주은행: '제주은행.png',
  경남은행: '경남은행.png',
  부산은행: '부산은행.png',
};

const getLogoUrl = (bankName) => {
  const fileName = bankLogoMap[bankName];
  if (!fileName) {
    return new URL('../../../assets/bank_logo/KB국민은행.png', import.meta.url)
      .href;
  }
  return new URL(`../../../assets/bank_logo/${fileName}`, import.meta.url).href;
};
</script>

<style scoped>
.product-card {
  position: relative;
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #0002;
  padding: 8px 20px 10px 54px;
  width: 350px;
  font-family: var(--font-main);
  margin-bottom: 10px;
}
.bank-logo {
  position: absolute;
  left: 10px;
  top: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
}
.card-main {
  min-width: 0;
}
.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -4px;
}
.product-title {
  font-size: var(--font-size-title-sub);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
.heart {
  color: var(--color-bg-accent);
  font-size: 32px;
  cursor: pointer;
  margin-left: 8px;
  user-select: none;
  transition: color 0.2s;
}
.heart.active {
  color: #e11d48;
}
.product-summary {
  font-size: var(--font-size-body);
  color: var(--color-text-light);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.product-info-row {
  font-size: var(--font-size-body);
  color: #8e74e3;
  margin-bottom: 2px;
  margin-top: 2px;
}
.rate-row {
  display: flex;
  gap: 16px;
  align-items: baseline;
  margin-top: 2px;
}
.max-rate {
  color: var(--color-main-light);
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-bold);
}
.basic-rate {
  color: var(--color-main-light);
  font-size: var(--font-size-body-large);
  font-weight: var(--font-weight-medium);
}
</style>
