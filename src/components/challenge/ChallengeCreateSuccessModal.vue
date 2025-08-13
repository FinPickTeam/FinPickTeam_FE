<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 성공 아이콘 -->
      <div class="success-icon">
        <div class="success-circle">
          <span class="success-check">✓</span>
        </div>
      </div>

      <!-- 제목 -->
      <h2 class="modal-title">챌린지 생성 완료!</h2>

      <!-- 메시지 -->
      <div class="success-message">
        <p class="success-description">
          챌린지가 성공적으로 생성되었습니다.<br />
          이제 목표를 향해 함께 시작해보세요!
        </p>
      </div>

      <!-- 액션 버튼들 -->
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeModal">
          닫기
        </button>
        <button class="btn btn-primary" @click="goToCreatedChallenge">
          생성한 챌린지 보러가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  // ✅ 추가: 생성된 챌린지 식별자/타입
  challengeId: { type: [Number, String], default: null },
  challengeType: { type: String, default: 'PERSONAL' }, // 'PERSONAL' | 'GROUP' | 'COMMON'
});

const emit = defineEmits(['close']);

const handleOverlayClick = () => {
  emit('close');
};

const closeModal = () => {
  emit('close');
};

const goToCreatedChallenge = () => {
  if (!props.challengeId) {
    // 방어: ID 없으면 목록으로
    emit('close');
    router.push('/challenge');
    return;
  }

  // 타입별 라우팅
  const t = props.challengeType?.toUpperCase?.() || 'PERSONAL';
  if (t === 'PERSONAL') {
    router.push({ name: 'ChallengePersonalDetail', params: { id: props.challengeId } });
  } else if (t === 'GROUP') {
    router.push({ name: 'ChallengeGroupDetail', params: { id: props.challengeId } });
  } else {
    router.push({ name: 'ChallengeCommonDetail', params: { id: props.challengeId } });
  }
  // 라우팅 후 모달 닫기
  // emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  max-width: 380px;
  width: 100%;
  position: relative;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(-20px) scale(0.95); opacity: 0; }
  to   { transform: translateY(0)    scale(1);    opacity: 1; }
}

.success-icon { display: flex; justify-content: center; margin-bottom: 24px; }
.success-circle {
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  animation: pulse 0.6s ease;
}
@keyframes pulse { 0%{transform:scale(0.8)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }
.success-check { font-size: 36px; color: white; font-weight: bold; }

.modal-title { font-size: 24px; font-weight: bold; color: #333; margin: 0 0 20px 0; font-family: var(--font-main); }
.success-message { margin-bottom: 32px; }
.success-description { font-size: 16px; color: #666; line-height: 1.6; margin: 0; font-family: var(--font-main); }

.modal-actions { display: flex; gap: 12px; }
.btn { flex: 1; padding: 14px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; font-family: var(--font-main); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
.btn-secondary { background: #f1f3f4; color: #666; }
.btn-secondary:hover { background: #e8eaed; transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, var(--color-main) 0%, var(--color-main-dark) 100%); color: white; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(var(--color-main-rgb), 0.3); }
</style>
