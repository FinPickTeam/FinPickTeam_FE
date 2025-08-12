<template>
  <div class="myhome-container">
    <!-- 자산 요약 (공통 컴포넌트) -->
    <AssetSummaryCard
      title="총 자산"
      :amount="assetTotal"
      :subtitle="`${accounts.length}개 계좌`"
    />

    <!-- 계좌 리스트 (공통 카드 아이템) -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">계좌</span>
        <button class="obmyhome-section-more" @click="goToAccountList">
          ▶
        </button>
      </div>
      <div class="obmyhome-account-list">
        <ListItemCard
          v-for="a in accounts.slice(0, 2)"
          :key="a.id"
          :logo="a.logo"
          :bank="a.bank"
          :badge="a.type"
          :badgeClass="badgeClass(a.type)"
          :amount="a.balance"
          :isNegative="a.balance < 0"
          :name="a.name"
          :sub="a.accountNumber"
          @click="onClickAccount(a)"
        />
      </div>
    </div>

    <!-- 카드 리스트 (공통 카드 아이템) -->
    <div class="obmyhome-section-card">
      <div class="obmyhome-section-title-row">
        <span class="obmyhome-section-title">카드</span>
        <button class="obmyhome-section-more" @click="goToCardList">▶</button>
      </div>
      <div class="obmyhome-section-subtitle-row">
        <span class="obmyhome-section-subtitle">이번달 소비금액</span>
      </div>
      <div class="obmyhome-card-list">
        <ListItemCard
          v-for="c in cards.slice(0, 2)"
          :key="c.id"
          :logo="c.logo"
          :bank="c.bank"
          :badge="c.type"
          badgeClass="bg-card"
          :amount="c.amount"
          :isNegative="c.amount < 0"
          :name="c.name"
          :sub="c.cardMaskednum"
          @click="onClickCard(c)"
        />
      </div>
      <div class="obmyhome-report-buttons">
        <button class="obmyhome-report-btn daily" @click="goToDailyReport">
          이번 달 소비 내역
        </button>
        <button class="obmyhome-report-btn monthly" @click="goToMonthlyReport">
          월간 소비 리포트
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AssetSummaryCard from '@/components/openbanking/AssetSummaryCard.vue';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import { useLogos } from '@/components/openbanking/useLogos.js';
import { getAccountsWithTotal } from '@/api/openbanking/accountsApi';
import { getCardsWithTotal } from '@/api/openbanking/cardsApi';

const router = useRouter();
const { bankLogo, cardLogo } = useLogos();

const accounts = ref([]);
const cards = ref([]);
const assetTotal = ref(0);

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

const fetchHomeData = async () => {
  try {
    // 계좌 요약 + 리스트
    const accRes = await getAccountsWithTotal();
    if (accRes.data.status === 200) {
      const data = accRes.data.data || {}; // { accountTotal, accounts }
      assetTotal.value = data.accountTotal || 0;
      const list = Array.isArray(data.accounts) ? data.accounts : [];
      accounts.value = list.map((a) => {
        const bank = guessBankFromText(a.productName || '');
        return {
          id: a.id,
          bank,
          name: a.productName || '계좌',
          type: a.accountType === 'DEPOSIT' ? '입출금' : '저축',
          accountNumber: a.accountNumber,
          balance: a.balance || 0,
          logo: bankLogo(bank),
        };
      });
    }

    // 카드 리스트 (상위 2)
    const cardRes = await getCardsWithTotal();
    if (cardRes.data.status === 200) {
      const list = Array.isArray(cardRes.data.data)
        ? cardRes.data.data
        : cardRes.data.data?.cards || [];
      cards.value = list.map((c) => {
        const bank = guessBankFromText(c.cardName || '');
        return {
          id: c.id,
          bank,
          name: c.cardName || '카드',
          type: c.cardType === 'CREDIT' ? '신용' : '체크',
          amount: 0,
          cardMaskednum: c.cardMaskednum || '****',
          logo: cardLogo(bank),
        };
      });
    }
  } catch (e) {
    console.error('홈 데이터 로드 실패:', e);
  }
};

// 새로고침 이벤트 리스너
const handleRefresh = () => {
  fetchHomeData();
};

onMounted(() => {
  fetchHomeData();
  // 새로고침 이벤트 리스너 등록
  window.addEventListener('refresh-openbanking-data', handleRefresh);
});

onUnmounted(() => {
  // 이벤트 리스너 제거
  window.removeEventListener('refresh-openbanking-data', handleRefresh);
});

const goToDailyReport = () => router.push('/openbanking/calendar');
const goToMonthlyReport = () => router.push('/openbanking/monthly-report');
const goToCardList = () => router.push('/openbanking/card-list');
const goToAccountList = () => router.push('/openbanking/account-list');
const onClickAccount = (a) =>
  router.push(`/openbanking/account-detail/${a.id}`);
const onClickCard = (c) =>
  router.push({
    name: 'CardDetail',
    params: { cardId: c.id },
  });
</script>

<style scoped>
.bg-card {
  background: #ece9fd;
  color: #4318d1;
}

.myhome-container {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  height: calc(
    100dvh - 160px
  ); /* 헤더(80px) + 네비게이션(80px) 높이만큼 빼기 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
  margin-bottom: 10px;
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
  border-bottom: 1px solid #ececec;
}

.obmyhome-report-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.obmyhome-report-btn {
  flex: 1;
  background: #ece9fd;
  color: #4318d1;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.obmyhome-report-btn:hover {
  background: #e0d7fa;
}

.obmyhome-report-btn.daily {
  background: #f0f9ff;
  color: #0369a1;
}

.obmyhome-report-btn.daily:hover {
  background: #e0f2fe;
}

.obmyhome-report-btn.monthly {
  background: #ece9fd;
  color: #4318d1;
}

.obmyhome-report-btn.monthly:hover {
  background: #e0d7fa;
}

@media (max-width: 430px) {
  .myhome-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
