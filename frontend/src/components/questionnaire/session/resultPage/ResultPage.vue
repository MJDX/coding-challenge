<template>
    <div class="bg-white flex-grow h-full overflow-y-auto">
        <div class="max-w-3xl mx-auto p-4">
            <h1 class="text-3xl">
                {{ resultPage.title }}
            </h1>
            <h3 class="text-lg mt-4">
                {{ resultPage.content.header.label }}
            </h3>


            <template v-if="resultPage.content.recommendationOptions.type === 'cards'">
                <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-4 gap-4">
                    <template v-for="item in recommendationList">
                        <CardRecommendation :data="item" @recommendation-clicked="onRecommendationClick" />
                    </template>
                </div>
            </template>


            <div class="flex justify-end">
                <Button class="mr-8" :buttonName="'PreviousQuestion'" :buttonLabel="'Previous'"
                    @button-click-event="handleButtonClickEvent" />
                <Button v-if="!viewMode" class="mr-4" :buttonName="'ResetQuestionnaire'" :buttonLabel="'Reset Questionnaire'"
                    @button-click-event="handleButtonClickEvent" />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '../../../custom/Button.vue';
import CardRecommendation from './recommendation_types/CardRecommendation.vue'
import { QuestionnaireUserSession, RecommendationOptionType, ResultPageType } from '../../../../types/types';
import { ref } from 'vue';
import { getRecommendedProducts } from '../../../../services/RecommendationModel';





const {resultPage,questionnaireUserSession} = defineProps({
    resultPage: {
        type: Object as () => ResultPageType,
        default: null,
    },
    questionnaireUserSession: {
        type: Object as () => QuestionnaireUserSession,
        default: null,
    },
    viewMode : {
        type: Boolean,
        default: false,
    }
});


var recommendationList = ref<RecommendationOptionType[]>();

recommendationList.value = getRecommendedProducts(questionnaireUserSession,resultPage.content.recommendationOptions.options)


const onRecommendationClick = (recommendationItem: RecommendationOptionType) => {
    console.log(recommendationItem);
}

const emit = defineEmits(["onResultresultPagePreviousClicked", "onResultresultPageResetQuestionnaireClicked"])
function handleButtonClickEvent(buttonName: String) {
    switch (buttonName) {
        case "PreviousQuestion": {
            emit('onResultresultPagePreviousClicked');
            break;
        }
        case "ResetQuestionnaire": {
            emit('onResultresultPageResetQuestionnaireClicked');
            break;
        }
    }
}

</script>

<style scoped></style>