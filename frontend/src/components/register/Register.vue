<template>
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-lg">
            <h1 class="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                Digitizer
            </h1>

            <p class="mx-auto mt-4 max-w-md text-center text-gray-500">
                Product recommendation, get started now!
            </p>

            <form @submit.prevent="register"
                class="mb-0 mt-6 grid grid-cols-6 gap-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                <p class="col-span-6 text-center text-lg font-medium text-gray-500">Create an account</p>


                <div class="col-span-6">
                    <label for="Username" class="block text-sm font-medium text-gray-700">
                        Username
                    </label>

                    <input type="text" id="Username" name="username" v-model="username"
                        class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" />
                </div>

                <div class="col-span-6">
                    <label for="Email" class="block text-sm font-medium text-gray-700">
                        Email
                    </label>

                    <input type="email" id="Email" name="email" v-model="email"
                        class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="Password" class="block text-sm font-medium text-gray-700">
                        Password
                    </label>

                    <input type="password" id="Password" name="password" v-model="password"
                        class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="PasswordConfirmation" class="block text-sm font-medium text-gray-700">
                        Password Confirmation
                    </label>

                    <input type="password" id="PasswordConfirmation" name="password_confirmation"
                        v-model="passwordConfirmation"
                        class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm" />
                </div>

                <button type="submit"
                    class="col-span-6 block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white">
                    Sign Up
                </button>

                <p class="col-span-6 text-center text-sm text-gray-500">
                    Already have an account?
                    <a class="underline" href="/login">Log in</a>
                </p>
                <p v-if="errorMessage" class="col-span-6 text-center text-red-900">
                    {{ errorMessage }}
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { REGISTER_USER } from '../../services/queries/graphqlAPI';
import { useAuthStore } from '../../store/store';

import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');

const register = async () => {
    try {
        // Check if passwords match
        if (password.value !== passwordConfirmation.value) {
            errorMessage.value = "Passwords do not match";
            return;
        }

        // Call the mutation to register user
        const user = await REGISTER_USER(username.value, email.value, password.value);

        // Update the auth store with user and tokens
        authStore.setUser(user);
        authStore.setTokens({
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
        });

        // Clear form fields and error message
        username.value = '';
        email.value = '';
        password.value = '';
        passwordConfirmation.value = '';
        errorMessage.value = '';
        router.push({ name: 'Home' });
    } catch (error) {
        errorMessage.value = "Error registering user"; // Update error message as needed
    }
};

</script>

<style scoped></style>