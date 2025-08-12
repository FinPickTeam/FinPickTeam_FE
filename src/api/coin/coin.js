// src/api/coin/coin.js
import api from '../instance';

/**
 * 월별 누적 포인트 조회
 * 백엔드: GET /api/coin/monthly?year=YYYY&month=MM
 * 응답: CommonResponseDTO<{ month: string, amount: number, updatedAt: string }>
 */
export const getMonthlyPoints = ({ year, month }) =>
    api
        .get('/coin/monthly', { params: { year, month } })
        .then((res) => res?.data?.data)
        .catch((err) => {
            throw err;
        });

/**
 * 코인 스냅샷(잔액/일반누적/월누적/업데이트시각)
 * 백엔드: GET /api/coin/status
 * 응답: CommonResponseDTO<{ amount, cumulativeAmount, monthlyCumulativeAmount, updatedAt }>
 */
export const getCoinStatus = () =>
    api
        .get('/coin/status')
        .then((res) => res?.data?.data)
        .catch((err) => {
            throw err;
        });
