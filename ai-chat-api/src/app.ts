import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { StreamChat } from 'stream-chat';
import { GoogleGenAI } from "@google/genai";
import { db } from './config/database.js'; //database config file
import { eq } from 'drizzle-orm'; //import eq from drizzle-orm for query building
import { users, chats } from './db/schema.js'; //import users and chats tables from schema


//initialize express app
const app = express();

//initialize port
const PORT = process.env.PORT || 3000;

//MIDDLEWARES   
//use cors to allow cross-origin requests
app.use(cors());
//use express.json() to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//initialize gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

//initialize stream chat client
const chatClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
);

//register user with stream chat
app.post('/register-user', async (req: Request, res: Response): Promise<any> => {
    const { email, name } = req.body;

    //check if email and name are provided
    //if not, return a 400 error
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const userId = email.replace(/[^a-zA-Z0-9]/g, '_');

        //check if user exist in stream-chat
        const userResponse = await chatClient.queryUsers({ id: { $eq: userId } });

        if (!userResponse.users.length) {
            //add new user with stream chat
            await chatClient.upsertUser({
                id: userId,
                name: name,
                role: 'user',
            })
        }

        //check for existing user in the database
        const existingUser = await db
            .select()
            .from(users).
            where(eq(users.userId, userId));

        //if no user create one
        if (!existingUser.length) {
            console.info("user dosen't exist, adding them now...");
            await db.insert(users).values({
                userId, name, email
            })
        }

        res.status(200).json({ userId, name, email });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

//send message to gemini AI
app.post('/chat', async (req: Request, res: Response): Promise<any> => {
    const { userId, message } = req.body;
    //check if userId and message are provided
    if (!userId || !message) {
        return res.status(400).json({ error: 'User ID and message are required' });
    }

    try {
        //check if user exist in stream-chat first before he can send message
        const userResponse = await chatClient.queryUsers({ id: { $eq: userId } });

        if (!userResponse.users.length) {
            return res.status(400).json({ error: 'User does not exist, please register!' });
        }

        //check if user exist in the database
        const existingUser = await db
            .select()
            .from(users).
            where(eq(users.userId, userId));

        //if no user create one
        if (!existingUser.length) {
            return res.status(400).json({ error: 'User does not exist in the database, please register!' });
        }


        //fetch user past messages for context  
        const chatHistory = await db
            .select()
            .from(chats)
            .where(eq(chats.userId, userId))
            .orderBy(chats.createdAt)
            .limit(10);

        const history: any = chatHistory.flatMap((msg) => [
            { role: 'user', parts: [{ text: msg.message }] },
            { role: 'model', parts: [{ text: msg.reply }] }
        ])

        const genAiFunct = async (history: any, message: any) => {
            const chat: any = ai.chats.create({ model: "gemini-2.0-flash", history })
            const response: any = await chat.sendMessage({ message: message })

            const AIreply: string = await response.text ?? "Sorry, I didn't understand that. Can you please rephrase your question?";
            console.log(AIreply)
            return AIreply
        }

        const AIreply = await genAiFunct(history, message)




        //save chat to the database
        await db.insert(chats).values({ userId, message, reply: AIreply });

        //create a channel for the user to chat with AI
        const channel = chatClient.channel('messaging', `chat-${userId}`, {
            name: "AI Chat",
            created_by_id: 'ai_bot',
        } as any);

        await channel.create();

        //send message to the channel
        await channel.sendMessage({ text: AIreply, user_id: 'ai_bot' });

        res.status(200).json({ reply: AIreply });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while generating AI response' });
    }
})

//get chat history for a user
app.post('/get-messages', async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.body;
    //check if userId is provided   
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const chatHistory = await db
            .select()
            .from(chats)
            .where(eq(chats.userId, userId))
        res.status(200).json({ messages: chatHistory });
    } catch (error) {
        console.info("Error fetching chat history:", error);
        res.status(500).json({ error: 'Internal server error while fetching chat history' });
    }
})


//start our server
app.listen(process.env.PORT || 3000, () => {
    console.info(`Server is running on port ${PORT}`);
})