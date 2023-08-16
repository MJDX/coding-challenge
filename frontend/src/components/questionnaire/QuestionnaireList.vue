<template>
    <div class="max-w-screen-xl mx-auto p-8">
        <h1 class="mt-4 text-2xl font-medium text-gray-900">Recommendation Questionnaires</h1>

        <div class="grid grid-cols-4 gap-4 mt-8">
            <QuestionnaireListItem/>
            <QuestionnaireListItem/>
        </div>

    </div>
</template>

<script setup lang="ts">
import QuestionnaireListItem from './QuestionnaireListItem.vue';
</script>

<style scoped></style>