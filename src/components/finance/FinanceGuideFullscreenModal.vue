<template>
  <Teleport to="body">
    <div v-if="modelValue" class="gf-backdrop" @click.self="onBackdrop">
      <button class="gf-close" @click="close" aria-label="닫기">✕</button>

      <div class="gf-stage" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <!-- 가이드 이미지 -->
        <img
          class="gf-image"
          :src="images[current]"
          :alt="`재테크 가이드 ${current + 1}`"
          @load="onLoad"
        />

        <!-- 하단 컨트롤 -->
        <div class="gf-footer">
          <div class="gf-dots">
            <span
              v-for="(it, i) in images"
              :key="i"
              class="dot"
              :class="{ active: i === current }"
            ></span>
          </div>

          <div class="gf-actions">
            <button class="btn-subtle" @click="skip">건너뛰기</button>
            <button class="btn-primary" @click="next">
              {{ current === images.length - 1 ? '확인' : '다음' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  images: { type: Array, required: true }, // ['/assets/guide/step1.png', ...]
  closeOnBackdrop: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'finish', 'change']);

const current = ref(0);
let touchX = 0;

function lockScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
}

watch(
  () => props.modelValue,
  (v) => lockScroll(v),
  { immediate: true }
);
onBeforeUnmount(() => lockScroll(false));

function next() {
  if (current.value < props.images.length - 1) {
    current.value++;
    emit('change', current.value);
  } else {
    close();
    emit('finish');
  }
}
function skip() {
  close();
  emit('finish');
}
function close() {
  emit('update:modelValue', false);
  lockScroll(false);
}
function onBackdrop() {
  if (props.closeOnBackdrop) close();
}
function onTouchStart(e) {
  touchX = e.changedTouches[0].clientX;
}
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchX;
  const threshold = 40;
  if (dx > threshold && current.value > 0) {
    current.value--;
    emit('change', current.value);
  } else if (dx < -threshold && current.value < props.images.length - 1) {
    next();
  }
}
function onLoad() {
  // 필요 시 이미지 로드 완료 후 애니메이션 등 처리
}
</script>

<style scoped>
/* 전체 오버레이 */
.gf-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.65);
  display: grid;
  place-items: center;
}
/* 닫기 버튼 */
.gf-close {
  position: fixed;
  top: calc(env(safe-area-inset-top, 16px) + 20px);
  right: 16px;
  width: 36px;
  height: 36px;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: #fff;
}

/* 콘텐츠 영역 */
.gf-stage {
  width: min(92vw, 420px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}
.gf-image {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  user-select: none;
  -webkit-user-drag: none;
}

/* 하단 컨트롤 */
.gf-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.gf-dots {
  display: flex;
  gap: 8px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}
.dot.active {
  background: #fff;
  transform: scale(1.15);
}

.gf-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}
.btn-subtle {
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-subtle:hover {
  background: rgba(255, 255, 255, 0.2);
}
.btn-primary {
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-main);
  color: #fff;
  border: none;
  box-shadow: 0 8px 18px rgba(67, 24, 209, 0.35);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--color-main-dark);
}
</style>
