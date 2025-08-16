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
          v-if="showDeleteButton"
          class="obmyhome-icon-btn"
          @click="toggleDeleteMode"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
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
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSyncAlt,
  faPlus,
  faSliders,
  faFilePdf,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faSyncAlt, faPlus, faSliders, faFilePdf, faTrash);
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import Navbar from '@/components/Navbar.vue';

import { exportMonthReportPdf } from '@/api/openbanking/monthReportApi.js';
import { syncAllAccounts } from '@/api/openbanking/accountsApi';
import { syncAllCards } from '@/api/openbanking/cardsApi';
import { getAccountsWithTotal } from '@/api/openbanking/accountsApi';
import { getCardsWithTotal } from '@/api/openbanking/cardsApi';
import {
  getAssetTotal,
  getAssetSummaryCompare,
  getMonthlySpending,
} from '@/api/openbanking/assetSummaryApi.js';

const route = useRoute();
const router = useRouter();

const ym = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const currentMonth = computed(() => String(route.query.month ?? ym()));

// ----- UI 표시 로직 그대로 -----
const hideHeaderRoutes = [];
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
const showHeader = computed(() => !hideHeaderRoutes.includes(route.name));
const showNavbar = computed(() => !hideNavbarRoutes.includes(route.name));
const showFilterButton = computed(() =>
  ['AccountDetail', 'CardDetail'].includes(route.name)
);
const showDeleteButton = computed(() =>
  ['AccountList', 'CardList'].includes(route.name)
);
const showRefreshButton = computed(() =>
  ['OpenBankingMyHome', 'OpenbankingCalendar', 'CalendarDetail'].includes(
    route.name
  )
);
const showAddButton = computed(() =>
  [
    'OpenBankingMyHome',
    'AccountList',
    'CardList',
    'AccountDetail',
    'CardDetail',
    'OpenbankingCalendar',
    'CalendarDetail',
  ].includes(route.name)
);
const showPdfButton = computed(() => route.name === 'OpenbankingMonthlyReport');

// 배경 흰 화면 토글 유지
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

// ----- 액션들 교체 -----
const openFilter = () => {
  window.dispatchEvent(new CustomEvent('open-filter-modal'));
};

const downloading = ref(false);
const downloadPdf = async () => {
  if (downloading.value) return;
  downloading.value = true;
  try {
    const { blob, filename } = await exportMonthReportPdf({
      month: currentMonth.value, // 없으면 서버 default 쓰게 하고 싶으면 제거
      format: 'pdf',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `monthreport-${currentMonth.value}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('PDF 다운로드 실패', e);
    alert('PDF 다운로드에 실패했어요.');
  } finally {
    downloading.value = false;
  }
};

const refreshing = ref(false);
const refreshData = async () => {
  if (refreshing.value) return;
  refreshing.value = true;
  try {
    // 1) 싱크를 병렬로 싹 돌림
    await Promise.allSettled([syncAllAccounts(), syncAllCards()]);

    // 2A) 각 페이지가 자기 데이터 다시 불러오도록 기존 이벤트 한번 쏘고 끝 (가장 적은 수정)
    window.dispatchEvent(new CustomEvent('refresh-openbanking-data'));
  } catch (e) {
    console.error('새로고침 실패', e);
    alert('데이터 동기화에 실패했어요.');
  } finally {
    refreshing.value = false;
  }
};

// delete-mode toggle
const toggleDeleteMode = () => {
  window.dispatchEvent(new CustomEvent('toggle-delete-mode'));
};

const goToAddAccount = () => router.push('/openbanking/account-link-select');
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
  color: var(--color-main);
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
