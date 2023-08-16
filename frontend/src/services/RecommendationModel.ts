import { QuestionPageType, RecommendationOptionType } from "../types/types";

export function getRecommendedProducts(answeredPages: QuestionPageType[],
    recommendationOptions: RecommendationOptionType[])
    : RecommendationOptionType[] {
    let recList: RecommendationOptionType[] = []

    recommendationOptions.forEach(recommendationOption => {
        let isValidRecommendation = true;
        recommendationOption.recommendationMatrixColumn.some(
            cell => {
                let correspondingAnsweredPage
                    = answeredPages.find(answeredPage => {
                        return answeredPage.pageName === cell.pageName
                    });
                if (correspondingAnsweredPage == null) {
                    // in this case we shouldn't recommend the product
                    isValidRecommendation = false;
                    // break off the loop
                    return true;
                }
                if (correspondingAnsweredPage.answer == null) {
                    // answer not provided , ignore this case
                    // continue
                    return false;
                }
                if (!cell.answers.includes(correspondingAnsweredPage.answer.value)) {
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