<template>
    <div class="w-full">
        <Progress :progress="progress" />
    </div>
    <div class="flex flex-row flex-grow">
        <LoadingSpinner v-if="loading" />
        <Navigation v-if="!loading" :nav-tree="navigationTree" :current-nav-item="currentNavigationItem"
            @on-nav-item-click="onNavItemClick" />
        <template v-if="!loading">
            <QuestionPage v-if="isQuestionPage(currentPage)" :page="currentPage" :navTree="navigationTree"
                @onQuestionPagePreviousClicked="handleOnQuestionPagePreviousClicked"
                @onQuestionPageNextClicked="handleOnQuestionPageNextClicked" />
            <ResultPage v-else-if="isResultPage(currentPage)" :resultPage="currentPage"
                :answeredPages="questionnaire.questionPages"
                @on-resultresult-page-previous-clicked="handleOnResultPagePreviousClicked"
                @on-resultresult-page-reset-questionnaire-clicked="handleOnResultPageResetQuestionnaireClicked" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import Progress from './progress/Progress.vue';
import QuestionPage from './questionPage/QuestionPage.vue'
import ResultPage from './resultPage/ResultPage.vue'
import Navigation from './navigation/Navigation.vue';
import LoadingSpinner from '../custom/LoadingSpinner.vue';
import { AddAnswer, DeleteAnswersByQuestionnaireId, EditAnswer, GetQuestionnaireByQuestionnaireName } from '../../services/queries/graphqlAPI';
import { QuestionnaireType, NavigationTreeItemType, QuestionPageType, ResultPageType, AnswerOptionType, AnswerType } from '../../types/types';
import * as Factory from '../../types/factory';

const props = defineProps({
    questionnaireName: {
        type: String,
        default: "",
    },
});

const loading = ref(true);
const questionnaire: QuestionnaireType = reactive(Factory.createDefaultQuestionnaire());
const navigationTree = ref<NavigationTreeItemType[]>([]);
const currentNavigationItem = ref<NavigationTreeItemType>();
const currentPage: QuestionPageType | ResultPageType = reactive(Factory.createDefaultQuestionPage());
const currentPageIndex = ref<number>(0);
const progress = ref<number>(0);

fetchQuestionnaire(props.questionnaireName)

function fetchQuestionnaire(questionnaireName: string) {
    try {
        console.log('Loading Questionnaire...');

        GetQuestionnaireByQuestionnaireName(questionnaireName)
            .then((data) => {
                loading.value = false;
                questionnaire.id = data.questionnaireByQuestionnaireName.id;
                questionnaire.title = data.questionnaireByQuestionnaireName.title;
                questionnaire.questionnaireName = data.questionnaireByQuestionnaireName.questionnaireName;
                questionnaire.questionPages = data.questionnaireByQuestionnaireName.questionPages;
                questionnaire.resultPage = data.questionnaireByQuestionnaireName.resultPage;
                setCurrentPageBySpecificIndex(0);
                clearNavigationTree()
                if (isQuestionPage(currentPage)) {
                    pushPageToNavigationTree(currentPage);
                    currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
                }
            })
            .catch((error) => {
                console.error("Error occurred:", error);
            });
    } catch (error) {
        console.error('Error while fetching data:', error);
        throw error;
    }
}


function addAnswer(
    answer: AnswerOptionType,
    onsuccess?: (addedAnswer: AnswerType) => void,
    onfailure?: (error: Error) => void) {
    try {
        const addAnswerInput = {
            value: answer.value,
            questionPageId: (currentPage as QuestionPageType).id
        }
        AddAnswer(addAnswerInput)
            .then((data) => {
                updateCurrentPageWithAnswer(data.addAnswer);
                if (onsuccess) {
                    onsuccess(data.addAnswer);
                }
            })
            .catch((error) => {
                console.error("Error occurred:", error);
                if (onfailure) {
                    onfailure(error);
                }
            });

    } catch (error) {
        console.error('Error while fetching data:', error);
        throw error;
    }
}
function editAnswer(
    newAnswer: AnswerOptionType,
    existingAnswer: AnswerType,
    onsuccess?: (editedAnswer: AnswerType) => void,
    onfailure?: (error: Error) => void
) {
    try {
        const editAnswerInput = {
            value: newAnswer.value,
            questionPageId: (currentPage as QuestionPageType).id
        };

        EditAnswer(existingAnswer.id, editAnswerInput)
            .then((editedAnswer) => {
                updateCurrentPageWithAnswer(editedAnswer.editAnswer);
                if (onsuccess) {
                    onsuccess(editedAnswer.editAnswer);
                }
            })
            .catch((error) => {
                console.error('Error occurred:', error);
                if (onfailure) {
                    onfailure(error);
                }
            });
    } catch (error) {
        console.error('Error while editing answer:', error);
        throw error;
    }
}

