<template>
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
      @click.self="close"
    >
      <Transition name="modal-pop">
        <div class="modal-content">
          <!-- 헤더 -->
          <header class="modal-header">
            <h3 id="wishlist-title">내 주식 찜 목록</h3>
            <span class="counter"
              >{{ selectedIds.length }} / {{ MAX_SELECT }}</span
            >
            <button class="icon-btn" aria-label="닫기" @click="close">×</button>
          </header>

          <!-- 서브타이틀 -->
          <p class="subtitle">
            비교할 종목을 최대 {{ MAX_SELECT }}개 선택하세요.
          </p>

          <!-- 컨텐트 -->
          <div v-if="loading" class="skeleton-list">
            <div class="skeleton-card" v-for="i in 4" :key="i">
              <div class="skel-left">
                <div class="skel-line w60"></div>
                <div class="skel-line w40"></div>
              </div>
              <div class="skel-right">
                <div class="skel-line w50"></div>
                <div class="skel-line w30"></div>
              </div>
            </div>
          </div>

          <div v-else-if="products.length === 0" class="empty">
            <div class="empty-emoji">📭</div>
            <p>찜한 상품이 없습니다.</p>
          </div>

          <div v-else class="scroll-list">
            <div
              v-for="stock in products"
              :key="stock.id"
              class="selectable-card"
              :class="{ disabled: isDisabled(stock.id) }"
              role="checkbox"
              :aria-checked="selectedIds.includes(stock.id)"
              :aria-disabled="isDisabled(stock.id)"
              tabindex="0"
              @keydown.enter.prevent="toggleSelect(stock.id)"
              @keydown.space.prevent="toggleSelect(stock.id)"
              @click="toggleSelect(stock.id)"
            >
              <StockCompareCard
                :product="stock"
                :selected="selectedIds.includes(stock.id)"
                :disabled="isDisabled(stock.id)"
              />
            </div>
          </div>

          <!-- 푸터 -->
          <footer class="modal-footer">
            <button
              class="ghost-btn"
              v-if="selectedIds.length"
              @click="selectedIds = []"
            >
              선택 초기화
            </button>
            <button
              class="compare-btn"
              :disabled="selectedIds.length === 0"
              @click="onCompare"
            >
              비교하기 ({{ selectedIds.length }}/{{ MAX_SELECT }})
            </button>
          </footer>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { getWishlist } from '@/api';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import StockCompareCard from './StockCompareCard.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  baseId: { type: String, required: true }, // 목록에서 자기 자신 제외 용도
  preselected: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:open', 'confirm']);

const MAX_SELECT = 3; // ✅ 최대 3개

const products = ref([]);
const loading = ref(false);
const selectedIds = ref([]);

// 열림/닫힘 감시
watch(
  () => props.open,
  async (v) => {
    if (v) {
      lockScroll(true);
      await reloadWishlist();
      selectedIds.value = [];
    } else {
      lockScroll(false);
      selectedIds.value = [];
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
  } catch {
    products.value = [];
  } finally {
    loading.value = false;
  }
}

// 응답 → 카드 표준화
function mapToCard(x) {
  const idRaw = String(x.stockCode ?? x.code ?? x.id ?? '');
  const id = idRaw ? idRaw.padStart(6, '0') : '';
  const name = x.stockName ?? x.name ?? x.title ?? '';
  return { ...x, id, name };
}

// 접근성/키보드
function close() {
  emit('update:open', false);
}
function lockScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
}
function onKey(e) {
  if (!props.open) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

// 선택 로직
function isDisabled(id) {
  return (
    selectedIds.value.length >= MAX_SELECT && !selectedIds.value.includes(id)
  );
}
function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } else {
    if (selectedIds.value.length >= MAX_SELECT) return;
    selectedIds.value = [...selectedIds.value, id];
  }
}

function onCompare() {
  emit('confirm', selectedIds.value);
  selectedIds.value = [];
  emit('update:open', false);
}
</script>

<style scoped>
/* ========= Transitions ========= */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}

/* ========= Layout ========= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 28, 0.45);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-content {
  width: min(92vw, 420px);
  max-height: 84vh;

  display: flex;
  flex-direction: column;

  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px;
  background: linear-gradient(
    180deg,
    rgba(250, 250, 252, 0.95),
    rgba(255, 255, 255, 0.95)
  );
  border-bottom: 1px solid #f1f3f5;
}
.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}
.counter {
  margin-left: auto;
  font-size: 12px;
  color: #667085;
  background: #f3f4f6;
  border: 1px solid #eceff3;
  border-radius: 999px;
  padding: 2px 8px;
}
.icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  touch-action: manipulation;
}
.icon-btn:hover {
  background: #f3f4f6;
}
.icon-btn:focus-visible {
  outline: 3px solid #a5b4fc;
  outline-offset: 2px;
}

.subtitle {
  margin: 8px 14px 0 14px;
  font-size: 12px;
  color: #778;
  letter-spacing: 0.1px;
}

.scroll-list {
  padding: 12px 14px 0 14px;
  overflow: auto;
}

/* ========= Skeleton ========= */
.skeleton-list {
  padding: 12px 14px;
}
.skeleton-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
  border: 1px solid #eef0f3;
  background: #fafbfc;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
}
.skel-left,
.skel-right {
  display: grid;
  gap: 8px;
}
.skel-line {
  height: 10px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f3f5 0%, #e9ecef 50%, #f1f3f5 100%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}
.skel-line.w60 {
  width: 60%;
}
.skel-line.w50 {
  width: 50%;
}
.skel-line.w40 {
  width: 40%;
}
.skel-line.w30 {
  width: 30%;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ========= Empty ========= */
.empty {
  padding: 40px 16px;
  text-align: center;
  color: #888;
}
.empty-emoji {
  font-size: 28px;
  margin-bottom: 8px;
}

/* ========= Cards Wrapper ========= */
.selectable-card {
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.08s ease;
}
.selectable-card:not(.disabled):active {
  transform: translateY(1px);
}
.selectable-card.disabled {
  pointer-events: none;
  opacity: 0.6;
}

/* ========= Footer ========= */
.modal-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  padding: 12px 14px 14px 14px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.96),
    rgba(255, 255, 255, 0.92)
  );
  border-top: 1px solid #f1f3f5;
}
.ghost-btn {
  min-width: 96px;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #4b5563;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.ghost-btn:hover {
  background: #f8fafc;
}

.compare-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: var(--color-main, #6b7cff);
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.2px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(107, 124, 255, 0.25);
  transition: transform 0.06s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}
.compare-btn:hover {
  box-shadow: 0 8px 18px rgba(107, 124, 255, 0.33);
}
.compare-btn:active {
  transform: translateY(1px);
}
.compare-btn:disabled {
  background: #d1d5db;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.9;
}
</style>
