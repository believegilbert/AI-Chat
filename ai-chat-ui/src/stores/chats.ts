import { defineStore } from "pinia";
import { ref } from 'vue'
import axios from 'axios'
import { useUsersStore } from "./users";

export interface ChatMessage {
    message: string;
    reply: string;
}

export interface FormattedMessage {
    role: "user" | "ai";
    content: string;
    timestamps: string;
}

export const useChatStore = defineStore('chat', ()=>{
    const messages = ref<{role: string; content: string; timestamps:string}[]>([]);
    const isLoading = ref(false);

    const userStore = useUsersStore();


    //Load previous chat messages
    const loadChatHistory = async() => { 
        if(!userStore.userId) return;

        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/get-messages`,{
                userId: userStore.userId
            })

            messages.value = data.messages
            .flatMap((msg: ChatMessage):FormattedMessage[]=> [
                {role: 'user', content: msg.message, timestamps: new Date().toISOString()},
                {role: 'ai', content: msg.reply, timestamps: new Date().toISOString()},
            ])
            .filter((msg: FormattedMessage) => msg.content)

        } catch (error) {
            console.error("error showing chat history")
        }
    }

    //send new message to ai
const sendNewMsg = async(message: string)=>{
    
    if(!message.trim() || !userStore.userId) return;
    messages.value.push({role: 'user', content: message, timestamps: new Date().toISOString()});
    isLoading.value = true;

    try {
       
     const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
            message,
            userId: userStore.userId
        });
        messages.value.push({
            role: 'ai', content: data.reply, timestamps: new Date().toISOString()
        })
    } catch (error) {
        console.error("error sending message", error)
        messages.value.push({
            role:'ai', content: 'unable to process request 😢', timestamps: new Date().toISOString()
        })
    }finally {
            isLoading.value = false
        }
    
}

    return {messages, isLoading, loadChatHistory, sendNewMsg}
}) 
