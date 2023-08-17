<template>
    <div>
        <div class="group relative block overflow-hidden rounded">

            <img :src="questionnaireSessionListItem.questionnaire.image" alt=""
                class="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />

            <div class="relative border border-gray-100 bg-white p-6">

                <h3 class="mt-4 text-lg font-medium text-gray-900">{{ questionnaireSessionListItem.title }}</h3>

                <h4 class="mt-4 text-base font-normal text-gray-700">by @{{ questionnaireSessionListItem.user.username }}</h4>

                <div class="mt-4 grid grid-cols-2 gap-4">
                    <button @click="navigateToQuestionnaireSessionEdit()"
                        class="block w-full rounded bg-blue-800 text-white p-4 text-sm font-medium transition hover:scale-105">
                        Edit
                    </button>
                    <button @click="navigateToQuestionnaireSessionView()"
                        class="block w-full rounded border-2 border-blue-800 text-blue-800 p-4 text-sm font-medium transition hover:scale-105">
                        View
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import { QuestionnaireUserSession } from '../../../types/types';
import { ref } from 'vue';

const props = defineProps({
    questionnaireSessionListItem: {
        type: Object as () => QuestionnaireUserSession,
        default: null,
    }
});

const questionnaireSessionListItem = ref<QuestionnaireUserSession>(props.questionnaireSessionListItem)

const router = useRouter();

function navigateToQuestionnaireSessionView() {
    const questionnaireId = questionnaireSessionListItem.value.questionnaire.id;
    const sessionId = questionnaireSessionListItem.value.id;

    router.push({ name: 'QuestionnaireSessionView', params: { questionnaireId, sessionId } });
}
function navigateToQuestionnaireSessionEdit() {
    const questionnaireId = questionnaireSessionListItem.value.questionnaire.id;
    const sessionId = questionnaireSessionListItem.value.id;


    router.push({ name: 'QuestionnaireSessionEdit', params: { questionnaireId, sessionId } });
}
</script>

<style scoped></style>