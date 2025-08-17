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

    <!-- 🔹 여기서 바로 register/sync-all 시작 + 곧바로 라우팅 -->
    <button class="ob-btn" @click="onPrimaryGoConcurrent" :disabled="loading">
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import bannerImage from './img/Openbanking_Banner.png';

/** ✅ accountsApi: 너가 이미 가진 래퍼 */
import {
  getAccountsWithTotal,
  registerAccount,
  syncAllAccounts,
} from '@/api/openbanking/accountsApi';

/** ✅ cardsApi: 아래에 예시 추가. 파일 없으면 생성해서 import 경로 맞춰줘 */
import { registerCard, syncAllCards } from '@/api/openbanking/cardsApi';

/** (선택) 리포트/자산요약 초기화 API가 있으면 import 해서 쓰기
 * import { initMonthReport } from '@/api/openbanking/reportApi';
 * import { getAssetTotal } from '@/api/openbanking/assetsApi';
 */

const router = useRouter();

const loading = ref(false);
const error = ref('');
const accountTotal = ref(0);
const accountCount = ref(0);

const hasAccounts = computed(() => accountCount.value > 0);
const primaryLabel = computed(() =>
  hasAccounts.value ? '연동 추가하기' : '자산 연동하기'
);

function goToMyAssets() {
  router.push('/openbanking/myhome');
}

/** 🔹 눌러서 곧바로 이동 + 백그라운드로 등록/동기화 */
function onPrimaryGoConcurrent() {
  if (loading.value) return;
  loading.value = true;
  error.value = '';

  // 백그라운드 연동 킥오프(기다리지 않음)
  (async () => {
    try {
      await Promise.allSettled([
        // DTO 비우면 서버에서 MOCK+온보딩 경로 태울 수 있게 해놨던 로직 그대로 활용
        registerAccount({}),
        registerCard({}),
      ]);

      await Promise.allSettled([syncAllAccounts(), syncAllCards()]);
      await initMonthReport();
      await getAssetTotal();
    } catch (_) {
      // 화면은 이미 이동했을 수 있으니 조용히 스킵
    } finally {
      loading.value = false;
    }
  })();

  // 즉시 이동
  router.push('/openbanking/account-link-select');
}

/** 🔁 이 페이지 진입 시 자산 요약 로드 */
onMounted(async () => {
  // 🔸 이 페이지에서만 흰 헤더 오버라이드를 적용
  document.body.classList.add('ob-white-page');

  try {
    loading.value = true;
    error.value = '';
    const r = await getAccountsWithTotal(); // { status, message, data }
    const d = r?.data || {};
    const list = Array.isArray(d.accounts) ? d.accounts : [];
    accountCount.value = list.length;
    accountTotal.value = Number(d.accountTotal ?? 0);
  } catch (e) {
    error.value =
      e?.response?.data?.message || e?.message || '연동 상태 조회 실패';
    accountCount.value = 0;
    accountTotal.value = 0;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  // 🔸 페이지 이탈 시 원복
  document.body.classList.remove('ob-white-page');
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

<!-- 🔹 글로벌 오버라이드(흰 헤더). scoped 아님! -->
<style>
/* 이 페이지 전용 화이트 톤 + 헤더 경계선 제거 - 강력한 오버라이드 */
body.ob-white-page .ob-header,
body.ob-white-page .openbanking-header,
body.ob-white-page .openbanking-layout .header,
body.ob-white-page header.openbanking-header,
body.ob-white-page .openbanking-layout header,
body.ob-white-page .base-header,
body.ob-white-page header,
body.ob-white-page .header,
body.ob-white-page .app-header,
body.ob-white-page .main-header,
body.ob-white-page .page-header {
  border-bottom: 0 !important;
  box-shadow: none !important;
  background-image: none !important;
  background: #fff !important;
  border: none !important;
}

/* 일부 레이아웃은 얇은 선을 ::after 로 그림 - 모든 가능한 ::after 제거 */
body.ob-white-page .ob-header::after,
body.ob-white-page .openbanking-header::after,
body.ob-white-page .openbanking-layout .header::after,
body.ob-white-page .base-header::after,
body.ob-white-page header::after,
body.ob-white-page .header::after,
body.ob-white-page .app-header::after,
body.ob-white-page .main-header::after,
body.ob-white-page .page-header::after {
  display: none !important;
  content: none !important;
  border: none !important;
}

/* 헤더 내부 요소들도 흰색으로 */
body.ob-white-page .base-header .title,
body.ob-white-page header .title,
body.ob-white-page .header .title {
  color: #222 !important;
  font-weight: 700 !important;
}
body.ob-white-page .base-header .icon,
body.ob-white-page header .icon,
body.ob-white-page .header .icon {
  color: #4318d1 !important;
}

/* 추가 헤더 클래스들도 커버 */
body.ob-white-page header,
body.ob-white-page .header,
body.ob-white-page .app-header {
  background: #fff !important;
  border-bottom: 0 !important;
  box-shadow: none !important;
}

/* 전체 페이지 흰색 강제 */
body.ob-white-page,
body.ob-white-page #app,
body.ob-white-page .app {
  background: #fff !important;
}

/* v-calendar container global override */
.custom-calendar.vc-container {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
}
</style>
