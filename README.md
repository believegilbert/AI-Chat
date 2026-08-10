# AI-Chat

A full-stack AI-powered chat application built with **Vue 3** and **Node.js/Express**, integrating Google's **Gemini AI** to provide intelligent conversational responses.

## Features

* 🤖 AI-powered conversations using Google Gemini
* 💬 Chat with an AI assistant
* ⚡ Fast and responsive Vue.js frontend
* 🔄 API-based communication between frontend and backend
* 🗄️ PostgreSQL database for persistent chat data
* 📱 Responsive design

## Tech Stack

### Frontend

* Vue 3
* Vite
* Pinia

### Backend

* Node.js
* Express.js
* Google Gemini AI
* REST API

### Database

* PostgreSQL
* Drizzle ORM

## Getting Started

### Prerequisites

* Node.js
* npm
* PostgreSQL
* Git
* Google Gemini API key

### Clone the Repository

```bash
git clone https://github.com/believegilbert/AI-Chat.git
cd AI-Chat
```

### Install Dependencies

Install the frontend dependencies:

```bash
cd ai-chat-api
npm install
```

Install the backend dependencies:

```bash
cd ../ai-chat-ui
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

## Running the Application

Start the backend:

```bash
cd ai-chat-api
npm run dev
```

Start the frontend in another terminal:

```bash
cd ai-chat-ui
npm run dev
```

## How It Works

1. The user enters a message in the Vue frontend.
2. The frontend sends the request to the Express backend.
3. The backend processes the request and sends it to Gemini AI.
4. Gemini generates a response.
5. The response is returned to the frontend.
6. Chat data can be stored in PostgreSQL.


## Future Improvements

* Conversation search
* Chat history management
* File and image uploads
* AI model selection
* Voice input
* Improved real-time messaging
* Rate limiting and usage monitoring

## Author

**Believe Gilbert**

Junior Full-Stack Developer specializing in:

* React
* Vue.js
* TypeScript
* Node.js
* Express.js
* PostgreSQL
* MongoDB
