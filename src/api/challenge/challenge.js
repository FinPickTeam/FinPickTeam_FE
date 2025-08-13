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

// 상세 조회
export const getChallengeDetail = (id) =>
    api.get(`/challenge/${id}`).then((res) => res.data?.data);

// 참여하기 (비밀번호가 필요하면 { password } 전달)
export const joinChallenge = (id, payload = {}) =>
    api.post(`/challenge/${id}/join`, payload).then((res) => res.data?.data);

// 결과 조회 (완료 + 미확인 시)
export const getChallengeResult = (id) =>
    api.get(`/challenge/${id}/result`).then((res) => res.data?.data);

// 결과 확인 처리
export const confirmChallengeResult = (id) =>
    api.patch(`/challenge/${id}/result/confirm`).then((res) => res.data?.data);