<template>
  <div class="account-list-page">
    <section class="summary-card">
      <h2 class="summary-title">총 자산</h2>
      <div class="summary-right">
        <div
          class="hero-delta"
          :class="{ up: assetDiff > 0, down: assetDiff < 0 }"
        >
          <span class="delta-icon">{{
            assetDiff > 0 ? '▲' : assetDiff < 0 ? '▼' : '–'
          }}</span>
          전월 대비 {{ Math.abs(assetChangePercent).toFixed(1) }}%
        </div>
        <div class="summary-amount">{{ totalAssets.toLocaleString() }}원</div>
      </div>
    </section>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>계좌 정보를 불러오는 중...</p>
    </div>

    <template v-else>
      <div class="category-wrap">
        <section
          v-for="sec in sections"
          :key="sec.key"
          class="account-group-card"
        >
          <h3 class="group-title">{{ sec.title }}</h3>
          <div class="account-list">
            <ListItemCard
              v-for="a in sec.items"
              :key="a.id"
              :logo="bankLogo(a.bank)"
              :name="a.name"
              :sub="a.accountNumber"
              :amount="a.displayBalance"
              :selected="isDeleteMode && isSelected(a)"
              @click="onClick(a)"
              class="account-item"
            />
          </div>
        </section>
      </div>
    </template>

    <ConfirmModal
      :open="showModal"
      title="계좌 삭제"
      @close="closeConfirm"
      @confirm="confirmDelete"
    >
      {{ selectedCount }}개의 계좌를 삭제하시겠습니까?
    </ConfirmModal>
    <DeleteModeFooter
      :is-delete-mode="isDeleteMode"
      :selected-count="selectedCount"
      item-type="계좌"
      @delete="openConfirm"
      @toggle-mode="toggleMode"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import DeleteModeFooter from '@/components/openbanking/DeleteModeFooter.vue';
import { useLogos } from '@/components/openbanking/useLogos.js';
import {
  getAccountsWithTotal,
  deleteAccount,
  getAccountTransactions,
} from '@/api/openbanking/accountsApi';
import { getAssetSummaryCompare } from '@/api/openbanking/assetSummaryApi.js';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';

const router = useRouter();
const accounts = ref([]);
const loading = ref(false);
const { bankLogo, resolveBank } = useLogos();
const apiAccountTotal = ref(null);

// 전월 대비
const assetDiff = ref(0);
const assetChangePercent = ref(0);

// 삭제 모드/선택
const isDeleteMode = ref(false);
const selectedIds = ref(new Set());
const showModal = ref(false);
const openConfirm = () => {
  if (selectedIds.value.size) showModal.value = true;
};
const closeConfirm = () => {
  showModal.value = false;
};
const toggleMode = () => {
  isDeleteMode.value = !isDeleteMode.value;
  selectedIds.value.clear();
};
const handleToggleDelete = () => toggleMode();
const toggleSelect = (item) => {
  if (item.type === '투자') return;
  const id = item.id;
  selectedIds.value.has(id)
    ? selectedIds.value.delete(id)
    : selectedIds.value.add(id);
};
const isSelected = (item) => selectedIds.value.has(item.id);
const selectedCount = computed(() => selectedIds.value.size);

const totalAssets = computed(() => {
  if (typeof apiAccountTotal.value === 'number') return apiAccountTotal.value;
  if (!accounts.value?.length) return 0;
  return accounts.value.reduce((t, a) => t + (a.displayBalance || 0), 0); // ✅ after 기준 합계
});

const sections = computed(() => {
  if (!accounts.value?.length) return [];
  const depositAccounts = accounts.value.filter((a) => a.type === '입출금');
  const savingsAccounts = accounts.value.filter((a) => a.type === '저축');
  const investAccounts = accounts.value.filter((a) => a.type === '투자');
  return [
    { key: 'deposit', title: '입출금', items: depositAccounts },
    { key: 'savings', title: '저축', items: savingsAccounts },
    { key: 'invest', title: '투자', items: investAccounts },
  ].filter((sec) => sec.items.length > 0);
});

