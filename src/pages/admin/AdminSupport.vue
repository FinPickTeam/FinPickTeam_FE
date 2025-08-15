<template>
  <div class="wrap">
    <section class="card">
      <h2>고객센터 (카카오 오픈채팅)</h2>
      <p class="hint">
        고객 문의는 카카오 오픈채팅방에서 처리합니다. 아래 버튼으로 이동하세요.
      </p>
      <a class="kakao" :href="KAKAO_OPEN_CHAT_URL" target="_blank" rel="noopener">
        <i class="fa-brands fa-kickstarter"></i>
        오픈채팅방 열기
      </a>
      <ul class="tips">
        <li>휴대폰에서는 카카오톡 앱이 실행됩니다.</li>
        <li>운영 시간/응답 가이드는 Q&A 등록 메뉴에 정리해두세요.</li>
      </ul>
    </section>

    <section class="card">
      <h3>자주 쓰는 답변 템플릿</h3>
      <div class="chips">
        <button v-for="(t,i) in templates" :key="i" @click="copy(t)">
          {{ t.title }}
        </button>
      </div>
      <textarea class="preview" v-model="draft" rows="6" placeholder="템플릿을 누르면 여기 복사됩니다. 카카오톡에 붙여넣기 하세요."></textarea>
      <div class="right">
        <button class="copyall" @click="copy(draft)">전체 복사</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { OPEN_CHAT_URL } from '@/config/support';

const KAKAO_OPEN_CHAT_URL = OPEN_CHAT_URL

const draft = ref('');
const templates = [
  { title: '운영시간', text: '안녕하세요, 핀픽 고객센터입니다. 평일 10:00~18:00 운영합니다.' },
  { title: '포인트반영', text: '챌린지 포인트는 결과 확인 후 익일 09시에 반영됩니다.' },
  { title: '탈퇴경로', text: '마이페이지 > 회원탈퇴에서 진행하실 수 있습니다.' },
];

function copy(v) {
  const txt = typeof v === 'string' ? v : v.text;
  if (!txt) return;
  navigator.clipboard.writeText(txt);
  draft.value = txt;
  alert('클립보드에 복사되었습니다.');
}
</script>

<style scoped>
.wrap { display:grid; gap:12px; }
.card { background:#fff; border:1px solid #eee; border-radius:12px; padding:14px; }
h2 { margin:0 0 8px; font-size:18px; }
h3 { margin:0 0 8px; font-size:16px; }
.hint { color:#666; font-size:13px; }
.kakao {
  margin-top:10px; display:inline-flex; align-items:center; gap:8px;
  background:#fee500; color:#111; padding:12px 14px; border-radius:10px; text-decoration:none; font-weight:700;
}
.tips { margin:10px 0 0; padding-left:18px; color:#777; font-size:12px; }
.chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
.chips button { border:1px solid #ddd; background:#fff; border-radius:999px; padding:6px 10px; font-size:12px; }
.preview { width:100%; margin-top:6px; padding:10px; border:1px solid #ddd; border-radius:10px; }
.right { display:flex; justify-content:flex-end; margin-top:8px; }
.copyall { border:1px solid #ddd; background:#fff; border-radius:10px; padding:8px 12px; }
</style>
