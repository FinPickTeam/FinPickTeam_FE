// src/stores/challenge.js
import { defineStore } from 'pinia';
import { getCoinStatus } from '@/api/coin/coin';

export const useChallengeStore = defineStore('challenge', {
    state: () => ({
        // 진행 중 개수 (RECRUITING / IN_PROGRESS / COMPLETED & !isResultCheck)
        counts: { PERSONAL: 0, GROUP: 0 },

        // 포인트/코인 스냅샷
        points: {
            userPoints: 0,               // 잔액(amount)
            cumulativeAmount: 0,         // 누적(cumulative_amount)
            monthlyCumulativeAmount: 0,  // 월누적(monthly_cumulative_amount)
            updatedAt: null,             // 스냅샷 시각
            required: { PERSONAL: 0, GROUP: 100, COMMON: 100 }, // 정책값
        },
    }),
    getters: {
        isTypeFull: (s) => (type) =>
            ['PERSONAL', 'GROUP'].includes(type) ? s.counts[type] >= 3 : false,
        isAllFull: (s) => s.counts.PERSONAL >= 3 && s.counts.GROUP >= 3,
        canCreateByType: (s) => (type) =>
            type === 'GROUP' ? s.counts.GROUP < 3 : type === 'PERSONAL' ? s.counts.PERSONAL < 3 : true,
        hasEnoughPointsForType: (s) => (type) =>
            s.points.userPoints >= (s.points.required[type] ?? 0),
        lackPointsAmountForType: (s) => (type) =>
            Math.max(0, (s.points.required[type] ?? 0) - s.points.userPoints),
    },
    actions: {
        updateCountsFromList(list = []) {
            const isActive = (c) =>
                c &&
                (c.status === 'RECRUITING' ||
                    c.status === 'IN_PROGRESS' ||
                    (c.status === 'COMPLETED' && c.isResultCheck === false));
            this.counts.PERSONAL = list.filter((c) => c.type === 'PERSONAL' && isActive(c)).length;
            this.counts.GROUP = list.filter((c) => c.type === 'GROUP' && isActive(c)).length;
        },
        resetCounts() {
            this.counts.PERSONAL = 0;
            this.counts.GROUP = 0;
        },
        setUserPoints(p) {
            // (호환용) 필요한 곳에서 임시 세팅할 때 사용 가능
            this.points.userPoints = Number(p) || 0;
        },
        setRequiredPoints(map) {
            this.points.required = { ...this.points.required, ...map };
        },
        async fetchCoinStatus() {
            try {
                const snap = await getCoinStatus();
                this.points.userPoints = Number(snap?.amount ?? 0);
                this.points.cumulativeAmount = Number(snap?.cumulativeAmount ?? 0);
                this.points.monthlyCumulativeAmount = Number(snap?.monthlyCumulativeAmount ?? 0);
                this.points.updatedAt = snap?.updatedAt ?? null;
            } catch (e) {
                // 실패해도 앱은 계속 동작: 기본값 유지
                this.points.userPoints = this.points.userPoints || 0;
            }
        },
    },
});
