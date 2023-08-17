<template>
    <div>
        <div class="group relative block overflow-hidden rounded">

            <img :src="questionnaire.image"
                alt="" class="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />

            <div class="relative border border-gray-100 bg-white p-6">

                <h3 class="mt-4 text-lg font-medium text-gray-900">{{questionnaire.title}}</h3>

                <button @click="navigateToQuestionnaireSessions()"
                    class="block mt-4 w-full rounded bg-blue-800 text-white p-4 text-sm font-medium transition hover:scale-105">
                    Enter
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { QuestionnaireType } from '../../types/types';

const router = useRouter();

const props = defineProps({
    questionnaire: {
        type: Object as () => QuestionnaireType,
        default: null,
    }
});

function navigateToQuestionnaireSessions() {
  const questionnaireId = props.questionnaire.id;
  router.push({ name: 'QuestionnaireSessionList', params: { questionnaireId } });
}
</script>

<style scoped></style>