<template>
  <div class="main-layout">
    <HeaderBar
      v-if="shouldHideHeader"
      :class="{
        'finance-header': route.name === 'FinanceHome',
        'transparent-header': route.name === 'Home',
      }"
    />
    <main
      :class="[
        'main-content',
        { 'finance-center': route.name === 'FinanceHome' },
        { 'finance-bg': route.name === 'FinanceHome' },
      ]"
    >
      <router-view />
    </main>
    <!-- Navbar는 App.vue에서 고정 렌더 -->
  </div>
</template>

<script setup>
import HeaderBar from '@/components/Headerbar.vue';
import Navbar from '@/components/Navbar.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
// HeaderBar를 숨길 라우트 이름 목록
// (이 배열에 포함된 name의 페이지에서는 HeaderBar가 표시되지 않음)
const hideHeaderNames = [
  'dictionary',
  'Notification',
  'OpenbankingDailyReport',
  'profile',
  'my-history',
  'withdraw',
  'WithdrawSuccess',
  'avatar-shop',
  'ChallengeHome',
  'OpenBankingMyHome',
  'OpenbankingMonthlyReport',
  'mycertificate',
  'AccountAgreement',
  'AccountLinkSelect',
  'customer-support',
  'DailyReportSelect',
  'DailyReportDetail',
  'CardList',
  'AccountList',
  'AccountDetail',
  'CardDetail',
  'ObAgreement',
  'OpenBankingAgreement',
  'ObArsAgreement',
  'certificate-password-change',
  'certificate-password-change-new',
  'certificate-password-change-confirm',
];
const shouldHideHeader = computed(() => {
  return !hideHeaderNames.includes(route.name);
});
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.main-content {
  flex: 1 0 auto;
}

.finance-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.finance-bg {
  background: var(--color-bg-light);
}
</style>
