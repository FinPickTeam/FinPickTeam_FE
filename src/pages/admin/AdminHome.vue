<template>
  <div class="wrap">
    <section class="kpis">
      <div class="kpi">
        <div class="kpi-title">이번 달 공통 챌린지</div>
        <div class="kpi-value">{{ commonTitle || '미개설' }}</div>
        <RouterLink class="link" :to="{ name: 'AdminCommonChallenge' }">바로가기</RouterLink>
      </div>
      <div class="kpi">
        <div class="kpi-title">고객센터</div>
        <div class="kpi-value">오픈채팅 관리</div>
        <RouterLink class="link" :to="{ name: 'AdminSupport' }">바로가기</RouterLink>
      </div>
      <div class="kpi">
        <div class="kpi-title">Q&A</div>
        <div class="kpi-value">{{ faqCount }}개</div>
        <RouterLink class="link" :to="{ name: 'AdminFaq' }">바로가기</RouterLink>
      </div>
    </section>

    <section class="quick">
      <button class="cta" @click="$router.push({ name: 'AdminCommonChallenge' })">
        <i class="fa-solid fa-bullseye"></i> 공통 챌린지 생성
      </button>

      <button class="cta outline" @click="$router.push({ name: 'AdminFaq' })">
        <i class="fa-solid fa-circle-question"></i> Q&A 등록
      </button>

      <!-- 🔻 추가: 모달로 로그아웃 확인 -->
      <button
          class="cta danger"
          @click="showLogout = true"
          :disabled="pendingLogout"
          aria-label="관리자 로그아웃"
      >
        <i class="fa-solid fa-right-from-bracket"></i>
        {{ pendingLogout ? '로그아웃 중...' : '로그아웃' }}
      </button>
    </section>

    <!-- 🔻 확인 모달 -->
    <ConfirmModal
        v-model="showLogout"
        title="정말 로그아웃 하시겠습니까?"
        message="현재 계정에서 로그아웃되며, 다시 로그인해야 관리자 메뉴를 이용할 수 있습니다."
        confirm-text="로그아웃"
        cancel-text="취소"
        :loading="pendingLogout"
        @confirm="onConfirmLogout"
        @cancel="onCancelLogout"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ConfirmModal from '@/components/admin/ConfirmModal.vue';

const auth = useAuthStore();
const commonTitle = ref('');
const faqCount = ref(0);

const showLogout = ref(false);
const pendingLogout = ref(false);

onMounted(() => {
  // 대시보드 더미: 로컬스토리지에서 Q&A 개수만 보여줌
  try {
    const raw = localStorage.getItem('admin:faqs');
    const list = raw ? JSON.parse(raw) : [];
    faqCount.value = Array.isArray(list) ? list.length : 0;
  } catch { /* noop */ }
});

function onCancelLogout() {
  // 필요 시 추가 동작 가능
}

async function onConfirmLogout() {
  pendingLogout.value = true;
  try {
    await auth.logout(true); // 서버 /auth/logout → RT 쿠키 삭제 → 상태 초기화 → /login 이동
    // 이동 후 이 컴포넌트는 파기됨
  } finally {
    pendingLogout.value = false;
    showLogout.value = false;
  }
}
</script>

<style scoped>
.wrap { display: grid; gap: 12px; }

.kpis { display: grid; gap: 12px; grid-template-columns: 1fr; }

.kpi { background: #fff; border-radius: 12px; padding: 14px; border: 1px solid #eee; }

.kpi-title { font-size: 12px; color: #777; margin-bottom: 6px; }
.kpi-value { font-size: 18px; font-weight: 800; color: #222; margin-bottom: 6px; }

.link { font-size: 12px; color: var(--color-main, #6b46c1); text-decoration: none; }

.quick { display: grid; grid-template-columns:1fr; gap: 10px; margin-top: 4px; }

.cta {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(135deg, var(--color-main, #6b46c1), var(--color-main-dark, #4c2ea6));
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.cta.outline {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}
.cta.danger {
  background: #fff;
  color: #d92d20;
  border: 1px solid #ffd5d5;
}
.cta.danger:disabled { opacity: .6; }
</style>
