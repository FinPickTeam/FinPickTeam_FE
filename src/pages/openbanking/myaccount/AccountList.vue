<!-- src/views/openbanking/AccountList.vue -->
<template>
  <div class="page">
    <AssetSummaryCard
      title="총 자산"
      :amount="totalAssets"
      :subtitle="`${accounts.length || 0}개 계좌`"
    />

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>계좌 정보를 불러오는 중...</p>
    </div>

    <template v-else>
      <template v-for="(sec, index) in sections" :key="sec.key || index">
        <section v-if="sec.items && sec.items.length" class="group">
          <h4 class="group-title">{{ sec.title }}</h4>
          <ListItemCard
            v-for="a in sec.items"
            :key="a.id"
            :logo="bankLogo(a.bank)"
            :bank="a.bank"
            :badge="a.type"
            :badgeClass="badgeClass(a.type)"
            :amount="a.balance"
            :isNegative="a.balance < 0"
            :name="a.name"
            :sub="a.accountNumber"
            :selected="isSelected(a)"
            :disabled="a.type === '투자' && !isDeleteMode"
            @click="onClick(a)"
          />
        </section>
      </template>
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
    />

    <Navbar />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import ListItemCard from '@/components/openbanking/ListItemCard.vue';
import ConfirmModal from '@/components/openbanking/ConfirmModal.vue';
import DeleteModeFooter from '@/components/openbanking/DeleteModeFooter.vue';
import AssetSummaryCard from '@/components/openbanking/AssetSummaryCard.vue';
import Navbar from '@/components/Navbar.vue';
import { useLogos } from '@/components/openbanking/useLogos.js';
import {
  getAccountsWithTotal,
  deleteAccount,
} from '@/api/openbanking/accountsApi';
import { useRouter } from 'vue-router';

library.add(faTrash);

const router = useRouter();
const accounts = ref([]);
const loading = ref(false);
const { bankLogo } = useLogos();
const apiAccountTotal = ref(null);

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
  selectedIds.value = new Set();
};
const toggleSelect = (item) => {
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
  const out = [];
  if (depositAccounts.length)
    out.push({ key: 'deposit', title: '입출금 계좌', items: depositAccounts });
  if (savingsAccounts.length)
    out.push({ key: 'savings', title: '저축 계좌', items: savingsAccounts });
  if (investAccounts.length)
    out.push({ key: 'invest', title: '투자 계좌', items: investAccounts });
  return out;
});

const badgeClass = (t) =>
  t === '입출금' ? 'bg-deposit' : t === '저축' ? 'bg-savings' : 'bg-invest';

const onClick = (a) => {
  if (isDeleteMode.value) return toggleSelect(a);
  if (a.type !== '투자') router.push(`/openbanking/account-detail/${a.id}`);
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
  try {
    loading.value = true;
    const r = await getAccountsWithTotal(); // {status, message, data}
    const apiData = r?.data || {};
    const apiAccounts = apiData?.accounts || [];
    apiAccountTotal.value =
      typeof apiData?.accountTotal === 'number' ? apiData.accountTotal : null;

    accounts.value = apiAccounts.map((account) => ({
      id: account.id,
      bank: account.productName?.split(' ')[0] || '은행',
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
  } catch (error) {
    console.error('계좌 API 호출 에러:', error);
    // 폴백
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
</script>

<style scoped>
.page {
  height: calc(100dvh - 160px);
  background: var(--color-bg-light);
  padding: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  min-height: 0;
}
.header-icon-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--color-main);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}
.header-icon-btn:hover {
  background: #f3f3f3;
}

.group {
  margin: 0 16px 24px;
}
.group-title {
  font-weight: 600;
  margin: 16px 0;
}

.bg-deposit {
  background: var(--color-main);
}
.bg-savings {
  background: #059669;
}
.bg-invest {
  background: #dc2626;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3cm solid #f3f3f3;
  border-top: 4px solid var(--color-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
