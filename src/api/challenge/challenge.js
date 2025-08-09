import api from '../instance.js';

/** 챌린지 요약 */
export const getChallengeSummary = () =>
    api.get('/challenge/summary')
        .then(res => res.data?.data)           // CommonResponseDTO<T> → T만 반환
        .catch(err => { throw err; });

/** 챌린지 리스트
 * @param {{ type?: 'PERSONAL'|'GROUP'|'COMMON', status?: 'RECRUITING'|'IN_PROGRESS'|'CLOSED'|'COMPLETED', participating?: boolean }} params
 */
export const getChallengeList = (params = {}) =>
    api.get('/challenge/list', { params })
        .then(res => res.data?.data)           // List<ChallengeListResponseDTO>
        .catch(err => { throw err; });
