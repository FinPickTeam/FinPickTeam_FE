import api from '../instance';

/**
 * 월별 누적 포인트 조회
 * 백엔드: GET /api/coin/monthly?year=YYYY&month=MM
 * 응답: CommonResponseDTO<{ month: string, amount: number, updatedAt: string }>
 */
export const getMonthlyPoints = ({ year, month }) =>
    api
        .get('/coin/monthly', { params: { year, month } })
        // res.data => CommonResponseDTO
        // res.data.data => { month, amount, updatedAt }
        .then((res) => res?.data?.data)
        .catch((err) => {
            throw err;
        });
