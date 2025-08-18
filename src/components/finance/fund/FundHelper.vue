<!-- FundTypeHelper.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="ids.title"
        :aria-describedby="ids.desc"
        @click.self="close"
      >
        <Transition name="modal-pop">
          <div
            v-if="open"
            class="modal-content"
            ref="modalEl"
            @keydown.esc.prevent.stop="close"
          >
            <!-- 헤더: 왼쪽 정렬 + X 버튼 -->
            <header class="modal-header">
              <h3 :id="ids.title">📌 펀드 타입 한눈에 보기</h3>
              <button class="icon-btn" aria-label="닫기" @click="close">
                ×
              </button>
            </header>

            <!-- 서브타이틀 -->
            <p class="subtitle" :id="ids.desc">
              펀드는 무엇에 투자하느냐에 따라 성격이 달라져요. 핵심만 간단히
              정리했어요.
            </p>

            <!-- 본문 -->
            <div class="scroll-list" ref="scrollEl">
              <!-- 한눈에 보기 -->
              <section class="card">
                <h4 class="card-title">요약</h4>
                <ul class="bullets">
                  <li>
                    <b>주식형</b> — 주식에 투자, <b>위험 높음</b> ·
                    <b>수익 잠재력 큼</b>
                  </li>
                  <li>
                    <b>채권형</b> — 채권에 투자, <b>위험 낮음</b> ·
                    <b>안정적</b>
                  </li>
                  <li><b>혼합형</b> — 주식+채권 섞음, <b>중간 위험</b></li>
                </ul>
              </section>

              <!-- 간단 비교표 -->
              <section class="card">
                <h4 class="card-title">간단 비교</h4>
                <div class="table" role="table" aria-label="펀드 타입 비교">
                  <div class="row head" role="row">
                    <div class="cell" role="columnheader">타입</div>
                    <div class="cell" role="columnheader">투자대상</div>
                    <div class="cell title" role="columnheader">위험/수익</div>
                    <div class="cell" role="columnheader">누구에게</div>
                  </div>
                  <div class="row" role="row">
                    <div class="cell">주식형</div>
                    <div class="cell">국내/해외 주식</div>
                    <div class="cell">높음 / 큼</div>
                    <div class="cell">성장에 베팅, 장기투자</div>
                  </div>
                  <div class="row" role="row">
                    <div class="cell">채권형</div>
                    <div class="cell">국채·회사채</div>
                    <div class="cell">낮음 / 낮~중</div>
                    <div class="cell">안정·예상 가능한 수익</div>
                  </div>
                  <div class="row" role="row">
                    <div class="cell">혼합형</div>
                    <div class="cell">주식+채권</div>
                    <div class="cell">중간 / 중간</div>
                    <div class="cell">균형형 성향</div>
                  </div>
                </div>
              </section>

              <!-- 상세: 전체폭 토글 버튼 + 회전 화살표 -->
              <section class="card">
                <button
                  class="toggle-btn full"
                  :aria-expanded="openDetails ? 'true' : 'false'"
                  :aria-controls="ids.details"
                  @click="openDetails = !openDetails"
                >
                  <span class="toggle-label">{{
                    openDetails ? '상세 닫기' : '상세 보기'
                  }}</span>
                  <svg
                    class="chev"
                    :class="{ open: openDetails }"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <Transition name="collapse">
                  <div
                    v-show="openDetails"
                    :id="ids.details"
                    class="details"
                    role="region"
                    :aria-labelledby="ids.title"
                  >
                    <div class="detail">
                      <h5>주식형</h5>
                      <p style="font-size: 13px">
                        주식 비중이 높아 변동성이 크지만 장기 수익 잠재력이
                        큽니다.
                      </p>
                      <ul class="bullets">
                        <li>장점: 성장성, 장기 복리 효과</li>
                        <li>리스크: 시장 급락, 섹터/기업 이슈</li>
                        <li>적합: 기간이 길고 변동성 수용 가능</li>
                      </ul>
                    </div>

                    <div class="detail">
                      <h5>채권형</h5>
                      <p style="font-size: var(--font-size-body)">
                        국채·회사채 등 이자 자산 위주. 비교적 안정적이며 예측
                        가능한 수익.
                      </p>
                      <ul class="bullets">
                        <li>장점: 낮은 변동성, 현금흐름</li>
                        <li>리스크: 금리 상승 시 가격 하락</li>
                        <li>적합: 원금 변동을 크게 원치 않음</li>
                      </ul>
                    </div>

                    <div class="detail">
                      <h5>혼합형(밸런스)</h5>
                      <p style="font-size: var(--font-size-body)">
                        주식과 채권을 섞어 중간 위험/수익을 목표.
                      </p>
                      <ul class="bullets">
                        <li>장점: 분산효과, 완충</li>
                        <li>리스크: 강·약세장에서 각각 아쉬울 수 있음</li>
                        <li>적합: 무난한 균형 추구</li>
                      </ul>
                    </div>
                  </div>
                </Transition>
              </section>

              <!-- 안내 박스: 실선 박스 -->
              <div class="note solid">
                같은 타입의 펀드라도 <b>운용사</b>, <b>전략</b>,
                <b>보수·수수료</b>가 달라 성과와 위험이 크게 달라질 수 있습니다.
                가입 전 <b>수수료(총보수)</b>, <b>위험등급</b>,
                <b>투자설명서</b>를 꼭 확인하세요.
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'opened'): void;
  (e: 'closed'): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
