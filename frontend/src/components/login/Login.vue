<template>
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-lg">
            <h1 class="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                Digitizer
            </h1>

            <p class="mx-auto mt-4 max-w-md text-center text-gray-500">
                Product recommendation, get started now!
            </p>

            <form @submit.prevent="login" class="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                <p class="text-center text-lg font-medium text-gray-500">Sign in to your account</p>

                <div>
                    <label for="username" class="sr-only">Username</label>

                    <div class="relative">
                        <input v-model="username" type="text"
                            class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Enter username" />

                        <span class="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 16s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2z" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div>
                    <label for="password" class="sr-only">Password</label>

                    <div class="relative">
                        <input v-model="password" type="password"
                            class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Enter password" />

                        <span class="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </span>
                    </div>
                </div>

                <button type="submit"
                    class="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white">
                    Sign in
                </button>

                <p class="text-center text-sm text-gray-500">
                    No account?
                    <a class="underline" href="/register">Sign up</a>
                </p>
                <p v-if="errorMessage" class="text-center text-red-900">
                    {{ errorMessage }}
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { CONNECT_USER } from '../../services/queries/graphqlAPI';
import { useAuthStore } from '../../store/store';
import { useRouter } from 'vue-router';
const router = useRouter();


const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
    try {
        // Call the mutation to connect user
        const user = await CONNECT_USER(username.value, password.value);

        // Update the auth store with user and tokens
        authStore.setUser({ id: user.id, username: user.username });
        authStore.setTokens({
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
        });

        // Clear form fields and error message
        username.value = '';
        password.value = '';
        errorMessage.value = '';

        router.push({ name: 'Home' });
    } catch (error) {
        errorMessage.value = "Invalid username or password";
    }
};
</script>

<style scoped></style>