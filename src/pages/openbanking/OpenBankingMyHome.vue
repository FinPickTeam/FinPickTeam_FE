<template>
  <div class="myhome-container">
    <!-- ───── Asset Hero (like mock) ───── -->
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
        <span class="delta-icon">
          {{ assetDiff > 0 ? '▲' : assetDiff < 0 ? '▼' : '–' }}
        </span>
        전월 대비 {{ Math.abs(assetChangePercent).toFixed(1) }}%
      </div>
    </section>

    <!-- ───── 계좌 섹션 (리뉴얼) ───── -->
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
            <span class="item-amount" :class="{ negative: a.balance < 0 }"
              >{{ formatCurrency(a.balance) }}원</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- ───── 카드 섹션 (리뉴얼) ───── -->
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
            <span class="item-amount" :class="{ negative: c.amount < 0 }"
              >{{ formatCurrency(c.amount) }}원</span
            >
          </div>
        </div>
      </div>

      <!-- 기존 소비 리포트 버튼 유지 -->
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

import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import { useLogos } from '@/components/openbanking/useLogos.js';
import { getAccountsWithTotal } from '@/api/openbanking/accountsApi';
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

const badgeClass = (t) =>
  t === '입출금' ? 'bg-deposit' : t === '저축' ? 'bg-savings' : 'bg-invest';

const stampNow = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  lastUpdated.value = `${hh}:${mm}`;
};

const fetchHomeData = async () => {
  try {
    // ----- 계좌 요약 -----
    const acc = await getAccountsWithTotal(); // { status, message, data }
    if (acc?.status === 200) {
      const d = acc.data || {};
      assetTotal.value = Number(d.accountTotal ?? 0);

      const list = Array.isArray(d.accounts) ? d.accounts : [];
      accounts.value = list.map((a) => {
        const bank = guessBankFromText(a.productName || '');
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
          balance: Number(a.balanceAfter || a.balance || 0), // 수정된 부분
          logo: bankLogo(bank),
        };
      });
    } else {
      accounts.value = [];
      assetTotal.value = 0;
    }

    // ----- 전월 대비(자산) -----
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    try {
      const cmp = await getAssetSummaryCompare({ month: ym });
      const d = cmp?.data || {};
      const cur = Number(d.currentAssetTotal ?? assetTotal.value);
      const prev = Number(d.prevAssetTotal ?? 0);
      const diff = Number(d.assetDiff ?? cur - prev);
      assetDiff.value = diff;
      assetChangePercent.value = prev ? (diff / prev) * 100 : 0;
    } catch {
      assetDiff.value = 0;
      assetChangePercent.value = 0;
    }

    // ----- 카드(이번달) -----
    const card = await getCardsWithTotal({ month: ym }); // { status, message, data: [] }
    if (card?.status === 200) {
      const list = Array.isArray(card.data) ? card.data : [];
      cards.value = list.map((c) => {
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
    } else {
      cards.value = [];
    }

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

const handleRefresh = () => fetchHomeData();

onMounted(() => {
  fetchHomeData();
  window.addEventListener('refresh-openbanking-data', handleRefresh);
});
onUnmounted(() => {
  window.removeEventListener('refresh-openbanking-data', handleRefresh);
});

// nav
const goToDailyReport = () => router.push('/openbanking/calendar');
const goToMonthlyReport = () => router.push('/openbanking/monthly-report');
const goToCardList = () => router.push('/openbanking/card-list');
const goToAccountList = () => router.push('/openbanking/account-list');
const onClickAccount = (a) =>
  router.push(`/openbanking/account-detail/${a.id}`);
const onClickCard = (c) =>
  router.push({ name: 'CardDetail', params: { cardId: c.id } });

// topbar actions
const onSearch = () => router.push('/search'); // 필요하면 라우트 맞춰 바꿔
const onAdd = () => router.push('/openbanking/account-link-select');
</script>

<style scoped>
/* ===== Topbar ===== */
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

/* ===== Asset hero ===== */
.asset-hero {
  border-radius: 18px;
  margin: 0 16px 20px 16px; /* increase bottom spacing */
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
  white-space: nowrap; /* keep on one line */
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
} /* 빨강(상승) */
.hero-delta.down {
  color: #2563eb;
} /* 파랑(하락) */
.delta-icon {
  font-weight: 700;
}

/* ===== Content card (리뉴얼) ===== */
.content-card {
  background: #fff;
  border-radius: 18px;
  margin: 0 16px 12px 16px;
  padding: 16px 20px 16px 20px;
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

/* ===== Rest (기존) ===== */
.bg-card {
  background: #ece9fd;
  color: var(--color-main);
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
.obmyhome-section-card {
  background: #fff;
  border-radius: 18px;
  margin: 0 16px 12px 16px;
  padding: 6px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.obmyhome-section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.obmyhome-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.obmyhome-section-subtitle-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}
.obmyhome-section-subtitle {
  font-size: 0.85rem;
  color: #888;
  font-weight: 400;
}
.obmyhome-section-more {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #bdbdbd;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.obmyhome-section-more:hover {
  background: #f3f3f3;
}
.obmyhome-account-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
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