const ids = {
  title: `fund-title-${Math.random().toString(36).slice(2, 8)}`,
  desc: `fund-desc-${Math.random().toString(36).slice(2, 8)}`,
  details: `fund-details-${Math.random().toString(36).slice(2, 8)}`,
};

const openDetails = ref(false);

function close() {
  emit('update:open', false);
}

/* 스크롤 락 + 포커스 트랩 */
function lockScroll(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : '';
}
function trapFocus(e: KeyboardEvent) {
  if (!props.open || e.key !== 'Tab' || !modalEl.value) return;
  const focusables = Array.from(
    modalEl.value.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    (last as HTMLElement).focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    (first as HTMLElement).focus();
  }
}
function onKey(e: KeyboardEvent) {
  if (props.open && e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

watch(
  () => props.open,
  async (v) => {
    lockScroll(v);
    if (v) {
      openDetails.value = false;
      await nextTick();
      modalEl.value?.querySelector<HTMLElement>('.icon-btn')?.focus();
      window.addEventListener('keydown', trapFocus);
      emit('opened');
    } else {
      window.removeEventListener('keydown', trapFocus);
      emit('closed');
    }
  }
);
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('keydown', trapFocus);
  lockScroll(false);
});
</script>

<style scoped>
* {
  font-family: var(--font-main);
}

/* 애니메이션 */
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

/* 레이아웃/스타일 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 28, 0.45);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 2000;
}
.modal-content {
  width: min(92vw, 560px);
  max-height: 84vh;
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px;
  border-bottom: 1px solid #f1f3f5;
  background: linear-gradient(180deg, #fafafa, #fff);
}
.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  text-align: left;
}
.icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
}
.icon-btn:hover {
  background: #f3f4f6;
}

.subtitle {
  margin: 8px 14px 0;
  font-size: 12px;
  color: #778;
  text-align: center;
}
.scroll-list {
  padding: 12px 14px 14px;
  overflow: auto;
}

/* 카드 */
.card {
  border: 1px solid #eef0f3;
  border-radius: 12px;
  background: #fafbfc;
  padding: 12px;
  margin-top: 12px;
}
.card-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 800;
}
.bullets {
  margin: 6px 0 0;
  padding-left: 18px;
}
.bullets li {
  margin: 5px 0;
  font-size: 13px;
  color: #374151;
}

/* 비교표 */
.table {
  border: 1px solid #eceff3;
  border-radius: 10px;
  overflow: hidden;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1.1fr 0.9fr 1.2fr;
}
.row.head {
  background: #f3f4f6;
  font-weight: 700;
}
.cell {
  padding: 6px 10px;
  border-top: 1px solid #eceff3;
  font-size: 12.5px;
  color: #3b3b3b;
}
.row.head .cell {
  border-top: none;
}
.title {
  white-space: nowrap;
}

/* 상세 토글 버튼 + 화살표 회전 */
.toggle-btn.full {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #374151;
  font-weight: 600;
}
.toggle-btn.full:hover {
  background: #f8fafc;
}
.chev {
  transition: transform 0.18s ease;
  transform: rotate(0deg);
}
.chev.open {
  transform: rotate(180deg);
}

/* 상세 영역 */
.details {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}
.details .detail {
  border: 1px solid #eceff3;
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
}
.details .detail h5 {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 800;
  color: #333;
}

/* collapse */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.22s ease, opacity 0.22s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 900px;
  opacity: 1;
  overflow: hidden;
}

/* 안내 박스: 실선 박스 */
.note.solid {
  margin-top: 10px;
  padding: 12px 14px;
  border: 1px solid #d7d9df;
  border-radius: 10px;
  background: #fff;
  color: #475467;
  font-size: 12.5px;
  line-height: 1.6;
}
</style>