const onClick = (a) => {
  if (isDeleteMode.value) {
    toggleSelect(a);
  } else {
    router.push({
      path: `/openbanking/account-detail/${a.id}`,
      query: {
        bank: a.bank,
        accountNo: a.accountNumber,
        displayBalance: a.displayBalance,
      }, // ✅ 동일 값 전달
    });
  }
};

const confirmDelete = async () => {
  const ids = [...selectedIds.value];
  const res = await Promise.allSettled(ids.map((id) => deleteAccount(id)));
  const okIds = ids.filter((_, i) => res[i].status === 'fulfilled');
  accounts.value = accounts.value.filter((a) => !okIds.includes(a.id));
  selectedIds.value.clear();
  isDeleteMode.value = false;
  closeConfirm();
};

const loadLatestAfterMap = async (list) => {
  const jobs = list.map(async (a) => {
    try {
      const r = await getAccountTransactions(a.id, { page: 0, size: 1 });
      const t = Array.isArray(r?.data) ? r.data[0] : null;
      const after = t?.balanceAfter ?? t?.afterBalanceAmt ?? t?.balance ?? null;
      return [a.id, Number(after)];
    } catch {
      return [a.id, null];
    }
  });
  const entries = await Promise.all(jobs);
  return Object.fromEntries(entries);
};

onMounted(async () => {
  window.addEventListener('toggle-delete-mode', handleToggleDelete);
  try {
    loading.value = true;
    const r = await getAccountsWithTotal();
    const apiData = r?.data || {};
    const apiAccounts = apiData?.accounts || [];
    apiAccountTotal.value =
      typeof apiData?.accountTotal === 'number' ? apiData.accountTotal : null;

    const afterMap = await loadLatestAfterMap(apiAccounts);

    accounts.value = apiAccounts.map((account) => ({
      id: account.id,
      bank: resolveBank(account.productName || ''),
      type:
        account.accountType === 'DEPOSIT'
          ? '입출금'
          : account.accountType === 'SAVING'
          ? '저축'
          : '투자',
      name: account.productName || '계좌',
      accountNumber: account.accountNumber || '****',
      balance: Number(account.balance || 0),
      displayBalance: Number(afterMap[account.id] ?? account.balance ?? 0), // ✅ after 우선
    }));

    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    try {
      const cmp = await getAssetSummaryCompare({ month: ym });
      const d = cmp?.data || {};
      const cur = Number(d.currentAssetTotal ?? totalAssets.value);
      const prev = Number(d.prevAssetTotal ?? 0);
      assetDiff.value = Number(d.assetDiff ?? cur - prev);
      assetChangePercent.value = prev ? (assetDiff.value / prev) * 100 : 0;
    } catch {
      assetDiff.value = 0;
      assetChangePercent.value = 0;
    }
  } catch (error) {
    console.error('계좌 API 호출 에러:', error);
    accounts.value = [];
    apiAccountTotal.value = null;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('toggle-delete-mode', handleToggleDelete);
});
</script>

<style scoped>
/* 기존 스타일 그대로 포함(생략 없이) */
.account-list-page {
  background-color: #f6f7f8;
  min-height: 100vh;
  padding: 0 16px 100px;
}
.category-wrap {
  background: #fff;
  margin: 0 -16px 16px;
  padding: 8px 16px;
}
.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px 24px;
}
.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
}
.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 4px;
}
.hero-delta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #666;
}
.hero-delta.up {
  color: #ef4444;
}
.hero-delta.down {
  color: #3b82f6;
}
.delta-icon {
  font-weight: 700;
}
.summary-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #4318d1;
}
.account-group-card {
  background: transparent;
  border-radius: 0;
  padding: 16px 0;
  margin: 0;
  box-shadow: none;
}
.group-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  padding-left: 16px;
  color: #222;
}
.account-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.account-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  transition: background-color 0.2s;
}
.account-item:hover {
  background-color: #f9f9fa;
}
.account-item.selected {
  background-color: #eef2ff;
}
.loading-container {
  text-align: center;
  padding: 40px 0;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #e0e0e0;
  border-top-color: #4318d1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
