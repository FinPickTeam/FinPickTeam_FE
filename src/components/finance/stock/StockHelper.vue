<!-- MarketHelper.vue -->
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
            <!-- 헤더: 왼쪽 정렬 + X -->
            <header class="modal-header">
              <h3 :id="ids.title">📌 코스피/코스닥 시장 안내</h3>
              <button class="icon-btn" aria-label="닫기" @click="close">
                ×
              </button>
            </header>

            <!-- 서브타이틀 -->
            <p class="subtitle" :id="ids.desc">
              한국 주식시장은 코스피(KOSPI)와 코스닥(KOSDAQ)으로 나뉘어요. 어떤
              기업이 주로 상장되어 있고, 변동성이 어떤지 한 번에 정리했어요.
            </p>

            <!-- 본문 -->
            <div class="scroll-list" ref="scrollEl">
              <!-- 한눈에 보기 -->
              <section class="card">
                <h4 class="card-title">한눈에 보기</h4>
                <ul class="bullets">
                  <li>
                    <b>KOSPI</b> — 대기업·중견기업 중심, <b>변동성 낮은 편</b>,
                    안정적
                  </li>
                  <li>
                    <b>KOSDAQ</b> — 성장·기술주 중심, <b>변동성 높은 편</b>,
                    성장 잠재력
                  </li>
                  <li>
                    <b>지수</b> — 시장 흐름을 보여주는 ‘점수’ (예: 코스피,
                    코스닥)
                  </li>
                  <li>
                    <b>거래</b> — 장전/정규/장후 세션이 있고 체결 방식이 조금
                    달라요
                  </li>
                </ul>
              </section>

              <!-- 간단 비교표 -->
              <section class="card">
                <h4 class="card-title">간단 비교</h4>
                <div class="table" role="table" aria-label="코스피/코스닥 비교">
                  <div class="row head" role="row">
                    <div class="cell nowrap" role="columnheader">구분</div>
                    <div class="cell" role="columnheader">상장 기업 성격</div>
                    <div class="cell nowrap" role="columnheader">변동성</div>
                    <div class="cell" role="columnheader">누구에게</div>
                  </div>

                  <div class="row" role="row">
                    <div class="cell nowrap">KOSPI</div>
                    <div class="cell">
                      시가총액 큰 대형주 다수, 재무 규모·요건 비교적 엄격
                    </div>
                    <div class="cell nowrap">낮은 편</div>
                    <div class="cell">
                      안정·분산 선호, 변동성에 민감한 투자자
                    </div>
                  </div>

                  <div class="row" role="row">
                    <div class="cell nowrap">KOSDAQ</div>
                    <div class="cell">
                      성장·기술 중심의 중소형주, 혁신·성장성 중시
                    </div>
                    <div class="cell nowrap">높은 편</div>
                    <div class="cell">
                      성장 잠재력 선호, 변동성 감내 가능한 투자자
                    </div>
                  </div>
                </div>
              </section>

              <!-- 상세: 전체폭 토글 버튼 하나 -->
              <section class="card">
                <button
                  class="toggle-btn full"
                  :aria-expanded="openDetails"
                  :aria-controls="ids.details"
                  @click="openDetails = !openDetails"
                >
                  <span>{{ openDetails ? '상세 닫기' : '상세 보기' }}</span>
                  <svg
                    class="chev"
                    :class="{ open: openDetails }"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M8.5 10l3.5 3.5L15.5 10"
                      fill="none"
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
                      <h5>시장 구조</h5>
                      <p>
                        <b>코스피</b>는 우리나라를 대표하는 종합 시장으로
                        대형·중견 기업들이 주로 상장돼요. <b>코스닥</b>은
                        성장성이 높은 기업들이 많아 변동성이 큰 편이에요.
                      </p>
                    </div>

                    <div class="detail">
                      <h5>지수와 해석</h5>
                      <p>
                        <b>지수</b>는 시장을 대표하는 점수예요. 코스피·코스닥
                        지수가 오르면 해당 시장 전반의 분위기가 좋다는 뜻이에요
                        (반대도 마찬가지).
                      </p>
                    </div>

                    <div class="detail">
                      <h5>거래 시간과 체결</h5>
                      <ul class="bullets">
                        <li>
                          <b>장전·장후</b>: 단일가/동시호가 중심(일정 주기 한
                          번에 체결)
                        </li>
                        <li><b>정규장</b>: 호가가 맞으면 실시간으로 체결</li>
                      </ul>
                    </div>

                    <div class="detail">
                      <h5>주문 유형 예시</h5>
                      <ul class="bullets">
                        <li><b>지정가</b>: 이 가격(이하/이상)으로만 체결</li>
                        <li>
                          <b>시장가</b>: 지금 빨리 체결(가격보다 속도 우선)
                        </li>
                      </ul>
                    </div>

                    <div class="detail">
                      <h5>유의사항</h5>
                      <p>
                        코스닥은 성장성이 큰 만큼 변동성과 유동성 위험이
                        존재해요. 개별 종목 공시·실적·리스크를 꼭 확인하세요.
                      </p>
                    </div>
                  </div>
                </Transition>
              </section>

              <!-- 주의 박스(실선) -->
              <div class="note solid">
                위 설명은 일반적 경향이며 예외가 있을 수 있어요. 투자 전에는
                <b>거래시간·주문유형·수수료·공시</b> 등을 반드시 확인하세요.
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

/** v-model:open */
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'opened'): void;
  (e: 'closed'): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
const ids = {
  title: `mkt-title-${Math.random().toString(36).slice(2, 8)}`,
  desc: `mkt-desc-${Math.random().toString(36).slice(2, 8)}`,
  details: `mkt-details-${Math.random().toString(36).slice(2, 8)}`,
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
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
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

/* 레이아웃 */
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
  padding: 12px 14px;
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
  font-size: 20px;
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

/* 테이블 */
.table {
  border: 1px solid #eceff3;
  border-radius: 10px;
  overflow: hidden;
}
.row {
  display: grid;
  grid-template-columns: 0.9fr 1.5fr 0.9fr 1.2fr;
}
.row.head {
  background: #f3f4f6;
  font-weight: 700;
}
.cell {
  padding: 8px 10px;
  border-top: 1px solid #eceff3;
  font-size: clamp(12px, 1.2vw, 12.5px);
  color: #3b3b3b;
  line-height: 1.4;
}
.row.head .cell {
  border-top: none;
}
.nowrap {
  white-space: nowrap;
}

/* 상세 토글 */
.toggle-btn.full {
  width: 100%;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  color: #374151;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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

.details {
  display: grid;
  gap: 10px;
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
  font-size: 12.5px;
  font-weight: 800;
  color: #333;
}
.details .detail p,
.details .detail li {
  font-size: 12.5px;
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

/* 실선 주의 박스 */
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

/* 모바일 튜닝 */
@media (max-width: 400px) {
  .row {
    grid-template-columns: 0.9fr 1.4fr 0.8fr 1.2fr;
  }
  .cell {
    padding: 7px 8px;
    font-size: 12px;
  }
  .toggle-btn.full {
    font-size: 11.5px;
    padding: 7px 9px;
  }
}
</style>
