<template>
    <div>
        <a @click="$emit('button-click-event', props.buttonName)"
            class="group flex items-center justify-between gap-4 rounded-lg border border-current px-5 py-3 text-indigo-600 transition-colors hover:bg-indigo-600 focus:outline-none focus:ring active:bg-indigo-500">
            <span class="font-medium transition-colors group-hover:text-white">
                {{ props.buttonLabel }}
            </span>
        </a>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    buttonName: {
        type: String,
        default: null,
    },
    buttonLabel: {
        type: String,
        default: "Find out more",
    }
});

defineEmits(["button-click-event"])
</script>

<style scoped></style>