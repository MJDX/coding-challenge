<template>
    <!--
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.

  Plugins:
    - @tailwindcss/forms
-->

    <section class="bg-gray-50 h-full">
        <div class="p-8 md:p-12 lg:px-16 lg:py-24">
            <div class="mx-auto max-w-lg text-center">
                <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit
                </h2>

                <p class="hidden text-gray-500 sm:mt-4 sm:block">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae dolor
                    officia blanditiis repellat in, vero, aperiam porro ipsum laboriosam
                    consequuntur exercitationem incidunt tempora nisi?
                </p>
            </div>

            <div class="mx-auto mt-8 max-w-xl">
                <button @click="navigateToQuestionnairesList()"
                    class="mx-auto group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto">
                    <span class="text-sm font-medium"> Get Started With Digitizer </span>

                    <svg class="h-5 w-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToQuestionnairesList() {
    router.push({ name: 'QuestionnaireList' });
}

</script>

<style scoped></style>