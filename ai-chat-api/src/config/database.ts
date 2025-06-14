import { neon } from "@neondatabase/serverless"
import { drizzle } from  "drizzle-orm/neon-http"
import dotenv from "dotenv"

//load env variables
dotenv.config()

//check if db url is in .env file
if(!process.env.DATABASE_URL){
throw new Error('database url is undefined!')
}

//init neon
const sql = neon(process.env.DATABASE_URL)

//init drizzle
export const db = drizzle(sql);

//ping a light weight query to check db live connection
(async () => {
  try {
    await sql`SELECT 1`;
    console.log("✅ DB connected and reachable");
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
  }
})();