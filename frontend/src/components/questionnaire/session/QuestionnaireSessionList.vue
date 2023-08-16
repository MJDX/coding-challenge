<template>
    <div class="max-w-screen-xl mx-auto p-8">
        <div class="flex gap-4">
            <h1 class="mt-4 text-2xl font-medium text-gray-900">My sessions</h1>

            <button @click="addNewQuestionnaireUserSession()"
                class="block rounded bg-green-800 text-white px-4 text-sm font-medium transition hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6Z" />
                </svg>
            </button>
        </div>

        <div class="grid grid-cols-4 gap-4 mt-8">
            <QuestionnaireSessionListItem />
            <QuestionnaireSessionListItem />
        </div>

        <h1 class="mt-4 text-2xl font-medium text-gray-900">Community sessions</h1>

        <div class="grid grid-cols-4 gap-4 mt-8">
            <QuestionnaireSessionListItem />
            <QuestionnaireSessionListItem />
            <QuestionnaireSessionListItem />

        </div>

    </div>
</template>

<script setup lang="ts">
import QuestionnaireSessionListItem from './QuestionnaireSessionListItem.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function addNewQuestionnaireUserSession(){
    // create a new empty session in backend

    // use the newly created session's id to navigate to QuestionnaireSessionEdit
    navigateToQuestionnaireSessionEdit(42,16);
}

function navigateToQuestionnaireSessionEdit(questionnaireId : number,sessionId : number) {
    router.push({ name: 'QuestionnaireSessionEdit', params: { questionnaireId, sessionId } });
}

</script>

<style scoped></style>