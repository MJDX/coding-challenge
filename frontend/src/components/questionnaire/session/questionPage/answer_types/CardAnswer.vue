<template>
    <div :class="{ 'border-blue-500 bg-blue-500': isSelected }" @click="$emit('answer-clicked', data)">
        <a href="#" class="block">
            <img alt="Art" :src="props.data.image" class="w-full object-cover sm:h-48 " />

            <h3 class="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                {{ props.data.label }}
            </h3>
        </a>
    </div>
</template>

<script setup lang="ts">
import { AnswerOptionType } from '../../../../../types/types';



const props = defineProps({
    data: {
        type: Object as () => AnswerOptionType,
        default: null,
    },
    isSelected: {
        type: Boolean,
        default: false,
    }
});

defineEmits(["answer-clicked"])
</script>

<style scoped></style>