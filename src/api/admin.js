import api from '@/api/instance';

// ── 공통 챌린지 생성
export const createCommonChallenge = (payload) =>
    api.post('/challenge/create', {
        title: payload.title,
        categoryId: payload.categoryId,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
        goalType: payload.goalType ?? '소비',
        goalValue: payload.goalValue,
        usePassword: false,
        password: null,
        type: 'COMMON',
    }).then(res => res.data?.data ?? res.data);

// ── (참고용) 고객센터 REST가 생기면 사용, 없으면 FE에서 오픈채팅으로 처리
export const listTickets = async () => {
    try {
        const res = await api.get('/support/tickets');
        return res.data?.data ?? res.data ?? [];
    } catch {
        return [];
    }
};
export const replyTicket = async (id, answer) => {
    try {
        const res = await api.post(`/support/tickets/${id}/reply`, { answer });
        return res.data?.data ?? true;
    } catch {
        return true;
    }
};

// ── Q&A (백엔드 있으면 사용, 없으면 localStorage)
const LS_KEY = 'admin:faqs';
const LS_CAT = 'admin:faqCats';

function lsRead(key, def = []) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; } catch { return def; }
}
function lsWrite(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

export async function listFaqCategories() {
    try {
        const r = await api.get('/admin/faq/categories');
        return r.data?.data ?? r.data ?? lsRead(LS_CAT, ['일반','챌린지','포인트']);
    } catch {
        return lsRead(LS_CAT, ['일반','챌린지','포인트']);
    }
}
export async function createFaqCategory(name) {
    try {
        const r = await api.post('/admin/faq/categories', { name });
        return r.data?.data ?? r.data ?? true;
    } catch {
        const cats = lsRead(LS_CAT, ['일반','챌린지','포인트']);
        if (!cats.includes(name)) { cats.push(name); lsWrite(LS_CAT, cats); }
        return true;
    }
}

export async function listFaqs() {
    try {
        const r = await api.get('/admin/faq');
        return r.data?.data ?? r.data ?? lsRead(LS_KEY, []);
    } catch {
        return lsRead(LS_KEY, []);
    }
}
export async function createFaq(item) {
    try {
        const r = await api.post('/admin/faq', item);
        return r.data?.data ?? r.data;
    } catch {
        const list = lsRead(LS_KEY, []);
        const saved = { id: Date.now(), ...item };
        list.unshift(saved); lsWrite(LS_KEY, list);
        return saved;
    }
}
export async function deleteFaq(id) {
    try {
        const r = await api.delete(`/admin/faq/${id}`);
        return r.data?.data ?? r.data ?? true;
    } catch {
        const list = lsRead(LS_KEY, []).filter(x => x.id !== id);
        lsWrite(LS_KEY, list);
        return true;
    }
}
