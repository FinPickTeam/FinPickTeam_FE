<template>
  <div class="openbanking-layout">
    <!-- 오픈뱅킹 전용 헤더 -->
    <BaseHeader v-if="showHeader">
      <template #right>
        <button v-if="showFilterButton" class="obmyhome-icon-btn" @click="openFilter" aria-label="필터" title="필터">
          <font-awesome-icon :icon="['fas', 'sliders']" />
        </button>
        <button v-if="showRefreshButton" class="obmyhome-icon-btn" @click="refreshData">
          <font-awesome-icon :icon="['fas', 'sync-alt']" />
        </button>
        <button v-if="showAddButton" class="obmyhome-icon-btn" @click="goToAddAccount">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
        <button v-if="showPdfButton" class="obmyhome-icon-btn" @click="downloadPdf">
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
import { computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSyncAlt, faPlus, faSliders, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import Navbar from '@/components/Navbar.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faSyncAlt, faPlus, faSliders, faFilePdf);

const route = useRoute();
const router = useRouter();

const hideHeaderRoutes = [];
const hideNavbarRoutes = [
  'AccountAgreement','AccountLinkSelect','ObAgreement','OpenBankingAgreement',
  'ObArsAgreement','CreateCertificate','SetCertificatePassword','ConfirmCertificatePassword','CertificateComplete',
];

watch(() => route.name, (name) => {
  const whitePages = new Set(['OpenbankingCalendar','CalendarDetail','CalendarSelect']);
  document.body.classList.toggle('ob-white-page', whitePages.has(String(name)));
}, { immediate: true });
onUnmounted(() => document.body.classList.remove('ob-white-page'));

const showHeader = computed(() => !hideHeaderRoutes.includes(route.name));
const showNavbar = computed(() => !hideNavbarRoutes.includes(route.name));
const showFilterButton = computed(() => ['AccountDetail','CardDetail'].includes(route.name));
const showRefreshButton = computed(() => route.name === 'OpenBankingMyHome');
const showAddButton = computed(() => route.name === 'OpenBankingMyHome');
const showPdfButton = computed(() => route.name === 'OpenbankingMonthlyReport');

const openFilter = () => window.dispatchEvent(new CustomEvent('open-filter-modal'));
const refreshData = () => window.dispatchEvent(new CustomEvent('refresh-openbanking-data'));
const goToAddAccount = () => router.push('/openbanking/account-link-select');
const downloadPdf = () => window.dispatchEvent(new CustomEvent('download-monthly-pdf'));
</script>

<style scoped>
.openbanking-layout { height: 100dvh; display: flex; flex-direction: column; background: var(--color-bg-light); position: relative; }
.openbanking-content { flex: 1 1 auto; min-height: 0; overflow: hidden; padding-top: 80px; padding-bottom: 80px; }
@media (max-width: 430px) { .openbanking-layout { width: 100vw; max-width: 100vw; } }
.obmyhome-icon-btn { background: none; border: none; font-size: 24px; color: #4318d1; cursor: pointer; padding: 8px; border-radius: 8px; transition: background .15s; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; }
</style>
