<template>
    <div class="max-w-md mx-auto my-4">
        <span id="ProgressLabel" class="sr-only">Loading</span>

        <span role="progressbar" aria-labelledby="ProgressLabel" aria-valuenow="75" class="block rounded-full bg-gray-200">
            <span class="block h-3 rounded-full bg-indigo-600" :style="{ width: progress + '%' }"></span>
        </span>
    </div>
</template>

<script setup lang="ts">

const props= defineProps({
    progress: {
        type: Number,
        default: 0,
    },
});


</script>

<style scoped></style>