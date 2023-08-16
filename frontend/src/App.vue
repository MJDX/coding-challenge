
<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col">
    <Header />
    <div class="flex-grow flex flex-row w-full">
      <MainContainer>
        <template #content>
          <Questionnaire :questionnaire-name="'colorRecommendationQuestionnaire'"/>
        </template>
      </MainContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import MainContainer from "./components/MainContainer.vue";
import Questionnaire from "./components/questionnaire/Questionnaire.vue";
</script>

<style scoped></style>
