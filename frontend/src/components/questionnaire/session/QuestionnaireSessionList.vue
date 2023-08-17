<template>
    <div class="max-w-screen-xl mx-auto p-8">
        <div class="flex gap-4">
            <h1 class="mt-4 text-2xl font-medium text-gray-900">My sessions</h1>


            <div class="sm:flex sm:gap-4">
                <div class="sm:flex-1">
                    <label for="sessionTitle" class="sr-only">Session Title</label>

                    <input id="sessionTitle" type="text" placeholder="Session Title" v-model="sessionTitle"
                        class="w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition focus:border-white focus:outline-none focus:ring focus:ring-yellow-400" />
                </div>

                <button @click="addNewQuestionnaireUserSession()"
                    class="block rounded bg-green-800 text-white px-4 text-sm font-medium transition hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6Z" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mt-8 min-h-[128px]">
            <template v-for="questionnaireSessionListItem in questionnaireCurrentUserSessions">
                <QuestionnaireSessionListItem :questionnaireSessionListItem="questionnaireSessionListItem" />
            </template>
        </div>

        <h1 class="mt-4 text-2xl font-medium text-gray-900">Community sessions</h1>

        <div class="grid grid-cols-4 gap-4 mt-8">
            <template v-for="questionnaireSessionListItem in questionnaireCommunitySharedSessions">
                <QuestionnaireSessionListItem :questionnaireSessionListItem="questionnaireSessionListItem" />
            </template>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QuestionnaireUserSession } from '../../../types/types';
import QuestionnaireSessionListItem from './QuestionnaireSessionListItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../../store/store';
import { CREATE_QUESTIONNAIRE_USER_SESSION, GET_QUESTIONNAIRE_USER_SESSIONS_BY_USER, GET_SHARABLE_QUESTIONNAIRE_USER_SESSIONS_WITHOUT_OWNED } from '../../../services/queries/graphqlAPI';

const authStore = useAuthStore();
const router = useRouter();

const route = useRoute();

const sessionTitle = ref('');



const questionnaireCurrentUserSessions = ref<QuestionnaireUserSession[]>([]);
const questionnaireCommunitySharedSessions = ref<QuestionnaireUserSession[]>([]);

const questionnaireId = Number(route.params.questionnaireId);
const userId = Number(authStore.user?.id);
async function loadData() {
    questionnaireCurrentUserSessions.value = await GET_QUESTIONNAIRE_USER_SESSIONS_BY_USER(questionnaireId, userId);
    questionnaireCommunitySharedSessions.value = await GET_SHARABLE_QUESTIONNAIRE_USER_SESSIONS_WITHOUT_OWNED(questionnaireId, userId);
}



async function addNewQuestionnaireUserSession() {
    if (sessionTitle.value === '') {
        alert('Session Title cannot be empty')
        return
    }
    // create a new empty session in backend
    const createdSession = await CREATE_QUESTIONNAIRE_USER_SESSION(userId, sessionTitle.value, questionnaireId);

    // use the newly created session's id to navigate to QuestionnaireSessionEdit
    navigateToQuestionnaireSessionEdit(questionnaireId, createdSession.id);
}

function navigateToQuestionnaireSessionEdit(questionnaireId: number, sessionId: number) {
    router.push({ name: 'QuestionnaireSessionEdit', params: { questionnaireId, sessionId } });
}

loadData();

</script>

<style scoped></style>