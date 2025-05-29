import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

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

 //start our server
app.listen(process.env.PORT || 3000, () => {
console.info(`Server is running on port ${PORT}`);
})