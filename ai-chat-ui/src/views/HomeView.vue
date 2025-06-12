<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '../stores/users'
import { useRouter } from 'vue-router'
import axios from 'axios'
// Importing the robot image
import robotImage from '../assets/robot.png'

//initialize the user store
const userStore = useUsersStore()

//initialize the router
const router = useRouter()

const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')

const createUser = async () => {
    if (!name.value || !email.value) {
        error.value = 'Please enter both name and email.'
        return
    }

    loading.value = true
    error.value = ``
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/register-user`, {
            name: name.value,
            email: email.value
        })
        console.log(data)

        userStore.setUser({
            userId: data.userId,
            name: data.name,
        })
 console.log(userStore.userId)
        router.push('/chat')
    } catch (err) {
        error.value = 'Failed to create user. Please try again.'
    } finally {
        loading.value = false
    }
}


</script>

<template>
    <div class="h-[100vh] flex justify-center items-center text-white bg-gray-900">

        <div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <img :src="robotImage" alt="robot" class="mx-auto w-24 h024 mb-4" />
            <h1 class="text-2xl font-semibold mb-4 text-center">Welcome To Chat AI</h1>

            <input class="text-white w-full p-2 mb-2 rounded-lg focus:outline-none bg-gray-700"
                placeholder="enter your name" v-model="name" />
            <input class="text-white w-full p-2 mb-2 rounded-lg focus:outline-none bg-gray-700"
                placeholder="enter your email " v-model="email" />

            <button class="w-full p-2 bg-blue-500 rounded-lg flex items-center justify-center gap-2 text-[14px]"
                :class="loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'" :disabled="loading"
                @click="createUser">
                <svg v-if="loading" class=" animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                {{ loading ? 'Loading in...' : 'Start Chat' }}
            </button>

            <p v-if="error" class="text-red-400 text-center mt-2">
                {{ error }}
            </p>
        </div>
    </div>
</template>
