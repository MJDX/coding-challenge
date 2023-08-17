export type ResultPageType =
    {
        title: string,
        pageName: string,
        content: {
            header: {
                label: string,
                image: string
            },
            recommendationOptions: {
                type: RecommendationOptionsEnums,
                options: [
                    RecommendationOptionType
                ]
            }
        }
    };


export type RecommendationOptionType = {
    id: number
    label: string
    value: string
    image: string
    recommendationMatrixColumn: [
        {
            pageName: string,
            answers: [string]
        }
    ];
};

export type RecommendationOptionsEnums = "cards";

export type QuestionPageType =
    {
        id: number,
        title: string,
        pageName: string,
        pageType: string,
        content: {
            showPageNavigationCondition: {
                byPageInNavigationTree: {
                    pageName: string,
                    byQuestionAnswer: {
                        value: string
                    }
                },
                onConditionUnsatisfied: {
                    actionType: ActionEnums,
                    actionValue: string
                }
            },
            question: {
                label: string,
                image: string
            },
            answerOptions: {
                type: AnswerOptionsEnums,
                options: [
                    AnswerOptionType
                ]
            }
        },
        questionnaireUserSessionAnswers: QuestionnaireUserSessionAnswer[]
    };

export type QuestionnaireType =
    {
        id: number
        title: string
        image: string
        questionnaireName: string
        questionPages: QuestionPageType[]
        resultPage: ResultPageType
    };


export type NavigationTreeItemType = {
    label: string,
    selectedAnswer: QuestionnaireUserSessionAnswer,
    pageName: string
    pageId: number
}

export type QuestionnaireUserSession = {
    id: number
    title: string
    user: User
    sharable: boolean
    questionnaire: QuestionnaireType
    questionnaireUserSessionAnswers: QuestionnaireUserSessionAnswer[]
};

export type User = {
    id: number
    username: string
    email: string
};

export type QuestionnaireUserSessionAnswer = {
    id: number
    questionnaireUserSessionId: number
    questionPageId: number
    value: string
};

export type AnswerOptionType = {
    label: string
    value: string
    image: string
    showOptionNavigationCondition: {
        byPageInNavigationTree: {
            pageName: string
            byQuestionAnswer: {
                value: string
            };
        };
    };
};


export type AnswerOptionsEnums = "cards" | "buttons" | "slider";


export type ActionEnums = "goToPageByPageName";