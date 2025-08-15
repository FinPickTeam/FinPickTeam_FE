<template>
  <div class="account-list-page">
    <section class="summary-card">
      <h2 class="summary-title">총 자산</h2>
      <div class="summary-right">
        <div
          class="hero-delta"
          :class="{ up: assetDiff > 0, down: assetDiff < 0 }"
        >
          <span class="delta-icon">
            {{ assetDiff > 0 ? '▲' : assetDiff < 0 ? '▼' : '–' }}
          </span>
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
              :amount="a.balance"
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowLeft,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import DeleteModeFooter from '@/components/openbanking/DeleteModeFooter.vue';
import { useLogos } from '@/components/openbanking/useLogos.js';
import {
  getAccountsWithTotal,
  deleteAccount,
} from '@/api/openbanking/accountsApi';
import { getAssetSummaryCompare } from '@/api/openbanking/assetSummaryApi.js';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';

library.add(faArrowLeft, faSearch, faPlus);

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
  if (item.type === '투자') return; // 투자는 삭제 불가
  const id = item.id;
  selectedIds.value.has(id)
    ? selectedIds.value.delete(id)
    : selectedIds.value.add(id);
};
const isSelected = (item) => selectedIds.value.has(item.id);
const selectedCount = computed(() => selectedIds.value.size);

// 총액(서버 total 우선)
const totalAssets = computed(() => {
  if (typeof apiAccountTotal.value === 'number') return apiAccountTotal.value;
  if (!accounts.value?.length) return 0;
  return accounts.value.reduce((t, a) => t + (a.balance || 0), 0);
});

// 섹션 분리
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
    router.push(`/openbanking/account-detail/${a.id}`);
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

onMounted(async () => {
  window.addEventListener('toggle-delete-mode', handleToggleDelete);
  try {
    loading.value = true;
    const r = await getAccountsWithTotal(); // {status, message, data}
    const apiData = r?.data || {};
    const apiAccounts = apiData?.accounts || [];
    apiAccountTotal.value =
      typeof apiData?.accountTotal === 'number' ? apiData.accountTotal : null;

    accounts.value = apiAccounts.map((account) => ({
      id: account.id,
      bank: resolveBank(account.productName || ''),
      type:
        account.accountType === 'DEPOSIT'
          ? '입출금'
          : account.accountType === 'SAVINGS'
          ? '저축'
          : '투자',
      name: account.productName || '계좌',
      balance: Number(account.balance || 0),
      accountNumber: account.accountNumber || '****',
    }));

    // 전월 대비 자산 비교 호출
    try {
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0'
      )}`;
      const cmp = await getAssetSummaryCompare({ month: ym });
      const d = cmp?.data || {};
      const cur = Number(d.currentAssetTotal ?? totalAssets.value);
      const prev = Number(d.prevAssetTotal ?? 0);
      assetDiff.value = Number(d.assetDiff ?? cur - prev);
      assetChangePercent.value = prev ? (assetDiff.value / prev) * 100 : 0;
    } catch (e) {
      assetDiff.value = 0;
      assetChangePercent.value = 0;
    }
  } catch (error) {
    console.error('계좌 API 호출 에러:', error);
    // 폴백 데이터 (에러 발생 시 예시)
    accounts.value = [
      {
        id: 1,
        bank: 'KB국민은행',
        type: '입출금',
        name: "KB IT's Your Life 6기 통장",
        balance: 5023400,
        accountNumber: '3020-****-3748',
      },
    ];
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
.account-list-page {
  background-color: #f6f7f8;
  min-height: 100vh;
  padding: 0 16px 100px; /* 하단 여백 확보 */
}

.category-wrap {
  background: #fff;
  margin: 0 -16px; /* 좌우 꽉 차게 */
  padding: 8px 16px; /* 내부 패딩만 유지 */
  border-radius: 0;
}

/* 총 자산 카드 스타일 */
.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
}
.summary-delta {
  font-size: 0.85rem;
  font-weight: 500;
}
.summary-delta.up {
  color: #ef4444;
}
.summary-delta.down {
  color: #3b82f6;
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

/* 계좌 아이템 스타일 */
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
.item-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-sub {
  font-size: 0.75rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-balance {
  margin-left: auto;
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  letter-spacing: -0.5px;
  white-space: nowrap;
  align-self: flex-end; /* 위치를 이름보다 살짝 아래로 */
  padding-top: 6px;
}

/* 로딩 스타일 */
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

/* 전월 대비 표시 */
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
