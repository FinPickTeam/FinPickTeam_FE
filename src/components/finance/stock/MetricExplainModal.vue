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
              <h3 :id="ids.title">투자 지표 설명</h3>
            </header>

            <!-- 서브타이틀 -->
            <p class="subtitle" :id="ids.desc">
              초보자도 이해하기 쉽게 핵심만 정리했어요. (숫자 예시는 생략)
            </p>

            <!-- 본문: 배열 기반 렌더링 -->
            <div class="scroll-list" ref="scrollEl">
              <template v-for="card in cards" :key="card.title">
                <section class="explain-card">
                  <h4 class="ex-title">{{ card.title }}</h4>
                  <p v-for="(l, i) in card.lines" :key="i" class="ex-line">
                    {{ l }}
                  </p>
                </section>
              </template>

              <div class="tip">
                💡 지표는 <b>업종</b>·<b>경기</b>·<b>시기</b>에 따라 적정 범위가
                달라요. 동종 업종과 과거 추세를 함께 보세요.
              </div>
            </div>

            <!-- 푸터 -->
            <footer class="modal-footer">
              <button class="ghost-btn" @click="close">닫기</button>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
  nextTick,
} from 'vue';

const props = defineProps<{
  open: boolean;
  /** 'investment' | 'core' */
  type?: 'investment' | 'core';
}>();
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'opened'): void;
  (e: 'closed'): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
const ids = {
  title: `metric-title-${Math.random().toString(36).slice(2, 8)}`,
  desc: `metric-desc-${Math.random().toString(36).slice(2, 8)}`,
};
const mode = computed(() => props.type ?? 'investment');

/** 카드 데이터 (런타임 컴파일러 불필요) */
const cards = computed(() => {
  if (mode.value === 'core') {
    return [
      { title: '현재가', lines: ['지금 거래되는 주식 가격'] },
      { title: '등락률', lines: ['전일 대비 상승/하락 비율(%)'] },
      { title: '시가총액', lines: ['회사 전체 가치를 시장이 평가한 금액'] },
      {
        title: 'PER',
        lines: ['주가 ÷ 주당순이익(EPS) = 이익 대비 몇 배 가격인지'],
      },
      {
        title: '배당률',
        lines: ['주당 배당금 ÷ 주가 × 100 = 배당으로 받는 비율'],
      },
    ];
  }
  return [
    {
      title: 'BPS (주당순자산)',
      lines: [
        '정의: 회사의 순자산 ÷ 발행주식 수',
        '쉽게: 1주가 차지하는 회사의 장부가치',
        '의미: 자산이 탄탄한지 보는 지표(동종 업종 비교 권장)',
      ],
    },
    {
      title: 'EPS (주당순이익)',
      lines: [
        '정의: 회사 순이익 ÷ 발행주식 수',
        '쉽게: 내 주식 1주가 1년에 벌어들이는 돈',
        '의미: 기업의 수익성 비교의 기본 지표',
      ],
    },
    {
      title: 'ROE (자기자본이익률)',
      lines: [
        '정의: 순이익 ÷ 자기자본 × 100',
        '쉽게: 내 돈 100을 넣어서 몇 % 수익을 내는지',
        '의미: 높을수록 자본을 효율적으로 굴린다는 뜻',
      ],
    },
    {
      title: 'PBR (주가순자산비율)',
      lines: [
        '정의: 주가 ÷ BPS',
        '쉽게: 장부가치(자산가치) 대비 주가가 몇 배인지',
        '의미: 1배 미만이면 자산가치 대비 저평가로 보기도 함',
      ],
    },
  ];
});

function close() {
  emit('update:open', false);
}

/* 스크롤 락 + 포커스 트랩(간단) */
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
  const first = focusables[0],
    last = focusables[focusables.length - 1];
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
  .modal-pop-leave-active {
    transition: none !important;
  }
}
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
  width: min(92vw, 520px);
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

.explain-card {
  border: 1px solid #eef0f3;
  background: #fafbfc;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
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
.tip {
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #475467;
  font-size: 12px;
}

.modal-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 14px 14px;
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
</style>
