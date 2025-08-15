<template>
  <div class="openbanking-layout">
    <!-- 오픈뱅킹 전용 헤더 -->
    <BaseHeader v-if="showHeader">
      <template #right>
        <button
          v-if="showFilterButton"
          class="obmyhome-icon-btn"
          @click="openFilter"
          aria-label="필터"
          title="필터"
        >
          <font-awesome-icon :icon="['fas', 'sliders']" />
        </button>
        <button
          v-if="showRefreshButton"
          class="obmyhome-icon-btn"
          @click="refreshData"
        >
          <font-awesome-icon :icon="['fas', 'sync-alt']" />
        </button>
        <button
          v-if="showAddButton"
          class="obmyhome-icon-btn"
          @click="goToAddAccount"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
        <button
          v-if="showPdfButton"
          class="obmyhome-icon-btn"
          @click="downloadPdf"
        >
          <font-awesome-icon :icon="['fas', 'file-pdf']" />
        </button>
      </template>
    </BaseHeader>

    <!-- 메인 콘텐츠 영역 -->
    <main class="openbanking-content">
      <router-view />
    </main>

    <!-- 하단 네비게이션 (특정 페이지에서만 표시) -->
    <Navbar v-if="showNavbar" />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSyncAlt,
  faPlus,
  faSliders,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import Navbar from '@/components/Navbar.vue';
import { watch, onMounted, onUnmounted } from 'vue';

// FontAwesome 아이콘 등록
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faSyncAlt, faPlus, faSliders, faFilePdf);

const route = useRoute();
const router = useRouter();

// 헤더를 숨길 라우트들
const hideHeaderRoutes = [];

// 네비게이션을 숨길 라우트들
const hideNavbarRoutes = [
  'AccountAgreement',
  'AccountLinkSelect',
  'ObAgreement',
  'OpenBankingAgreement',
  'ObArsAgreement',
  'CreateCertificate',
  'SetCertificatePassword',
  'ConfirmCertificatePassword',
  'CertificateComplete',
];

watch(
  () => route.name,
  (name) => {
    const whitePages = new Set([
      'OpenbankingCalendar',
      'CalendarDetail',
      'CalendarSelect',
    ]);
    document.body.classList.toggle(
      'ob-white-page',
      whitePages.has(String(name))
    );
  },
  { immediate: true }
);
onUnmounted(() => document.body.classList.remove('ob-white-page'));

// 헤더 표시 여부
const showHeader = computed(() => {
  return !hideHeaderRoutes.includes(route.name);
});

// 네비게이션 표시 여부
const showNavbar = computed(() => {
  return !hideNavbarRoutes.includes(route.name);
});

// 필터 버튼 표시 여부
const showFilterButton = computed(() => {
  return ['AccountDetail', 'CardDetail'].includes(route.name);
});

// 새로고침 버튼 표시 여부
const showRefreshButton = computed(() => {
  return route.name === 'OpenBankingMyHome';
});

// 추가 버튼 표시 여부
const showAddButton = computed(() => {
  return route.name === 'OpenBankingMyHome';
});

// PDF 다운로드 버튼 표시 여부
const showPdfButton = computed(() => {
  return route.name === 'OpenbankingMonthlyReport';
});

// 필터 열기
const openFilter = () => {
  window.dispatchEvent(new CustomEvent('open-filter-modal'));
  console.log('필터 모달 열기');
};

// 새로고침 기능
const refreshData = () => {
  // 이벤트를 emit하여 자식 컴포넌트에서 처리
  window.dispatchEvent(new CustomEvent('refresh-openbanking-data'));
  console.log('오픈뱅킹 데이터 새로고침');
};

// 계좌 추가 페이지로 이동
const goToAddAccount = () => {
  router.push('/openbanking/account-link-select');
};

// PDF 다운로드 기능
const downloadPdf = () => {
  window.dispatchEvent(new CustomEvent('download-monthly-pdf'));
  console.log('월간 리포트 PDF 다운로드');
};
</script>

<style scoped>
.openbanking-layout {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-light);
  font-family: 'Noto Sans KR', sans-serif;
  position: relative;
}

.openbanking-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding-top: 80px;
  padding-bottom: 80px;
}

/* 반응형 디자인 */
@media (max-width: 430px) {
  .openbanking-layout {
    width: 100vw;
    max-width: 100vw;
  }
}

/* 헤더 버튼 스타일 */
.obmyhome-icon-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #4318d1;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}
</style>
