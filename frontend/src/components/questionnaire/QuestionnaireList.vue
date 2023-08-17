<template>
    <div class="max-w-screen-xl mx-auto p-8">
        <h1 class="mt-4 text-2xl font-medium text-gray-900">Recommendation Questionnaires</h1>

        <div class="grid grid-cols-4 gap-4 mt-8">
            <template v-for="questionnaire in questionnaires" :key="questionnaire.id">
                <QuestionnaireListItem :questionnaire="questionnaire"/>
            </template>
        </div>

    </div>
</template>

<script setup lang="ts">
import QuestionnaireListItem from './QuestionnaireListItem.vue';
import { GET_QUESTIONNAIRES } from '../../services/queries/graphqlAPI';
import { QuestionnaireType } from '../../types/types';
import { ref, onMounted } from 'vue';

const questionnaires = ref<QuestionnaireType[]>([]);

onMounted(async () => {
  try {
    const fetchedQuestionnaires = await GET_QUESTIONNAIRES();
    if (fetchedQuestionnaires) {
      questionnaires.value = fetchedQuestionnaires;
    }
  } catch (error) {
    console.error('Error while fetching questionnaires:', error);
  }
});

</script>

<style scoped></style>