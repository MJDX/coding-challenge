<template>
    <div @click="$emit('recommendation-clicked', data)">
        <a href="#" class="block">
            <img alt="Art" :src="data.image" class="w-full object-cover sm:h-48 " />

            <h3 class="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                {{ props.data.label }}
            </h3>
        </a>
    </div>
</template>

<script setup lang="ts">
import { RecommendationOptionType } from '../../../../../types/types';



const props = defineProps({
    data: {
        type: Object as () => RecommendationOptionType,
        default: null,
    }
});

defineEmits(["recommendation-clicked"])
</script>

<style scoped></style>