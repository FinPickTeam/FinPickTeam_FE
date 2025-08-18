<!-- InstallmentHelper.vue -->
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
            <!-- 헤더 -->
            <header class="modal-header">
              <h3 :id="ids.title">📌 적립방식 안내</h3>
              <button class="icon-btn" aria-label="닫기" @click="close">
                ×
              </button>
            </header>

            <!-- 서브타이틀 -->
            <p class="subtitle" :id="ids.desc">
              자유적립식과 정액적립식의 차이를 초보자도 쉽게 볼 수 있게
              정리했어요.
            </p>

            <!-- 본문 -->
            <div class="scroll-list" ref="scrollEl">
              <!-- 한눈에 보기 -->
              <section class="explain-card">
                <h4 class="ex-title">한눈에 보기</h4>
                <ul class="quick-list">
                  <li>
                    <b>공통</b> : 정해진 기간 동안 돈을 모으고, 만기에
                    <b>원금+이자</b>를 받아요.
                  </li>
                  <li>
                    <b>정액적립식</b> : <b>매달 같은 금액</b>을 자동으로
                    저축해요. 꾸준히 모으기 좋아요.
                  </li>
                  <li>
                    <b>자유적립식</b> : <b>매달 금액을 내가 정해</b> 넣어요.
                    이번 달은 적게, 다음 달은 많이도 가능해요.
                  </li>
                </ul>

                <!-- 미니 비교표 -->
                <div
                  class="mini-table"
                  role="table"
                  aria-label="적립방식 간단 비교"
                >
                  <div class="row header" role="row">
                    <div class="cell" role="columnheader">항목</div>
                    <div class="cell" role="columnheader">정액적립식</div>
                    <div class="cell" role="columnheader">자유적립식</div>
                  </div>
                  <div class="row" role="row">
                    <div class="cell">매달 금액</div>
                    <div class="cell">고정</div>
                    <div class="cell">자유</div>
                  </div>
                  <div class="row" role="row">
                    <div class="cell">추천 타입</div>
                    <div class="cell">월급 등 수입 일정</div>
                    <div class="cell">수입 변동/비정기</div>
                  </div>
                  <div class="row" role="row">
                    <div class="cell">우대금리</div>
                    <div class="cell">받기 쉬움</div>
                    <div class="cell">상품별 상이</div>
                  </div>
                </div>
              </section>

              <!-- 유연성/선택 팁 -->
              <div class="tip">
                💡 <b>유연성</b>이 먼저면 <b class="free">자유적립식</b>,
                <b>꾸준함·우대금리</b>가 중요하면
                <b class="fixed">정액적립식</b>이 좋아요.<br />
                상품마다 <b>우대조건</b>(자동이체·회차·카드 사용 등)과
                <b>규칙</b>이 다르니 가입 전에 꼭 확인하세요.
              </div>

              <!-- 상세 (한 토글로 두 방식 모두 보기) -->
              <section class="explain-card">
                <div class="card-header">
                  <button
                    class="toggle-btn"
                    :aria-expanded="openDetails"
                    :aria-controls="ids.detailsPanel"
                    @click="openDetails = !openDetails"
                  >
                    <span class="toggle-label">{{
                      openDetails ? '상세 닫기' : '상세 보기'
                    }}</span>
                    <!-- 회전하는 화살표 -->
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
                </div>

                <Transition name="collapse">
                  <div
                    v-show="openDetails"
                    :id="ids.detailsPanel"
                    class="details-grid"
                    role="region"
                    :aria-labelledby="ids.title"
                  >
                    <!-- 정액적립식 -->
                    <div class="detail-col fixed-col">
                      <div class="detail-title">정액적립식</div>
                      <p class="ex-line">
                        • <b>뜻</b> : 매달 같은 날, <b>같은 금액</b>을 자동으로
                        넣는 방식
                      </p>
                      <p class="ex-line">
                        • <b>예시</b> : 매월 25일, 20만 원 자동이체
                      </p>
                      <p class="ex-line">
                        • <b>장점</b> : 꾸준히 모으기 좋고, <b>우대금리</b> 받기
                        유리
                      </p>
                      <p class="ex-line">
                        • <b>단점</b> : 중간에 빠지면 혜택 감소·불이익 가능
                      </p>
                      <p class="ex-line">
                        • <b>추천</b> : 수입이 일정하고 계획적으로 모으고 싶은
                        분
                      </p>
                    </div>

                    <!-- 자유적립식 -->
                    <div class="detail-col free-col">
                      <div class="detail-title">자유적립식</div>
                      <p class="ex-line">
                        • <b>뜻</b> : 매달 <b>금액을 스스로 정해</b> 넣는 방식
                      </p>
                      <p class="ex-line">
                        • <b>예시</b> : 1월 10만, 2월 0원, 3월 30만… 상황에 맞게
                      </p>
                      <p class="ex-line">
                        • <b>장점</b> : 여유 있을 땐 많이, 어려울 땐 적게!
                      </p>
                      <p class="ex-line">
                        • <b>단점</b> : 적게 넣는 달이 많으면 최종 금액이 줄 수
                        있음
                      </p>
                      <p class="ex-line">
                        • <b>추천</b> : 수입 변동이 있는 분, 추가로 더 넣고 싶은
                        분
                      </p>
                    </div>
                  </div>
                </Transition>
              </section>
            </div>

            <!-- 푸터: 닫기 버튼 제거, 안내 문구만 유지 -->
            <footer class="modal-footer">
              <p class="footer-text">
                💡 원하는 적립 방식을 선택하고, 실제 상품 조건(우대금리·납입
                규칙)을 꼭 확인하세요.
              </p>
            </footer>
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
  title: `saving-title-${Math.random().toString(36).slice(2, 8)}`,
  desc: `saving-desc-${Math.random().toString(36).slice(2, 8)}`,
  detailsPanel: `details-${Math.random().toString(36).slice(2, 8)}`,
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
  const [first, last] = [focusables[0], focusables[focusables.length - 1]];
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
@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-pop-enter-active,
  .modal-pop-leave-active,
  .collapse-enter-active,
  .collapse-leave-active {
    transition: none !important;
  }
}

