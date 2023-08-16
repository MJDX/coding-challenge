<template>
    <div>
        <a @click="$emit('answer-clicked', data)" :class="{ 'border-blue-500 bg-blue-500': isSelected }"
            class="group flex items-center justify-between gap-4 rounded-lg border border-current px-5 py-3 text-indigo-600 transition-colors hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500">
            <span class="font-medium transition-colors group-hover:text-white">
                {{ data.label }}
            </span>
        </a>
    </div>
</template>

<script setup lang="ts">
import { AnswerOptionType } from '../../../../types/types';



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
console.log("isSelected " + props.isSelected);

props.data.image = "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"


defineEmits(["answer-clicked"])
</script>

<style scoped></style>