function deleteAllAnswers() {
    try {

        DeleteAnswersByQuestionnaireId(questionnaire.id)
            .then((_data) => {
                fetchQuestionnaire(props.questionnaireName)
            })
            .catch((error) => {
                console.error("Error occurred:", error);
            });
    } catch (error) {
        console.error('Error while fetching data:', error);
        throw error;
    }
}

function isPageNavigationConditionSatisfied(page: QuestionPageType, questionnaireTemp: QuestionnaireType) {
    const condition = page.content.showPageNavigationCondition;
    const targetPageInList = questionnaireTemp.questionPages.find(qP => qP.pageName === condition?.byPageInNavigationTree?.pageName);

    return (
        targetPageInList &&
        targetPageInList.answer &&
        targetPageInList.answer.value === condition?.byPageInNavigationTree?.byQuestionAnswer.value
    );
}


function clearNavigationTree() {
    navigationTree.value = reactive<NavigationTreeItemType[]>([])
}

function pushPageToNavigationTree(questionPage: QuestionPageType) {
    var navList = navigationTree.value
    if (navList == null) {
        navList = [{
            label: questionPage.title,
            pageId: questionPage.id,
            pageName: questionPage.pageName,
            selectedAnswer: questionPage.answer
        }]
    } else {
        navList.push({
            label: questionPage.title,
            pageId: questionPage.id,
            pageName: questionPage.pageName,
            selectedAnswer: questionPage.answer
        });
    }
    navigationTree.value = reactive<NavigationTreeItemType[]>(navList)

}

// Type guard to check if the page is of type QuestionPage
function isQuestionPage(page: any): page is QuestionPageType {
    return page && page.pageType === 'QuestionPage';
}

// Type guard to check if the page is of type ResultPage
function isResultPage(page: any): page is ResultPageType {
    return page && page.pageType === 'ResultPage';
}

function updateCurrentPageWithAnswer(answer: AnswerType) {
    questionnaire.questionPages[currentPageIndex.value].answer = answer;
}

function handleOnQuestionPagePreviousClicked() {
    navigateBackwards();
}

function handleOnQuestionPageNextClicked(temporaryAnswer: AnswerOptionType) {
    if (!temporaryAnswer) {
        alert("Please select an option");
        return;
    }
    console.log("handleOnQuestionPageNextClicked");
    console.log(temporaryAnswer);


    if ((currentPage as QuestionPageType).answer) {
        if ((currentPage as QuestionPageType).answer.value != temporaryAnswer.value) {
            editAnswer(temporaryAnswer, (currentPage as QuestionPageType).answer,
                () => {
                    // success
                    navigateForward();
                },
                () => {
                    // error
                    // todo

                });
        } else {
            // answer unchanged , no need to update database
            navigateForward();
        }
    } else {
        addAnswer(temporaryAnswer,
            () => {
                // success
                navigateForward();
            },
            () => {
                // error
                // todo

            });
    }
}

function handleOnResultPagePreviousClicked() {
    navigateBackwards();
}

function handleOnResultPageResetQuestionnaireClicked() {
    deleteAllAnswers();
}

function setCurrentPage() {
    console.log(questionnaire.questionPages);
    if (currentPageIndex.value < questionnaire.questionPages.length) {
        Object.assign(currentPage, questionnaire.questionPages[currentPageIndex.value]);
    } else {
        Object.assign(currentPage, questionnaire.resultPage);
    }
}

function setCurrentPageBySpecificIndex(index: number) {
    if (index < 0) {
        index = 0;
    }
    currentPageIndex.value = index;
    if (questionnaire.questionPages && questionnaire.questionPages.length > 0) {
        if(currentPageIndex.value > questionnaire.questionPages.length){
            currentPageIndex.value = questionnaire.questionPages.length
        }
        progress.value = (currentPageIndex.value / questionnaire.questionPages.length) * 100
    }
    setCurrentPage();
}