/* 페이드/팝 */
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

/* 접기/펼치기 */
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
  max-height: 800px;
  opacity: 1;
  overflow: hidden;
}

/* 레이아웃 */
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
  width: min(92vw, 560px);
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
  padding: 14px;
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
.icon-btn {
  margin-left: auto;
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
}
.icon-btn:hover {
  background: #f3f4f6;
}

.subtitle {
  margin: 8px 14px 0 14px;
  font-size: 12px;
  color: #778;
  letter-spacing: 0.1px;
}
.scroll-list {
  padding: 12px 14px;
  overflow: auto;
}

/* 카드 */
.explain-card {
  border: 1px solid #eef0f3;
  background: #fafbfc;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.ex-title {
  margin: 0 0 6px;
  font-weight: 800;
  font-size: 14px;
}
.ex-line {
  margin: 4px 0;
  font-size: 13px;
  color: #374151;
}

/* 팁 */
.tip {
  margin: 10px 0;
  padding: 10px 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #475467;
  font-size: 13px;
  line-height: 1.55;
}
.tip .fixed {
  color: #d97706;
}
.tip .free {
  color: #7c3aed;
}

/* 상세 토글 버튼 + 화살표 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.toggle-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #374151;
  font-weight: 600;
}
.toggle-btn:hover {
  background: #f8fafc;
}
.chev {
  transition: transform 0.18s ease;
  transform: rotate(0deg);
}
.chev.open {
  transform: rotate(180deg);
} /* 열리면 뒤집힘 */

/* 상세 그리드 */
.details-grid {
  display: grid;
  gap: 12px;
  margin-top: 10px;
  grid-template-columns: 1fr;
}
@media (min-width: 480px) {
  .details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.detail-col {
  border: 1px solid #eceff3;
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
}
.detail-title {
  font-weight: 800;
  margin-bottom: 6px;
}

/* 한눈에 보기 표 */
.quick-list {
  margin: 8px 0 10px;
  padding-left: 18px;
}
.quick-list li {
  margin: 6px 0;
  font-size: 13px;
  color: #374151;
}
.mini-table {
  border: 1px solid #eceff3;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}
.mini-table .row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
}
.mini-table .row.header {
  background: #f3f4f6;
  font-weight: 700;
}
.mini-table .cell {
  padding: 8px 10px;
  border-top: 1px solid #eceff3;
  font-size: 12.5px;
  color: #3b3b3b;
}
.mini-table .row.header .cell {
  border-top: none;
}

/* 푸터 (닫기 버튼 없음) */
.modal-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 12px 14px 14px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.96),
    rgba(255, 255, 255, 0.92)
  );
  border-top: 1px solid #f1f3f5;
}
.footer-text {
  font-size: 12.5px;
  color: #5b5b5b;
  text-align: center;
}
</style>
