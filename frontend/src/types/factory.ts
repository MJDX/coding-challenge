import { ResultPageType, RecommendationOptionType, QuestionPageType, QuestionnaireType, NavigationTreeItemType, AnswerType, AnswerOptionType } from "./types";

export const createDefaultResultPage: () => ResultPageType = () => ({
    title: "",
    pageName: "",
    content: {
        header: {
            label: "",
            image: ""
        },
        recommendationOptions: {
            type: "cards",
            options: [createDefaultRecommendationOption()]
        }
    }
});

export const createDefaultRecommendationOption: () => RecommendationOptionType = () => ({
    id: -1,
    label: "",
    value: "",
    image: "",
    recommendationMatrixColumn: [
        {
            pageName: "",
            answers: [""]
        }
    ]
});

export const createDefaultQuestionPage: () => QuestionPageType = () => ({
    id: -1,
    title: "",
    pageName: "",
    pageType: "",
    content: {
        showPageNavigationCondition: {
            byPageInNavigationTree: {
                pageName: "",
                byQuestionAnswer: {
                    value: ""
                }
            },
            onConditionUnsatisfied: {
                actionType: "goToPageByPageName",
                actionValue: ""
            }
        },
        question: {
            label: "",
            image: ""
        },
        answerOptions: {
            type: "cards",
            options: [createDefaultAnswerOption()]
        }
    },
    answer: {
        id: -1,
        value: ""
    }
});

export const createDefaultQuestionnaire: () => QuestionnaireType = () => ({
    id: -1,
    title: "",
    questionnaireName: "",
    questionPages:  [createDefaultQuestionPage()],
    resultPage: createDefaultResultPage()
});

export const createDefaultNavigationTreeItem: () => NavigationTreeItemType = () => ({
    label:"",
    selectedAnswer: {
        id: -1,
        value: ""
    },
    pageName: "",
    pageId: -1
});

export const createDefaultAnswer: () => AnswerType = () => ({
    id: -1,
    value: ""
});

export const createDefaultAnswerOption: () => AnswerOptionType = () => ({
    label: "",
    value: "",
    image: "",
    showOptionNavigationCondition: {
        byPageInNavigationTree: {
            pageName: "",
            byQuestionAnswer: {
                value: ""
            }
        }
    }
});