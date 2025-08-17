<template>
  <div class="myhome-container">
    <!-- ===== Asset Hero ===== -->
    <section class="asset-hero">
      <div class="asset-hero-head">
        <div class="hero-title">총 자산</div>
        <div class="hero-updated">
          <font-awesome-icon :icon="['fas', 'clock']" />
          <span>{{ lastUpdated }} 갱신</span>
        </div>
      </div>

      <div class="hero-amount">{{ formatCurrency(assetTotal) }}원</div>

      <div
        class="hero-delta"
        :class="{ up: assetDiff > 0, down: assetDiff < 0 }"
      >
        <span class="delta-icon">{{
          assetDiff > 0 ? '▲' : assetDiff < 0 ? '▼' : '–'
        }}</span>
        전월 대비 {{ Math.abs(assetChangePercent).toFixed(1) }}%
      </div>
    </section>

    <!-- ===== 계좌 ===== -->
    <section class="content-card" v-if="accounts.length > 0">
      <div class="card-title-row" @click="goToAccountList">
        <h2 class="card-title">계좌</h2>
        <button class="card-more-btn">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>

      <div class="item-list">
        <div
          class="list-item"
          v-for="a in accounts.slice(0, 3)"
          :key="a.id"
          @click="onClickAccount(a)"
        >
          <img :src="a.logo" alt="" class="item-logo" />
          <div class="item-text-content">
            <span class="item-name">{{ a.name }}</span>
            <!-- ✅ 밖에서도 balanceAfter(최근 거래 후 잔액) 표시 -->
            <span
              class="item-amount"
              :class="{ negative: a.displayBalance < 0 }"
            >
              {{ formatCurrency(a.displayBalance) }}원
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 카드 ===== -->
    <section class="content-card" v-if="cards.length > 0">
      <div class="card-title-row" @click="goToCardList">
        <h2 class="card-title">카드</h2>
        <button class="card-more-btn">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>

      <div class="item-list">
        <div
          class="list-item"
          v-for="c in cards.slice(0, 2)"
          :key="c.id"
          @click="onClickCard(c)"
        >
          <img :src="c.logo" alt="" class="item-logo" />
          <div class="item-text-content">
            <span class="item-name">{{ c.name }}</span>
            <span class="item-amount" :class="{ negative: c.amount < 0 }">
              {{ formatCurrency(c.amount) }}원
            </span>
          </div>
        </div>
      </div>

      <div class="obmyhome-report-buttons">
        <button class="obmyhome-report-btn daily" @click="goToDailyReport">
          이번 달 소비 내역
        </button>
        <button class="obmyhome-report-btn monthly" @click="goToMonthlyReport">
          월간 소비 리포트
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSearch,
  faPlus,
  faRotateRight,
  faClock,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import { useLogos } from '@/components/openbanking/useLogos.js';
import {
  getAccountsWithTotal,
  getAccountTransactions,
  syncAllAccounts,
} from '@/api/openbanking/accountsApi';
import { getCardsWithTotal } from '@/api/openbanking/cardsApi';
import { getAssetSummaryCompare } from '@/api/openbanking/assetSummaryApi';

library.add(faSearch, faPlus, faRotateRight, faClock, faChevronRight);

const router = useRouter();
const { bankLogo, cardLogo } = useLogos();

const accounts = ref([]);
const cards = ref([]);

const assetTotal = ref(0);
const assetDiff = ref(0);
const assetChangePercent = ref(0);
const lastUpdated = ref('--:--');

const formatCurrency = (n) => Number(n || 0).toLocaleString();

const guessBankFromText = (text = '') => {
  if (text.includes('국민') || text.includes('KB')) return 'KB국민은행';
  if (text.includes('신한')) return '신한은행';
  if (text.includes('하나')) return '하나은행';
  if (text.includes('농협') || text.includes('NH')) return 'NH농협은행';
  if (text.includes('우리')) return '우리은행';
  if (text.includes('카카오')) return '카카오뱅크';
  return 'KB국민은행';
};