function navigateForward() {
    const questionnaireTemp = questionnaire;

    if (!questionnaireTemp) {
        return;
    }

    let newPageIndex = currentPageIndex.value + 1;
    const questionPagesSize = questionnaireTemp.questionPages.length;
    if (newPageIndex >= questionPagesSize) {
        const resultPageNavItem: NavigationTreeItemType = {
            label: "Recommendation",
            pageId: -1,
            pageName: "recommendationPage",
            selectedAnswer: Factory.createDefaultAnswer()
        }
        navigationTree.value.push(resultPageNavItem);
        currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
        setCurrentPageBySpecificIndex(newPageIndex);
        return
    }
    while (newPageIndex < questionPagesSize) {
        const pageOfIndex = questionnaireTemp.questionPages[newPageIndex];
        if (pageOfIndex.content.showPageNavigationCondition &&
            pageOfIndex.content.showPageNavigationCondition.byPageInNavigationTree) {
            if (isPageNavigationConditionSatisfied(pageOfIndex, questionnaireTemp)) {
                pushPageToNavigationTree(pageOfIndex);
                currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
                setCurrentPageBySpecificIndex(newPageIndex);
                break;
            } else {
                if (pageOfIndex.content.showPageNavigationCondition &&
                    pageOfIndex.content.showPageNavigationCondition.onConditionUnsatisfied) {
                    if (pageOfIndex.content.showPageNavigationCondition.onConditionUnsatisfied.actionType === "goToPageByPageName") {
                        let targetPageIndex = 0;
                        let targetPage;
                        questionnaireTemp.questionPages.some((qP, qPIndex) => {
                            if (qP.pageName === pageOfIndex.content.showPageNavigationCondition.onConditionUnsatisfied.actionValue) {
                                targetPageIndex = qPIndex;
                                targetPage = qP;
                                return true;
                            }
                            return false;
                        })
                        pushPageToNavigationTree(targetPage!);
                        currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
                        setCurrentPageBySpecificIndex(targetPageIndex);
                        break;
                    } else if (pageOfIndex.content.showPageNavigationCondition.onConditionUnsatisfied.actionType === "skip") {
                        // just skip the page
                    }
                }
            }
        } else {
            pushPageToNavigationTree(pageOfIndex);
            currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
            setCurrentPageBySpecificIndex(newPageIndex);
            break;
        }
        newPageIndex++;
    }
}

function navigateBackwards() {
    const currentNavItem = navigationTree.value?.pop()
    const previousNavItem = navigationTree.value?.pop()
    if (previousNavItem) {
        const previousIndex = questionnaire.questionPages.findIndex(qp => qp.pageName == previousNavItem.pageName)
        if (previousIndex > -1) {
            navigationTree.value?.push(previousNavItem);
            currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
            setCurrentPageBySpecificIndex(previousIndex);
        } else {
            navigationTree.value?.push(previousNavItem);
            currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
            setCurrentPageBySpecificIndex(0);
        }
    } else {
        if (currentNavItem) {
            navigationTree.value?.push(currentNavItem);
            currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
        }
        setCurrentPageBySpecificIndex(0);
    }
}

watch(questionnaire, (_newValue, _oldValue) => {
    updateNavigationWithAnswers();
});

function updateNavigationWithAnswers() {

    if (navigationTree.value) {
        navigationTree.value.forEach((navItem, index, list) => {
            const correspondingPage = (questionnaire.questionPages as QuestionPageType[]).find(pageItem => pageItem.pageName === navItem.pageName);
            if (correspondingPage) {
                navItem.selectedAnswer = correspondingPage.answer;
            }
            list[index] = navItem
        });

    }
}


function onNavItemClick(clickedNavItem: NavigationTreeItemType) {
    let idx = navigationTree.value.length;
    while (idx >= 0) {
        if (currentNavigationItem.value!.pageName === clickedNavItem.pageName) {
            return;
        }
        navigateBackwards();
        idx = idx - 1;
    }
}

</script>

<style scoped></style>