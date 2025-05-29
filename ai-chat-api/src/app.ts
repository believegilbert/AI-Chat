import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { StreamChat } from 'stream-chat';
import { GoogleGenAI } from "@google/genai";

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
 //function to send message to gemini AI and get response
const geminiAI:any = async(userMessage:any)=> {
  const response:any = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userMessage,
  });
  console.log(response.text);
 const reply:string =  response.text ?? "Sorry, I didn't understand that. Can you please rephrase your question?";
    //return the reply from gemini AI
 return reply
}

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

        if(!userResponse.users.length) {
            //add new user with stream chat
            await chatClient.upsertUser({
                id: userId,
                name: name,
                role: 'user',
            })
        }

        res.status(200).json({userId, name});
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

    if(!userResponse.users.length) {
         return res.status(400).json({ error: 'User does not exist, please register!' });
    }
         //Ai response from gemini AI with initialized function call back
      const AIreply: string = await geminiAI(message);

      //create a channel for the user to chat with AI
      const channel = chatClient.channel('messaging', `chat-${userId}`, {
    name: "AI Chat",
    created_by_id: 'ai_bot',
      } as any);

      await channel.create();
        //send message to the channel
        await channel.sendMessage({text: AIreply, user_id: 'ai_bot' });

   res.status(200).json({ message: 'AI successfully replied' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while generating AI response' });
    }
 

        
})

//start our server
app.listen(process.env.PORT || 3000, () => {
    console.info(`Server is running on port ${PORT}`);
})