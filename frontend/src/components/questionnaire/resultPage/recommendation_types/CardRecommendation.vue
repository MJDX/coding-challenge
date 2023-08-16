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
import { RecommendationOptionType } from '../../../../types/types';



const props = defineProps({
    data: {
        type: Object as () => RecommendationOptionType,
        default: null,
    }
});
props.data.image = "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"


defineEmits(["recommendation-clicked"])
</script>

<style scoped></style>