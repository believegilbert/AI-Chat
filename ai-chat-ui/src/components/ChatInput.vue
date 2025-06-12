<script setup lang="ts">
import { ref } from "vue"

const message = ref('')
const emit = defineEmits(['send'])

const sendMessage = ()=>{
if(!message.value.trim()) return;
emit('send', message.value);
message.value = ''
}
</script>

<template> 

    <div class="p-4 bg-gray-800 flex mx-auto w-full md:w-[80%]">
       
        <input
         v-model="message" 
        @keyup.enter="sendMessage"
        placeholder="send a message"
        type="text"
        class="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
        />
        <button @click="sendMessage" class="ml-2 px-4 py-2 bg-blue-500 rounded-lg text-[14px]">send message</button>
    </div>
 
</template>