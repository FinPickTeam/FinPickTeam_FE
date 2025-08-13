// src/api/challenge/coinRank.js
import api from '../instance';

// 현재 달 Top5 + 내 랭킹
export const getCoinRankTop5WithMe = (userId) =>
    api.get('/challenge/rank/coin', { params: { userId } })
        .then(res => res.data)
        .catch(err => { throw err; });

// (선택) 특정 월 스냅샷 Top5 + 내 랭킹
export const getCoinRankSnapshot = ({ month, userId }) =>
    api.get('/challenge/rank/coin/snapshot', { params: { month, userId } })
        .then(res => res.data)
        .catch(err => { throw err; });

// (선택) 스냅샷 확인 체크
export const checkCoinRankSnapshot = ({ month, userId }) =>
    api.patch('/challenge/rank/coin/snapshot/check', null, { params: { month, userId } })
        .then(res => res.data)
        .catch(err => { throw err; });
