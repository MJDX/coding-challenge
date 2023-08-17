<template>
    <div class="flex flex-row h-full">
        <LoadingSpinner v-if="loading" />
        <Navigation v-if="!loading" :nav-tree="navigationTree" :current-nav-item="currentNavigationItem"
            @on-nav-item-click="onNavItemClick" />
        <div class="bg-white flex-grow overflow-y-auto">
            <div class="w-full">
                <Progress :progress="progress" />
            </div>
            <template v-if="!loading">
                <QuestionPage v-if="isQuestionPage(currentPage)" :page="currentPage"
                    :pageAnswerBySession="currentPageAnswer" :navTree="navigationTree"
                    @onQuestionPagePreviousClicked="handleOnQuestionPagePreviousClicked"
                    @onQuestionPageNextClicked="handleOnQuestionPageNextClicked" />
                <ResultPage v-else-if="isResultPage(currentPage)" :resultPage="currentPage"
                    :questionnaireUserSession="questionnaireUserSession"
                    @on-resultresult-page-previous-clicked="handleOnResultPagePreviousClicked"
                    @on-resultresult-page-reset-questionnaire-clicked="handleOnResultPageResetQuestionnaireClicked" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref} from 'vue';
import Progress from './progress/Progress.vue';
import QuestionPage from './questionPage/QuestionPage.vue'
import ResultPage from './resultPage/ResultPage.vue'
import Navigation from './navigation/Navigation.vue';
import LoadingSpinner from '../../custom/LoadingSpinner.vue';
// import { AddAnswer, DeleteAnswersByQuestionnaireId, EditAnswer, GetQuestionnaireByQuestionnaireName } from '../../../services/queries/graphqlAPI';
import { QuestionnaireType, NavigationTreeItemType, QuestionPageType, ResultPageType, AnswerOptionType, QuestionnaireUserSessionAnswer, QuestionnaireUserSession } from '../../../types/types';
import * as Factory from '../../../types/factory';
// import { useRouter, useRoute } from 'vue-router';
import { useRoute } from 'vue-router';
// import { useAuthStore } from '../../../store/store';
import { GET_FULL_QUESTIONNAIRE_USER_SESSION, ADD_OR_UPDATE_ANSWER, REMOVE_ANSWERS_BY_SESSION_ID } from '../../../services/queries/graphqlAPI';

// const authStore = useAuthStore();
// const router = useRouter();

const route = useRoute();

const loading = ref(true);
const questionnaire = reactive<QuestionnaireType>(Factory.createDefaultQuestionnaire());
const navigationTree = ref<NavigationTreeItemType[]>([]);
const currentNavigationItem = ref<NavigationTreeItemType>();
const currentPage: QuestionPageType | ResultPageType = reactive(Factory.createDefaultQuestionPage());
const currentPageAnswer: QuestionnaireUserSessionAnswer = reactive(Factory.createDefaultQuestionnaireUserSessionAnswer());
const currentPageIndex = ref<number>(0);
const progress = ref<number>(0);

// const questionnaireId = Number(route.params.questionnaireId);
const sessionId = Number(route.params.sessionId);
// const userId = Number(authStore.user?.id);
const questionnaireUserSession = ref<QuestionnaireUserSession>();

fetchFullSession()

async function fetchFullSession() {
    questionnaireUserSession.value = await GET_FULL_QUESTIONNAIRE_USER_SESSION(sessionId);
    loading.value = false;
    Object.assign(questionnaire, questionnaireUserSession.value?.questionnaire);
    buildNavigationToLatestUnAnsweredQuestionPageOrResultPage();

}

function buildNavigationToLatestUnAnsweredQuestionPageOrResultPage() {
    setCurrentPageBySpecificIndex(0);
    clearNavigationTree();
    
    if (isQuestionPage(currentPage)) {
        pushPageToNavigationTree(currentPage);
        currentNavigationItem.value = navigationTree.value[navigationTree.value.length - 1]
    }

    let currentAnswer = questionnaireUserSession.value?.questionnaireUserSessionAnswers
        .find(qUSA => qUSA.questionPageId === (currentPage as QuestionPageType).id);

    while (currentAnswer && currentPageIndex.value < questionnaire.questionPages.length) {
        navigateForward();
        currentAnswer = questionnaireUserSession.value?.questionnaireUserSessionAnswers
            .find(qUSA => qUSA.questionPageId === (currentPage as QuestionPageType).id);
    }

}
async function addOrEditAnswer(
    answer: AnswerOptionType) {

    const currentAnswer = questionnaireUserSession.value?.questionnaireUserSessionAnswers
        .find(qUSA => qUSA.questionPageId === (currentPage as QuestionPageType).id);


    let response;

    if (currentAnswer) {
        response = await ADD_OR_UPDATE_ANSWER(
            currentAnswer.id,
            questionnaireUserSession.value!.id,
            (currentPage as QuestionPageType).id,
            answer.value);

    } else {
        response = await ADD_OR_UPDATE_ANSWER(
            undefined,
            questionnaireUserSession.value!.id,
            (currentPage as QuestionPageType).id,
            answer.value);

    }


    if (response) {
        updateCurrentPageWithAnswer(response);
        navigateForward();
    }

}

