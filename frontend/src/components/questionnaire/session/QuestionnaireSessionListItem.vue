<template>
    <div>
        <div class="group relative block overflow-hidden rounded">

            <img :src="questionnaireSessionListItem.questionnaire.image" alt=""
                class="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />

            <div class="relative border border-gray-100 bg-white p-6">

                <h3 class="mt-4 text-lg font-medium text-gray-900">{{ questionnaireSessionListItem.title }}</h3>

                <h4 class="mt-4 text-base font-normal text-gray-700">by @{{ questionnaireSessionListItem.user.username }}
                </h4>

                <template v-if="authStore.user?.id === questionnaireSessionListItem.user.id">
                    <div class="mt-4 flex justify-between items-center">
                        <h5 class="text-sm text-blue-800">Share with Public</h5>
                        <label @click="handleShareWithPublicCheckboxClick()"
                            :for="'ShareWithPublic-' + questionnaireSessionListItem.id"
                            class="relative h-8 w-14 cursor-pointer">
                            <input type="checkbox" :checked="questionnaireSessionListItem.sharable"
                                :id="'ShareWithPublic-' + questionnaireSessionListItem.id"
                                class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden" />

                            <span
                                class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600">
                                <svg data-unchecked-icon xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>

                                <svg data-checked-icon xmlns="http://www.w3.org/2000/svg" class="hidden h-4 w-4"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </span>

                            <span
                                class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
                        </label>
                    </div>
                </template>

                <div class="mt-4 grid grid-cols-2 gap-4">
                    <template v-if="authStore.user?.id === questionnaireSessionListItem.user.id">
                        <button @click="navigateToQuestionnaireSessionEdit()"
                            class="block w-full rounded bg-blue-800 text-white p-4 text-sm font-medium transition hover:scale-105">
                            Edit
                        </button>
                        <button @click="navigateToQuestionnaireSessionView()"
                            class="block w-full rounded border-2 border-blue-800 text-blue-800 p-4 text-sm font-medium transition hover:scale-105">
                            View
                        </button>
                    </template>
                    <template v-else>
                        <button @click="navigateToQuestionnaireSessionView()"
                            class="col-span-2 block w-full rounded border-2 border-blue-800 text-blue-800 p-4 text-sm font-medium transition hover:scale-105">
                            View
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import { QuestionnaireUserSession } from '../../../types/types';
import { ref } from 'vue';
import { SET_SESSION_SHARABLE } from '../../../services/queries/graphqlAPI';
import { useAuthStore } from '../../../store/store';
const authStore = useAuthStore();

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

async function handleShareWithPublicCheckboxClick() {
    let response;
    if (questionnaireSessionListItem.value.sharable) {
        response = await SET_SESSION_SHARABLE(questionnaireSessionListItem.value.id, false);
        if (response) {
            questionnaireSessionListItem.value.sharable = false;
        }
    } else {
        response = await SET_SESSION_SHARABLE(questionnaireSessionListItem.value.id, true);
        if (response) {
            questionnaireSessionListItem.value.sharable = true;
        }
    }

}
</script>

<style scoped></style>