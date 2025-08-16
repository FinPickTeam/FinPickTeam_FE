<template>
  <div class="product-card" @click="goToDetail">
    <!-- 상단 헤더 -->
    <div class="card-header">
      <div class="company-info">
        <div class="logo-container">
          <img :src="kbLogo" alt="KB 자산운용" class="kb-logo-img" />
        </div>
        <div class="product-title">{{ fund.fundProductName }}</div>
      </div>
      <div
        class="heart-icon"
        :class="{ active: isFavorite }"
        @click.stop="toggleFavorite"
      >
        ♥
      </div>
    </div>

    <!-- 제품 카테고리 -->
    <div class="product-category">{{ fund.fundProductFeatures }}</div>

    <!-- 수익률 정보 (오른쪽 정렬) -->
    <div class="return-section">
      <div class="return-label">수익률 (기준:3개월)</div>
      <div class="return-value">{{ fund.fund3MonthReturn || 'N/A' }}</div>
    </div>

    <!-- 하단 태그들 -->
    <div class="product-tags">
      <span :class="['tag', typeClass]">{{ fund.fundType }}</span>
      <span :class="['tag', riskClass]">{{ fund.fundRiskLevel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite.js';
import kbLogo from '../../../assets/fund_logo/KB 자산운용.png';

const props = defineProps({
  fund: Object,
});

const emit = defineEmits(['favorite-removed']);

const router = useRouter();
const favoriteStore = useFavoriteStore();
const isFavorite = computed(() => favoriteStore.isFavorite(props.fund));

function goToDetail() {
  // 상품명을 기반으로 상세 페이지로 이동
  const productId = props.fund.id;
  if (productId) {
    router.push(`/finance/fund/${productId}`);
  }
}

function toggleFavorite() {
  console.log('Toggle favorite clicked for fund:', props.fund);
  console.log('Current isFavorite state:', isFavorite.value);

  if (isFavorite.value) {
    console.log('Removing fund from favorites');
    favoriteStore.removeFavorite(props.fund);
    // 부모 컴포넌트로 찜 해제 이벤트 전달
    emit('favorite-removed', props.fund);
  } else {
    console.log('Adding fund to favorites');
    favoriteStore.addFavorite(props.fund);
  }
}
const riskClassMap = {
  '높은 위험': 'risk-high',
  '보통 위험': 'risk-medium',
  '낮은 위험': 'risk-low',
};

const typeClass = 'fund-type';
const riskClass = computed(() => riskClassMap[props.fund?.fundRiskLevel] || '');
</script>

<style scoped>
.product-card {
  padding: 8px 20px 10px 54px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  margin-bottom: 10px;
  background: white;
  box-shadow: 0 2px 8px 0 #0002;
  position: relative;
  width: 350px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -6px;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-container {
  position: absolute;
  left: 10px;
  top: 14px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kb-logo-img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
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

.heart-icon {
  color: var(--color-bg-accent);
  font-size: 26px;
  cursor: pointer;
  margin-left: 8px;
  user-select: none;
  transition: color 0.2s;
}

.heart-icon.active {
  color: #e11d48;
}

.product-category {
  font-size: var(--font-size-body);
  color: var(--color-text-light);
  margin-bottom: -8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.return-section {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.return-label {
  font-size: var(--font-size-body);
  color: #8e74e3;
  font-weight: var(--font-weight-medium);
}

.return-value {
  font-size: var(--font-size-title-main);
  font-weight: var(--font-weight-bold);
  color: var(--color-main-light);
  text-align: right;
  margin-bottom: 2px;
}

.product-tags {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 2px;
}

.tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.fund-type {
  background-color: #7c3aed;
}

.risk-high {
  background-color: #ef4444;
}

.risk-medium {
  background-color: #10b981;
}

.risk-low {
  background-color: #3b82f6;
}
</style>
