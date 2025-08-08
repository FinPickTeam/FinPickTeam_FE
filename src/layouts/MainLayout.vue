<template>
  <div class="main-layout">
    <!-- dictionary, notification 경로에서는 헤더 숨김 -->
    <HeaderBar
      v-if="shouldHideHeader"
      :class="{ 'finance-header': route.name === 'FinanceHome' }"
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
    <Navbar />
  </div>
</template>

<script setup>
import HeaderBar from "@/components/Headerbar.vue";
import Navbar from "@/components/Navbar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import WithdrawSuccess from "@/pages/mypage/WithdrawSuccess.vue";

const route = useRoute();
// HeaderBar를 숨길 라우트 이름 목록
// (이 배열에 포함된 name의 페이지에서는 HeaderBar가 표시되지 않음)
const hideHeaderNames = [
  "dictionary",
  "Notification",
  "OpenbankingDailyReport",
  "profile",
  "my-history",
  "withdraw",
  "WithdrawSuccess",
  "avatar-shop",
  "ChallengeHome",
  "OpenBankingMyHome",
  "OpenbankingMonthlyReport",
  "mycertificate",
  "AccountAgreement",
  "AccountLinkSelect",
  "customer-support",
  "DailyReportSelect",
  "DailyReportDetail",
  "CardList",
  "AccountList",
  "AccountDetail",
  "CardDetail",
  "ObAgreement",
  "OpenBankingAgreement",
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
  align-items: stretch;
  /* padding-top: 80px; 헤더 높이만큼 상단 패딩 */
  padding-bottom: 80px; /* 네비바 높이만큼 하단 패딩 */
}

.main-content {
  flex: 1 0 auto;
  /* padding-bottom 제거 - 이미 main-layout에서 처리 */
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
