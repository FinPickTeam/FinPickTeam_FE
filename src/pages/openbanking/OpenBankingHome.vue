<template>
  <div class="openbankinghome-container">
    <Headerbar />
    <div class="banner-wrap">
      <img :src="bannerImage" alt="배너" class="banner-img" />
    </div>

    <div class="ob-desc">
      <template v-if="loading"> 연동 상태 확인 중... </template>
      <template v-else-if="error">
        {{ error }}
      </template>
      <template v-else-if="hasAccounts">
        총 자산 {{ accountTotal.toLocaleString() }}원, {{ accountCount }}개 계좌
        연동 완료.
      </template>
      <template v-else>
        정리된 자산 현황, 요약된 소비 리포트.<br />
        연동만 하면 준비 완료!
      </template>
    </div>

    <button class="ob-btn" @click="goToAgreement" :disabled="loading">
      {{ primaryLabel }}
    </button>
    <button
      v-if="hasAccounts"
      class="ob-btn my-assets-btn"
      @click="goToMyAssets"
      :disabled="loading"
    >
      내 자산 보러가기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import bannerImage from './img/Openbanking_Banner.png';
import Headerbar from '@/components/Headerbar.vue';
// API 래퍼: r = { status, message, data: { accountTotal, accounts[] } }
import { getAccountsWithTotal } from '@/api/openbanking/accountsApi';

library.add(faSearch, faBell);

const router = useRouter();

const loading = ref(false);
const error = ref('');
const accountTotal = ref(0);
const accountCount = ref(0);

const hasAccounts = computed(() => accountCount.value > 0);

const primaryLabel = computed(() =>
  hasAccounts.value ? '연동 추가하기' : '자산 연동하기'
);

function goToAgreement() {
  router.push('/openbanking/account-link-select');
}
function goToMyAssets() {
  router.push('/openbanking/myhome');
}
function onPrimaryClick() {
  if (loading.value) return;

  loading.value = true;
  error.value = '';

  (async () => {
    try {
      // 전체 계좌 및 카드 동기화
      await syncAllAccounts();
      await syncAllCards();

      // 월간 리포트 초기화
      await initMonthReport();

      // 자산 요약 초기화
      const assetSummary = await getAssetTotal();
      console.log('자산 요약 초기화 완료:', assetSummary);

      // 성공 메시지
      alert('연동 및 초기화가 완료되었습니다.');
    } catch (e) {
      error.value =
        e?.response?.data?.message || e?.message || '연동 및 초기화 실패';
    } finally {
      loading.value = false;
    }
  })();
}

onMounted(async () => {
  try {
    loading.value = true;
    error.value = '';
    const r = await getAccountsWithTotal(); // { status, message, data }
    const d = r?.data || {};
    const list = Array.isArray(d.accounts) ? d.accounts : [];
    accountCount.value = list.length;
    accountTotal.value = Number(d.accountTotal ?? 0);
  } catch (e) {
    // 실패해도 기본 문구로 진행
    error.value =
      e?.response?.data?.message || e?.message || '연동 상태 조회 실패';
    accountCount.value = 0;
    accountTotal.value = 0;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.openbankinghome-container {
  width: 390px;
  height: 844px;
  max-width: 390px;
  margin: 0 auto;
  background: #fff;
  font-family: var(--font-main);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.banner-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  padding-top: 80px;
}
.banner-img {
  width: 100%;
  max-width: 390px;
  height: auto;
  box-shadow: 0 2px 16px rgba(67, 24, 209, 0.08);
}
.ob-desc {
  margin: 38px 0 24px 0;
  color: #222;
  font-size: 1.08rem;
  text-align: center;
  line-height: 1.6;
  min-height: 48px;
}
.ob-btn {
  background: var(--color-main);
  color: #fff;
  font-size: 1.08rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  width: 80%;
  max-width: 320px;
  margin: 0 auto 0 auto;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.ob-btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.ob-btn:hover {
  background: var(--color-main-dark);
}
.my-assets-btn {
  background: #f8f9fa;
  color: var(--color-main);
  border: 2px solid var(--color-main);
  margin-top: 12px;
}
.my-assets-btn:hover {
  background: var(--color-main);
  color: #fff;
}
</style>
