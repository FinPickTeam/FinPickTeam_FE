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
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        @click="selectCategory(category)"
      >
        <div class="category-icon">
          <img :src="getCategoryLogo(category.logo)" :alt="category.name" />
        </div>
        <span class="category-name">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { patchLedgerCategory } from '@/api/openbanking/transactionApi';

library.add(faAngleLeft);

const router = useRouter();
const route = useRoute();

// 카테고리 데이터
const categories = [
  {
    name: '식비',
    logo: '식비.png',
  },
  {
    name: '교통, 자동차',
    logo: '교통, 자동차.png',
  },
  {
    name: '쇼핑, 미용',
    logo: '쇼핑, 미용.png',
  },
  {
    name: '카페, 간식',
    logo: '카페, 간식.png',
  },
  {
    name: '편의점, 마트, 잡화',
    logo: '편의점, 마트, 잡화.png',
  },
  {
    name: '주거, 통신',
    logo: '주거, 통신.png',
  },
  {
    name: '취미, 여가',
    logo: '취미, 여가.png',
  },
  {
    name: '보험, 기타 금융',
    logo: '보험, 기타 금융.png',
  },
  {
    name: '구독',
    logo: '구독.png',
  },
  {
    name: '이체',
    logo: '이체.png',
  },
  {
    name: '기타',
    logo: '기타.png',
  },
  {
    name: '카테고리 없음',
    logo: '카테고리 없음.png',
  },
];

// 카테고리 로고 이미지를 동적으로 import하기 위한 함수
const getCategoryLogo = (logoFileName) => {
  try {
    return new URL(`/src/assets/spending_logo/${logoFileName}`, import.meta.url)
      .href;
  } catch (error) {
    // 로고 파일을 찾을 수 없는 경우 기본 로고 반환
    return new URL(
      `/src/assets/spending_logo/카테고리 없음.png`,
      import.meta.url
    ).href;
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.back();
};

// 카테고리 이름 → 서버 카테고리 코드/ID 매핑 (백엔드 정의에 맞게 수정 가능)
const categoryMap = {
  식비: 'FOOD',
  '교통, 자동차': 'TRANSPORT',
  '쇼핑, 미용': 'SHOPPING',
  '카페, 간식': 'CAFE',
  '편의점, 마트, 잡화': 'MART',
  '주거, 통신': 'HOUSING',
  '취미, 여가': 'LEISURE',
  '보험, 기타 금융': 'INSURANCE',
  구독: 'SUBSCRIPTION',
  이체: 'TRANSFER',
  기타: 'ETC',
  '카테고리 없음': 'UNCATEGORIZED',
};

// 카테고리 선택 함수
const selectCategory = async (category) => {
  console.log('선택된 카테고리:', category);
  const transactionId = route.query.transactionId;

  if (transactionId) {
    try {
      const mapped = categoryMap[category.name] || category.name;
      await patchLedgerCategory(transactionId, mapped);
    } catch (e) {
      console.error('카테고리 수정 실패:', e);
    }
  }

  router.back();
};
</script>

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
