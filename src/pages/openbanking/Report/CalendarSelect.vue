<template>
  <div class="category-select-container">
    <!-- 상단 헤더 -->
    <div class="category-header">
      <button class="back-button" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
    </div>

    <!-- 제목 섹션 -->
    <div class="title-section">
      <h1>
        <span class="highlight">변경할 카테고리</span
        ><span class="normal">를</span>
      </h1>
      <p class="normal">선택해주세요.</p>
    </div>

    <!-- 카테고리 그리드 -->
    <div class="category-grid">
      <div
        v-for="c in categories"
        :key="c.id"
        class="category-item"
        @click="selectCategory(c)"
      >
        <div class="category-icon">
          <img :src="getLogo(c.name)" :alt="c.name" />
        </div>
        <span class="category-name">{{ c.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { patchLedgerCategory } from '@/api/openbanking/ledgerApi.js';
import { categoryToLogo } from '@/components/openbanking/categoryLogo.js';

library.add(faAngleLeft);

const router = useRouter();
const route = useRoute();

const getLogo = (name) => categoryToLogo(name);

// DB 기준 카테고리 ID/라벨 (스크린샷 기준)
const categories = [
  { id: 1, name: '식비' },
  { id: 2, name: '카페, 간식' }, // DB: 카페/간식
  { id: 3, name: '쇼핑, 미용' }, // DB: 쇼핑/미용
  { id: 4, name: '편의점, 마트, 잡화' }, // DB: 편의점/마트/잡화
  { id: 5, name: '주거, 통신' }, // DB: 주거/통신
  { id: 6, name: '취미, 여가' }, // DB: 취미/여가
  { id: 7, name: '교통, 자동차' }, // DB: 교통/자동차
  { id: 8, name: '보험, 기타 금융' }, // DB: 보험 및 기타 금융
  { id: 9, name: '구독' },
  { id: 10, name: '이체' },
  { id: 11, name: '기타' },
  { id: 12, name: '카테고리 없음' },
];

const goBack = () => router.back();

const selectCategory = async (c) => {
  const ledgerId = route.query.transactionId;
  if (!ledgerId) return;
  try {
    await patchLedgerCategory(ledgerId, c.id); // body: {categoryId: number}
    // 상세화면 onActivated에서 바로 반영되도록 저장
    sessionStorage.setItem(`transaction_${ledgerId}_category`, c.name);
  } catch (e) {
    console.error('카테고리 수정 실패:', e);
  } finally {
    router.back();
  }
};
</script>

<!-- 스타일은 네가 준 그대로 유지 -->

<style scoped>
.category-select-container {
  width: 390px;
  margin: 0 auto;
  background: #f3f4f6;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 상단 헤더 */
.category-header {
  background: #f3f4f6;
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: none;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.back-button:hover {
  background: #f3f3f3;
}

/* 제목 섹션 */
.title-section {
  background: #f3f4f6;
  padding: 20px 16px 16px 16px;
  text-align: left;
  border-bottom: none;
}

.title-section h1 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.title-section .highlight {
  color: #8b5cf6;
}

.title-section .normal {
  color: #222;
  font-weight: 400;
  font-size: 1.2rem;
}

.title-section p {
  font-size: 1.2rem;
  color: #222;
  margin: 0;
  line-height: 1.2;
}

/* 카테고리 그리드 */
.category-grid {
  flex: 1;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 16px 8px;
  background: #fff;
  border-radius: 12px;
  transition: background 0.15s;
  box-shadow: none;
  aspect-ratio: 1;
  justify-content: center;
}

.category-item:hover {
  background: #f8f9fa;
}

.category-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.category-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: #222;
  text-align: center;
  line-height: 1.2;
  word-break: keep-all;
  max-width: 100%;
}

/* 반응형 디자인 */
@media (max-width: 390px) {
  .category-select-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
