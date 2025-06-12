<script setup lang="ts">
import Header from '../components/Header.vue';
import { onMounted, nextTick } from 'vue';
import { useUsersStore } from '../stores/users';
import { useChatStore } from '../stores/chats';
import { useRouter } from 'vue-router';
import chatInput from "../components/ChatInput.vue"

const userStore = useUsersStore()
const chatStore = useChatStore()
const router = useRouter()

//ensure user is loggged in
if (!userStore.userId) {
  router.push("/")
}

//format ai message for better display
const formatMessage = (text:string) => {
  if(!text) return;

  return text
    .replace(/\n/g, '<br>') // Preserve line breaks
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic text
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>') // Bullet points
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>') // Numbered lists
    .replace(/<\/li>\n<li>/g, '</li><li>') // Ensure list continuity
    .replace(/<li>/, '<ul><li>') // Wrap in `<ul>`
    .replace(/<\/li>$/, '</li></ul>'); // Close the `<ul>`
}

//autoscroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  })
};

onMounted(async() => {
  chatStore.loadChatHistory().then(() => scrollToBottom());
})


const handleMsg = (message: string)=>{
  chatStore.sendNewMsg(message)
  scrollToBottom()
}


</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <Header />
    <div class="text-gray-500 text-[12px] sm:text-[13px] md:text-[14px] ml-[1rem] font-medium mt-[0.75rem] mb-[1rem]">
     logged in as <span class="font-extrabold "> {{ userStore.name }} </span> 🔒
    </div>
   
    <div v-if="(!chatStore.messages.length)" class="flex flex-1 justify-center items-center mt-[40%] text-gray-400">
    <h1 class="text-center px-4 text-[14px] md:text-[17px] lg:text-[18px]">Send a message to start chat</h1>
    </div>

    <!-- chat messages -->
    <div id="chatContainer" class="flex-1 overflow-y-auto scrollbar-hide mx-auto w-full md:w-[80%] p-4 space-y-4">
      <div 
      v-for="(message, index) in chatStore.messages" 
      :key="index"
       class="flex items-start"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'">

        <div  
            class="relative mx-w-ms px-4 py-2 rounded-lg"
          :class="message.role === 'user' ? 'bg-blue-600 text-white max-w-[250px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[650px] ' : 'bg-gray-700 text-white max-w-[250px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[650px] '"
         > 
         <div v-html="formatMessage(message.content)"></div>
       <div :class="message.role === 'user' ? 'w-3 h-3 bg-blue-600 rotate-45 absolute bottom-2 right-0.5 translate-x-1 translate-y-1': 'w-3 h-3 bg-gray-700 rotate-40 absolute bottom-0 left-0 translate-x-[-1px] translate-y-[-3px]'"></div>

          </div>
      </div>
      <div v-if="chatStore.isLoading" class="flex justify-start">
        <div class="bg-gray-700 text-white rounded-lg px-4 py-2">
          <span class="animate-pulse">
            AI is thinking...
          </span>

        </div>
      </div>
    </div>
    <chatInput @send="handleMsg" />
  </div>
</template>
