import { QuestionnaireUserSession, RecommendationOptionType } from "../types/types";

export function getRecommendedProducts(
    questionnaireUserSession: QuestionnaireUserSession,
    recommendationOptions: RecommendationOptionType[])
    : RecommendationOptionType[] {
    let recList: RecommendationOptionType[] = []

    recommendationOptions.forEach(recommendationOption => {
        let isValidRecommendation = true;
        recommendationOption.recommendationMatrixColumn.some(
            cell => {
                let correspondingQuestionnaireUserSessionAnswer
                    = questionnaireUserSession.questionnaireUserSessionAnswers.find(qUSA => {
                        return qUSA.questionPage.pageName === cell.pageName
                    });
                if (!correspondingQuestionnaireUserSessionAnswer) {
                    // // in this case we shouldn't recommend the product
                    // isValidRecommendation = false;
                    // // break off the loop
                    // return true;
                    // answer not provided , ignore this case
                    return false;
                }
                // if (!correspondingQuestionnaireUserSessionAnswer.value) {
                //     // answer not provided , ignore this case
                //     // continue
                //     return false;
                // }
                if (!cell.answers.includes(correspondingQuestionnaireUserSessionAnswer.value)) {
                    // the answer is not one of the accepted answers in recommendation matrix (equivalent to 0 in matrix cell)
                    // in this case we shouldn't recommend the product
                    isValidRecommendation = false;
                    // break off the loop
                    return true;
                }
            }
        )
        if (isValidRecommendation) {
            // if answers match the recommendation requirements add it to the list
            recList.push(recommendationOption);
        }
    })


    return recList;
}