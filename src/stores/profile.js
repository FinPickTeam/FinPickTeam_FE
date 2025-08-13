import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
    state: () => ({
        answers: {
            question1: null,
            question2: null,
            question3: null,
            question4: null,
            question5: null,
            question6: null,
            question7: null,
            question8: null,
            question9: null,
            question10: null,

        },
        resultType: null,
        resultExplain: null,
    }),
    actions: {
        setAnswer(step, value) {
            this.answers[`question${step}`] = value;
        },
        resetAnswers() {
            // 답변 초기화 로직
            // 결과도 함께 초기화해주는 것이 좋습니다.
            this.resultType = null;
            this.resultExplain = null;
        },
        // 최종 결과를 저장하는 액션 추가
        setProfileResult(type, explain) {
            this.resultType = type;
            this.resultExplain = explain;
        },
        loadAnswers(surveyData) {
            // surveyData 객체에 있는 모든 키-값 쌍에 대해 반복
            for (const key in surveyData) {
                // this.answers 객체에 해당 키가 존재하면 값을 업데이트
                if (key in this.answers) {
                    this.answers[key] = surveyData[key];
                }
            }
        },
    },
});