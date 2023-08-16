<template>
    <div>
        <div class="group relative block overflow-hidden rounded">

            <img src="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2664&q=80"
                alt="" class="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />

            <div class="relative border border-gray-100 bg-white p-6">

                <h3 class="mt-4 text-lg font-medium text-gray-900">Paint Recommendation</h3>

                <h4 class="mt-4 text-base font-normal text-gray-700">by @MJDX</h4>

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

const router = useRouter();

function navigateToQuestionnaireSessionView() {
    const questionnaireId = 42;
    const sessionId = 42;

    router.push({ name: 'QuestionnaireSessionView', params: { questionnaireId, sessionId } });
}
function navigateToQuestionnaireSessionEdit() {
    const questionnaireId = 42;
    const sessionId = 42;


    router.push({ name: 'QuestionnaireSessionEdit', params: { questionnaireId, sessionId } });
}
</script>

<style scoped></style>