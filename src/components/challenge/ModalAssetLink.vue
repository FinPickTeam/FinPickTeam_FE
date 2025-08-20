<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="challenge-modal__backdrop" @click.self="onClose">
        <div
          class="challenge-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="challenge-modal-title"
        >
          <!-- 본문 -->
          <section class="challenge-modal__body">
            <h3 class="challenge-modal__title">
              챌린지 참여를 위해<br />
              내 자산을 연동해주세요
            </h3>
            <p class="challenge-modal__subtitle">
              보유한 자산을 연동해야 챌린지에 참여할 수 있습니다.
            </p>
            <img :src="IMG" alt="" />
          </section>

          <!-- 푸터 -->
          <footer class="challenge-modal__footer">
            <button class="challenge-modal__cta" @click="onConfirm">
              자산 연동하기
            </button>
            <button class="challenge-modal__skip" @click="onSkip">
              다음에 할게요
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="js">
import { useRouter } from 'vue-router'
import IMG from '@/assets/challenge/전구.png'

const router = useRouter()

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'confirm', 'skip'])

const onClose = () => emit('close')
const onConfirm = () => {
  emit('confirm')
  // 자산 연동 페이지로 이동
  router.push({ path: '/' })
}
const onSkip = () => emit('skip')
</script>

<style scoped>
/* 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
img {
  width: 70%;
  height: auto;
  margin-top: 20px;
  border-radius: 10px;
}
/* 배경 */
.challenge-modal__backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

/* 모달 */
.challenge-modal {
  width: 92%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 헤더 */
.challenge-modal__header {
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}
.challenge-modal__header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}
.challenge-modal__close {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

/* 본문 */
.challenge-modal__body {
  padding: 20px;
  text-align: center;
}
.challenge-modal__title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.4;
}
.challenge-modal__subtitle {
  color: #6b7280;
  font-size: 15px;
  margin: 0;
}

/* 푸터 */
.challenge-modal__footer {
  display: grid;
  gap: 10px;
  padding: 16px 20px 20px;
}
.challenge-modal__cta {
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #5b21b6; /* 보라색 */
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}
.challenge-modal__cta:active {
  transform: translateY(1px);
}
.challenge-modal__skip {
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
</style>
