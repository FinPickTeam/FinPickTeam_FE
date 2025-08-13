<template>
  <div
    v-if="open"
    class="modal-backdrop"
    @click.self="emit('update:open', false)"
  >
    <div class="modal-content">
      <header class="modal-header">
        <h3>내 주식 위시리스트</h3>
      </header>
      <div v-if="loading" class="empty">목록 불러오는 중…</div>
      <div v-else-if="products.length === 0" class="empty">
        위시리스트가 없습니다.
      </div>
      <div v-else class="scroll-list">
        <SelectableStockList
          :products="products"
          :selected-ids="selectedIds"
          @toggle="toggleSelect"
        />
        <button
          class="compare-btn"
          :disabled="selectedIds.length === 0"
          @click="onCompare"
        >
          비교하기 ({{ selectedIds.length }})
        </button>
      </div>
      <button class="close-btn" @click="emit('update:open', false)">
        닫기
      </button>
    </div>
  </div>
</template>

<script setup>
import { getWishlist } from '@/api';
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useFavoriteStore } from '@/stores/favorite.js';
import ProductCard_stock from './ProductCard_stock.vue';
import SelectableStockList from './SelectableStockList.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  baseId: { type: String, required: true },
  preselected: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:open', 'confirm']);

const products = ref([]); // [{ id, name, ... }]
const loading = ref(false);
const favoriteStore = useFavoriteStore();
const wishlist = computed(() => {
  return favoriteStore.stockList ?? [];
});

// ── 모달 열릴 때만 찜목록 최신화
watch(
  () => props.open,
  async (v) => {
    if (v) {
      lockScroll(true);
      await reloadWishlist();
    } else {
      lockScroll(false);
    }
  }
);

async function reloadWishlist() {
  loading.value = true;
  try {
    const wishlistRes = await getWishlist();
    const lists =
      wishlistRes?.data?.data ?? wishlistRes?.data ?? wishlistRes ?? {};
    const raw = lists.stockList ?? [];
    const baseIdStr = String(props.baseId);
    const seen = new Set();
    products.value = raw
      .map(mapToCard)
      .filter((p) => p && p.id && p.id !== baseIdStr)
      .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  } catch (e) {
    products.value = [];
  } finally {
    loading.value = false;
  }
}

// 응답 → 카드 데이터 표준화
function mapToCard(x) {
  const idRaw = String(x.stockCode ?? x.code ?? x.id ?? '');
  const id = idRaw ? idRaw.padStart(6, '0') : '';
  const name = x.stockName ?? x.name ?? x.title ?? '';
  return { ...x, id, name };
}

// 기존 선택/드래그/검색 등 로직 제거
function lockScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
}
function onKey(e) {
  /* ESC 무시 */
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

const selectedIds = ref([]);

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } else {
    if (selectedIds.value.length >= 2) return;
    selectedIds.value = [...selectedIds.value, id];
  }
}

function onCompare() {
  emit('confirm', selectedIds.value);
  emit('update:open', false);
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  min-width: 280px;
  width: 370px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}
.modal-header h3 {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
}
.stock-card {
  width: 340px;
  padding: 0px;
  border-radius: 12px;
  background: #f7f7f7;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}
.close-btn {
  margin-top: 16px;
  background: #eee;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
.empty {
  text-align: center;
  color: #888;
  padding: 16px 0;
}
.scroll-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.selectable-card {
  width: 100%;
  max-width: 340px;
  margin: 0 auto 16px auto;
  cursor: pointer;
  border-radius: 18px;
  transition: box-shadow 0.25s, background 0.25s, border 0.25s;
  box-sizing: border-box;
  background: #f9fafb;
  border: 1.5px solid #e5e8eb;
  box-shadow: 0 2px 12px 0 rgba(30, 32, 36, 0.04);
  position: relative;
  overflow: hidden;
}
.selectable-card:hover {
  background: #f1f4f8;
  border: 1.5px solid #bcd7f7;
  box-shadow: 0 4px 16px 0 rgba(30, 32, 36, 0.08);
}
.selectable-card.selected {
  background: #eaf4ff;
  border: 2px solid #3182f6;
  box-shadow: 0 0 0 2px #3182f6, 0 6px 24px 0 rgba(49, 130, 246, 0.1);
}
.selectable-card:active {
  background: #e3eaf5;
  border: 2px solid #3182f6;
}
.compare-btn {
  width: 100%;
  margin-top: 16px;
  background: #2b8a3e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.compare-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
