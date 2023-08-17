<template>
    <div class="max-w-3xl mx-auto p-4">
        <h1 class="text-3xl">
            {{ page.title }}
        </h1>
        <h3 class="text-lg mt-4">
            {{ page.content.question.label }}
        </h3>

        <template v-if="page.content.answerOptions.type === 'cards'">
            <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-4 gap-4">
                <template v-for="item in page.content.answerOptions.options" :key="item.value">
                    <CardAnswer v-if="shouldShowOption(item)" :data="item" :isSelected="temporaryAnswer === item"
                        @answer-clicked="toggleAnswerClicked" />
                </template>
            </div>
        </template>
        <template v-else-if="page.content.answerOptions.type === 'buttons'">
            <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-4 gap-4">
                <template v-for="item in page.content.answerOptions.options" :key="item.value">
                    <ButtonAnswer v-if="shouldShowOption(item)" :data="item" :isSelected="temporaryAnswer === item"
                        @answer-clicked="toggleAnswerClicked" />
                </template>
            </div>
        </template>
        <template v-else-if="page.content.answerOptions.type === 'slider'">
            <div class=" mt-4 w-full">
                <SliderAnswer :listOfOptions="page.content.answerOptions.options" :selected-option="temporaryAnswer"
                    @answer-clicked="toggleAnswerClicked" />
            </div>
        </template>
        <div class="flex justify-end">
            <Button class="mr-8" :buttonName="'PreviousQuestion'" :buttonLabel="'Previous'"
                @button-click-event="handleButtonClickEvent" />
            <Button class="mr-4" :buttonName="'NextQuestion'" :buttonLabel="'Next'"
                @button-click-event="handleButtonClickEvent" />
        </div>
    </div>
</template>

<script setup lang="ts">
import CardAnswer from './answer_types/CardAnswer.vue';
import ButtonAnswer from './answer_types/ButtonAnswer.vue';
import SliderAnswer from './answer_types/SliderAnswer.vue';
import Button from '../../../custom/Button.vue';
import { ref, watch } from 'vue';
import { QuestionPageType, AnswerOptionType, NavigationTreeItemType, QuestionnaireUserSessionAnswer } from '../../../../types/types';




const props = defineProps({
    page: {
        type: Object as () => QuestionPageType,
        default: null,
    },
    pageAnswerBySession: {
        type: Object as () => QuestionnaireUserSessionAnswer,
        default: null,
    },
    navTree: {
        type: Object as () => NavigationTreeItemType[] | null,
        default: null,
    },
});

const temporaryAnswer = ref<AnswerOptionType>();

//init temporary answer
const page = props.page;
const pageAnswerBySession = props.pageAnswerBySession;
if (page && pageAnswerBySession && pageAnswerBySession.value && page.content.answerOptions && page.content.answerOptions.options) {
    temporaryAnswer.value = page.content.answerOptions.options.find(option => option.value === pageAnswerBySession.value);
}

watch(props.page, (newValue, _oldValue) => {
    const page = newValue;
    if (page && pageAnswerBySession && pageAnswerBySession.value && page.content.answerOptions && page.content.answerOptions.options) {
        temporaryAnswer.value = page.content.answerOptions.options.find(option => option.value === pageAnswerBySession.value);
    }
});


const toggleAnswerClicked = (answerData: AnswerOptionType) => {
    temporaryAnswer.value = answerData;

};


function shouldShowOption(option: AnswerOptionType): boolean {

    if (!option.showOptionNavigationCondition) {
        return true;
    }

    if (!props.navTree) {
        return true;
    }

    const condition = option.showOptionNavigationCondition;
    if (condition.byPageInNavigationTree) {
        const targetPageName = condition.byPageInNavigationTree.pageName;
        const expectedValue = condition.byPageInNavigationTree.byQuestionAnswer.value;
        const correspondingNavItem = props.navTree.find(navItem => navItem.pageName === targetPageName);
        if (correspondingNavItem && correspondingNavItem.selectedAnswer && correspondingNavItem.selectedAnswer.value === expectedValue) {
            return true;
        }
    }

    return false;
}

const emit = defineEmits(["onQuestionPagePreviousClicked", "onQuestionPageNextClicked"])
function handleButtonClickEvent(buttonName: String) {
    switch (buttonName) {
        case "PreviousQuestion": {
            emit('onQuestionPagePreviousClicked');
            break;
        }
        case "NextQuestion": {
            emit('onQuestionPageNextClicked', temporaryAnswer.value);
            // reinitialize temporaryAnswer variable
            temporaryAnswer.value = undefined;
            break;
        }
    }
}

</script>

<style scoped></style>