const stampNow = () => {
  const d = new Date();
  lastUpdated.value = `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
};

/** 최근 거래 1건의 afterBalance를 읽어오는 헬퍼 */
const loadLatestAfterMap = async (list) => {
  const jobs = list.map(async (a) => {
    try {
      const r = await getAccountTransactions(a.id, { page: 0, size: 1 });
      const t = Array.isArray(r?.data) ? r.data[0] : null;
      const after =
        t?.balanceAfter ??
        t?.afterBalanceAmt ??
        t?.balance ?? // 혹시 필드명이 이렇게 오는 경우도
        null;
      return [a.id, Number(after)];
    } catch {
      return [a.id, null];
    }
  });
  const entries = await Promise.all(jobs);
  return Object.fromEntries(entries);
};

const fetchHomeData = async () => {
  try {
    // 1) 최신화
    await syncAllAccounts();

    // 2) 계좌
    const acc = await getAccountsWithTotal();
    const d = acc?.data || {};
    assetTotal.value = Number(d.accountTotal ?? 0);
    const list = Array.isArray(d.accounts) ? d.accounts : [];

    // 2-1) 각 계좌의 최근 afterBalance 동시 로드
    const afterMap = await loadLatestAfterMap(list);

    accounts.value = list.map((a) => {
      const bank = guessBankFromText(a.productName || '');
      const displayBalance = Number(afterMap[a.id] ?? a.balance ?? 0); // ✅ 밖에서도 after 우선
      return {
        id: a.id,
        bank,
        name: a.productName || '계좌',
        type:
          a.accountType === 'DEPOSIT'
            ? '입출금'
            : a.accountType === 'SAVING'
            ? '저축'
            : '투자',
        accountNumber: a.accountNumber || '****',
        balance: Number(a.balance ?? 0),
        displayBalance,
        logo: bankLogo(bank),
      };
    });

    // 3) 전월 대비 자산
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    try {
      const cmp = await getAssetSummaryCompare({ month: ym });
      const x = cmp?.data || {};
      const cur = Number(x.currentAssetTotal ?? assetTotal.value);
      const prev = Number(x.prevAssetTotal ?? 0);
      const diff = Number(x.assetDiff ?? cur - prev);
      assetDiff.value = diff;
      assetChangePercent.value = prev ? (diff / prev) * 100 : 0;
    } catch {
      assetDiff.value = 0;
      assetChangePercent.value = 0;
    }

    // 4) 카드
    const card = await getCardsWithTotal({ month: ym });
    const listCard = Array.isArray(card?.data) ? card.data : [];
    cards.value = listCard.map((c) => {
      const bank = c.bankName || guessBankFromText(c.cardName || '');
      return {
        id: c.id,
        bank,
        name: c.cardName || '카드',
        type: c.cardType === 'CREDIT' ? '신용' : '체크',
        amount: Number(c.monthlySpent || 0),
        cardMaskednum: c.cardMaskednum || '****',
        logo: cardLogo(bank),
      };
    });

    stampNow();
  } catch (e) {
    console.error('홈 데이터 로드 실패:', e);
    accounts.value = [];
    cards.value = [];
    assetTotal.value = 0;
    assetDiff.value = 0;
    assetChangePercent.value = 0;
    stampNow();
  }
};

// nav
const goToDailyReport = () => router.push('/openbanking/calendar');
const goToMonthlyReport = () => router.push('/openbanking/monthly-report');
const goToCardList = () => router.push('/openbanking/card-list');
const goToAccountList = () => router.push('/openbanking/account-list');

const onClickAccount = (a) =>
  router.push({
    path: `/openbanking/account-detail/${a.id}`,
    query: {
      bank: a.bank,
      accountNo: a.accountNumber,
      // ✅ 홈에서 본 afterBalance 그대로 전달 → 디테일 헤더 숫자 일치
      displayBalance: a.displayBalance,
    },
  });
const onClickCard = (c) =>
  router.push({ name: 'CardDetail', params: { cardId: c.id } });

const handleRefresh = () => fetchHomeData();

onMounted(() => {
  fetchHomeData();
  window.addEventListener('refresh-openbanking-data', handleRefresh);
});
onUnmounted(() => {
  window.removeEventListener('refresh-openbanking-data', handleRefresh);
});
</script>

<style scoped>
/* (기존 스타일 그대로) — 생략 없이 포함 */
.topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 4px 8px;
}
.topbar-spacer {
  flex: 1;
}
.icon-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  font-size: 18px;
  color: var(--color-main);
  border-radius: 10px;
}
.icon-btn.back {
  color: #222;
}
.asset-hero {
  border-radius: 18px;
  margin: 0 16px 20px 16px;
  padding: 14px 20px 16px 20px;
}
.asset-hero-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #222;
}
.hero-updated {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9aa0a6;
  font-size: 0.8rem;
}
.refresh-btn {
  background: none;
  border: none;
  color: #b2b7ff;
  margin-left: 2px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
}
.hero-amount {
  margin-top: 6px;
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-main);
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hero-delta {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #6b7280;
}
.hero-delta.up {
  color: #ef4444;
}
.hero-delta.down {
  color: #2563eb;
}
.delta-icon {
  font-weight: 700;
}
.content-card {
  background: #fff;
  border-radius: 18px;
  margin: 0 16px 12px 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.card-more-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #bdbdbd;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.card-more-btn:hover {
  background: #f3f3f3;
}
.item-list {
  display: flex;
  flex-direction: column;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  cursor: pointer;
}
.item-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}
.item-text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.item-name {
  color: #666;
  white-space: nowrap;
}
.item-amount {
  font-weight: 700;
  color: var(--color-main);
  white-space: nowrap;
}
.item-amount.negative {
  color: #e11d48;
}
.myhome-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 8px 0 16px;
  box-sizing: border-box;
  height: calc(100dvh - 160px);
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  min-height: 0;
}
.obmyhome-report-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.obmyhome-report-btn {
  flex: 1;
  background: #ece9fd;
  color: var(--color-main);
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
@media (max-width: 430px) {
  .myhome-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
