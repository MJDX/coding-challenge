
<template>
  <div class="h-screen w-screen flex flex-col">
    <Header />
    <MainContainer>
      <template #content>
        <!-- <Questionnaire :questionnaire-name="'colorRecommendationQuestionnaire'"/> -->
        <router-view />
      </template>
    </MainContainer>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import MainContainer from "./components/MainContainer.vue";
</script>

<style scoped></style>
