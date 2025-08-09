import api from '../instance';

/**
 * 월별 누적 포인트 조회
 * 백엔드: GET /api/coin/monthly?year=YYYY&month=MM
 * 응답: CommonResponseDTO<{ monthlyCumulativeAmount: number, ... }>
 */
export const getMonthlyPoints = ({ year, month }) =>
    api
        .get('/coin/monthly', { params: { year, month } })
        .then((res) => res.data?.data) // { monthlyCumulativeAmount, ... }
        .catch((err) => {
            throw err;
        });