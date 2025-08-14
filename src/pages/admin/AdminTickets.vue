<template>
  <div class="wrap">
    <div class="toolbar">
      <input v-model="q" placeholder="제목/내용 검색" />
      <button @click="load">새로고침</button>
    </div>

    <div class="list" v-if="tickets.length">
      <div v-for="t in filtered" :key="t.id" class="row">
        <div class="head">
          <div class="title">
            <strong>#{{ t.id }}</strong>
            <span>{{ t.title }}</span>
            <small>by {{ t.userNickname ?? ('user#' + t.userId) }} · {{ formatDate(t.createdAt) }}</small>
          </div>
          <span class="badge" :class="{ pending: !t.answered, done: t.answered }">
            {{ t.answered ? '답변완료' : '대기' }}
          </span>
        </div>
        <p class="body">{{ t.content }}</p>

        <div class="reply" v-if="!t.answered">
          <textarea v-model="t._reply" rows="3" placeholder="관리자 답변을 입력하세요"></textarea>
          <div class="actions">
            <button @click="submitReply(t)" :disabled="t._loading">
              {{ t._loading ? '전송 중...' : '답변 등록' }}
            </button>
          </div>
        </div>

        <div class="answer" v-else>
          <h4>답변</h4>
          <p>{{ t.answer }}</p>
        </div>
      </div>
    </div>

    <div v-else class="empty">문의가 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { listTickets, replyTicket } from '@/api/admin';

const tickets = ref([]);
const q = ref('');

const filtered = computed(() => {
  const s = q.value?.trim();
  if (!s) return tickets.value;
  return tickets.value.filter(
      (t) =>
          String(t.title).includes(s) ||
          String(t.content).includes(s) ||
          String(t.answer ?? '').includes(s)
  );
});

function formatDate(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('ko-KR');
  } catch {
    return iso;
  }
}

async function load() {
  const res = await listTickets();
  tickets.value = (res || []).map((t) => ({ ...t, _reply: '' }));
}

async function submitReply(t) {
  if (!t._reply?.trim()) {
    alert('답변을 입력하세요.');
    return;
  }
  t._loading = true;
  try {
    await replyTicket(t.id, t._reply);
    t.answer = t._reply;
    t.answered = true;
    t._reply = '';
    alert('답변이 등록되었습니다.');
  } catch (e) {
    console.error(e);
    alert('등록 실패');
  } finally {
    t._loading = false;
  }
}

onMounted(load);
</script>

<style scoped>
.wrap { display:grid; gap:16px; }
.toolbar { display:flex; gap:8px; }
.toolbar input { flex:1; padding:10px; border:1px solid #ddd; border-radius:8px; }
.toolbar button { padding:10px 12px; border:none; border-radius:8px; background:#111; color:#fff; }
.list { display:grid; gap:12px; }
.row { background:#fff; border:1px solid #eee; border-radius:12px; padding:14px; }
.head { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.title { display:flex; flex-direction:column; gap:2px; }
.title strong { font-size:12px; color:#888; }
.title span { font-weight:700; }
.title small { color:#999; }
.badge { border-radius:999px; padding:4px 8px; font-size:12px; }
.badge.pending { background:#fff2e8; color:#c96b00; }
.badge.done { background:#e8fff0; color:#117a2a; }
.body { white-space:pre-wrap; margin:8px 0 0; }
.reply textarea { width:100%; margin-top:12px; padding:10px; border:1px solid #ddd; border-radius:8px; }
.actions { display:flex; justify-content:flex-end; margin-top:8px; }
.actions button { background:#111; color:#fff; border:none; padding:8px 12px; border-radius:8px; }
.answer { margin-top:12px; background:#fafafa; border:1px dashed #ddd; border-radius:8px; padding:10px; }
.empty { color:#777; }
</style>
