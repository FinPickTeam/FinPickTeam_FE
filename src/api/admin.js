import api from '@/api/instance';

// 공통 챌린지 생성 (백엔드 엔드포인트 확인해서 필요 시 경로만 수정)
// 공통 챌린지 생성
export const createCommonChallenge = (payload) =>
    api.post('/challenge/create', {
        // 백엔드 DTO 필드에 맞춰 필요 값만 전달
        title: payload.title,
        categoryId: payload.categoryId,
        description: payload.description,
        startDate: payload.startDate,     // 'YYYY-MM-DD'
        endDate: payload.endDate,         // 'YYYY-MM-DD'
        goalType: payload.goalType ?? '소비',
        goalValue: payload.goalValue,
        usePassword: false,
        password: null,
        type: 'COMMON', // ← 고정
    }).then(res => res.data?.data ?? res.data);

// 고객센터 더미: 백엔드 구축 전까지 임시로 빈 배열 반환하도록 처리
export const listTickets = async () => {
    try {
        const res = await api.get('/support/tickets'); // 예: GET /api/support/tickets
        return res.data?.data ?? res.data ?? [];
    } catch {
        // 👉 백엔드 준비 전, 더미 데이터
        return [
            {
                id: 101,
                userId: 12,
                userNickname: '코코아',
                title: '포인트 적립이 안돼요',
                content: '어제 챌린지 성공했는데 포인트가 반영되지 않았습니다.',
                answered: false,
                createdAt: new Date().toISOString(),
            },
            {
                id: 102,
                userId: 33,
                userNickname: '라임',
                title: '회원탈퇴 문의',
                content: '회원탈퇴는 어디서 하나요?',
                answered: true,
                answer: '마이페이지 > 회원탈퇴 메뉴에서 진행 가능합니다.',
                createdAt: new Date().toISOString(),
            },
        ];
    }
};

export const replyTicket = async (ticketId, answer) => {
    try {
        const res = await api.post(`/support/tickets/${ticketId}/reply`, { answer }); // 예: POST /api/support/tickets/{id}/reply
        return res.data?.data ?? res.data;
    } catch {
        // 백엔드 없으면 성공 시뮬레이션
        return true;
    }
};
