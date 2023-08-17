<template>
    <aside class="bg-gray-200 w-96 h-full overflow-y-auto">
        <h3 class="text-lg mt-4">
            Navigation
        </h3>
        <ul>
            <template v-for="item in navTree" :key="item.pageId">
                <NavigationItem :nav-item="item" :is-active="currentNavItem?.pageId === item.pageId" @nav-item-clicked="onNavItemClick" />
            </template>
        </ul>
    </aside>
</template>

<script setup lang="ts">

import { NavigationTreeItemType } from '../../../types/types';
import NavigationItem from './NavigationItem.vue'

const props = defineProps({
    navTree: {
        type: Array as () => NavigationTreeItemType[],
        default: [],
    },
    currentNavItem: {
        type: Object as () => NavigationTreeItemType,
        default: null,
    }
});

const emit = defineEmits(["onNavItemClick"])
function onNavItemClick(clickedNavItem: NavigationTreeItemType) {
    emit('onNavItemClick', clickedNavItem);
}

</script>

<style scoped></style>