async function deleteAllAnswers() {

    const response = await REMOVE_ANSWERS_BY_SESSION_ID(questionnaireUserSession.value!.id);
    if (response) {
        fetchFullSession();
    }

}

function isPageNavigationConditionSatisfied(page: QuestionPageType, questionnaireTemp: QuestionnaireType) {
    const condition = page.content.showPageNavigationCondition;
    const targetPageInList = questionnaireTemp.questionPages.find(qP => qP.pageName === condition.byPageInNavigationTree.pageName);
    const existingAnswer = questionnaireUserSession.value!.questionnaireUserSessionAnswers.find(qUSA => qUSA.questionPageId === targetPageInList!.id);

    return (
        targetPageInList &&
        existingAnswer &&
        existingAnswer.value === condition.byPageInNavigationTree.byQuestionAnswer.value
    );
}


function clearNavigationTree() {
    navigationTree.value = reactive<NavigationTreeItemType[]>([])
}

function pushPageToNavigationTree(questionPage: QuestionPageType) {
    var navList = navigationTree.value
    if (navList == null) {
        const existingAnswer = questionnaireUserSession.value!.questionnaireUserSessionAnswers.find(qUSA => qUSA.questionPageId === questionPage.id);
        navList = [{
            label: questionPage.title,
            pageId: questionPage.id,
            pageName: questionPage.pageName,
            selectedAnswer: existingAnswer!
        }]
    } else {
        const existingAnswer = questionnaireUserSession.value!.questionnaireUserSessionAnswers.find(qUSA => qUSA.questionPageId === questionPage.id);
        navList.push({
            label: questionPage.title,
            pageId: questionPage.id,
            pageName: questionPage.pageName,
            selectedAnswer: existingAnswer!
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

function updateCurrentPageWithAnswer(questionnaireUserSessionAnswer: QuestionnaireUserSessionAnswer) {
    questionnaireUserSession.value!.questionnaireUserSessionAnswers =
        questionnaireUserSession.value!.questionnaireUserSessionAnswers.filter(qUSA => qUSA.id !== questionnaireUserSessionAnswer.id);
    questionnaireUserSession.value!.questionnaireUserSessionAnswers.push(questionnaireUserSessionAnswer);
}

function handleOnQuestionPagePreviousClicked() {
    navigateBackwards();
}

function handleOnQuestionPageNextClicked(temporaryAnswer: AnswerOptionType) {
    if (!temporaryAnswer) {
        alert("Please select an option");
        return;
    }

    const existingAnswer = questionnaireUserSession.value?.questionnaireUserSessionAnswers
        .find(qUSA =>
            qUSA.questionPageId === (currentPage as QuestionPageType).id);

    if (!existingAnswer) {
        addOrEditAnswer(temporaryAnswer);
    } else if (existingAnswer && existingAnswer.value != temporaryAnswer.value) {
        addOrEditAnswer(temporaryAnswer);
    } else {
        // answer unchanged , no need to update database
        navigateForward();
    }

}

function handleOnResultPagePreviousClicked() {
    navigateBackwards();
}

function handleOnResultPageResetQuestionnaireClicked() {
    deleteAllAnswers();
}

function setCurrentPage() {
    if (currentPageIndex.value < questionnaire.questionPages.length) {
        const newCurrentPage = questionnaire.questionPages[currentPageIndex.value];
        const newCurrentPageAnswer = questionnaireUserSession.value!.questionnaireUserSessionAnswers.find(qUSA => qUSA.questionPageId === newCurrentPage.id);
        if (newCurrentPageAnswer) {
            Object.assign(currentPageAnswer, newCurrentPageAnswer);
        }
        Object.assign(currentPage, newCurrentPage);
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
        if (currentPageIndex.value > questionnaire.questionPages.length) {
            currentPageIndex.value = questionnaire.questionPages.length
        }
        progress.value = (currentPageIndex.value / questionnaire.questionPages.length) * 100
    }
    setCurrentPage();
}


function navigateForward() {
    updateNavigationWithAnswers();
    
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
            selectedAnswer: Factory.createDefaultQuestionnaireUserSessionAnswer()
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

function updateNavigationWithAnswers() {

    if (navigationTree.value) {
        navigationTree.value.forEach((navItem, index, list) => {
            if (!questionnaire) {
                return;
            }
            const correspondingPage = (questionnaire.questionPages as QuestionPageType[]).find(pageItem => pageItem.pageName === navItem.pageName);
            if (correspondingPage) {
                const existingAnswer = questionnaireUserSession.value?.questionnaireUserSessionAnswers.find(qUSA => qUSA.questionPageId === correspondingPage.id);
                navItem.selectedAnswer = existingAnswer!;
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