<template>
    <div>
        <div class="relative h-8">
            <div class="h-full items-center px-2">
                <div class="horizontal-line">
                    <div v-for="index in maxPosition" :key="index"
                        :style="{ left: `calc(${(index - 1) * 100 / maxPosition}% - 1px)` }" class="divider">
                    </div>
                </div>
            </div>
            <div class="absolute top-0 left-0 h-full w-full px-2">
                <div class="range-container" @click="handleClick" @mousedown="handleMouseDown" @mouseup="handleMouseUp"
                    ref="rangeContainer">
                    <input type="hidden" :value="selectedOptionPosition" @input="updateValue">
                    <div class="range-track" :style="{ width: valuePercentage + '%' }"></div>
                    <div class="range-thumb" :style="{ left: valuePercentage + '%' }"></div>
                    <!-- <div class="range-label">{{ displayValue }}</div> -->
                </div>
            </div>
        </div>
        <div class="labels w-full flex flex-row px-2">
            <p v-for="option, index in listOfOptions" :key="index" :class="{
                'first-label': index === 0,
                'label': index !== 0 && index !== maxPosition,
                'last-label': index === maxPosition
            }"
                :style="{ width: index === 0 || index === maxPosition ? `${1 / (2 * maxPosition) * 100}%` : `${1 / maxPosition * 100}%` }">
                {{ option.label }}
            </p>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';
import { AnswerOptionType } from '../../../../../types/types';

const props = defineProps({
    listOfOptions: {
        type: Array as () => AnswerOptionType[],
        required: true,
    },
    selectedOption: {
        type: Object as () => AnswerOptionType
    }
});

const { listOfOptions } = props;

const minPosition = 0;
const maxPosition = listOfOptions.length - 1
const step = 1

const selectedOptionPosition = ref<number>(minPosition);
if (props.selectedOption != null) {    
    listOfOptions.some((option, index) => {
        
        if (option.value === props.selectedOption?.value) {
            selectedOptionPosition.value = index;
            
            return true;
        }
    })
}
const rangeContainer = ref<HTMLElement | null>(null);


function updateValue(event: Event) {
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue >= minPosition && newValue <= maxPosition) {
        setSelectedPosition(Math.round(newValue / step) * step);
    }
}

function handleClick(event: MouseEvent) {
    // Trigger a mousemove event with the current value when the user clicks without dragging
    handleMouseMove(event);
}
function handleMouseDown() {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(event: MouseEvent) {
    if (!rangeContainer.value) return;

    const containerRect = rangeContainer.value.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const percentage = (mouseX / containerRect.width) * 100;
    const newValue = Math.round((percentage / 100) * (maxPosition - minPosition) / step) * step + minPosition;

    if (newValue >= minPosition && newValue <= maxPosition) {
        setSelectedPosition(newValue);
    }
}

// Computed properties
const valuePercentage = computed(() => ((selectedOptionPosition.value - minPosition) / (maxPosition - minPosition)) * 100);
// const displayValue = computed(() => value.value);



const emit = defineEmits(["answer-clicked"])
function setSelectedPosition(newValue: number) {
    selectedOptionPosition.value = newValue;
    emit('answer-clicked',listOfOptions[newValue]);

}
</script>
  
<style scoped>
.labels p {
    @apply whitespace-pre-line break-words text-xs text-gray-400;
    white-space: pre-line;
    overflow-wrap: break-word;
}


.label {
    @apply text-center;
}

.first-label {
    @apply text-left;
}

.last-label {
    @apply text-right;
}

.horizontal-line {
    @apply w-full h-[1px] bg-gray-400 relative top-1/2;
}

.divider {
    @apply w-[1px] h-1 bg-gray-400 absolute;
}

.range-slider::-webkit-slider-thumb {
    @apply appearance-none h-4 w-4 rounded-full bg-blue-900 relative translate-y-1/2
}

.range-slider::-webkit-slider-runnable-track {
    @apply h-8 bg-transparent
}

.range-container {
    @apply relative w-full min-w-[300px] h-full bg-transparent rounded-lg;
}

.range-track {
    @apply absolute top-1/2 left-0 h-[2px] bg-blue-500 rounded-lg;
}

.range-thumb {
    @apply absolute left-1/2 -translate-x-1/2 translate-y-1/2 transform w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

.range-label {
    @apply absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-sm;
}
</style>