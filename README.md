# Hono Chatbot API

This is a chatbot API built using **Hono** and **Google Gemini AI**, with chat history stored in **Firebase Firestore**. The API allows users to send messages and receive responses from Gemini AI, while maintaining a chat history.

## Features
- 🌐 **REST API** with Hono framework
- 🤖 **AI-powered chatbot** using Google Gemini AI
- 🔥 **Firestore integration** for storing chat history
- 🚀 **Lightweight & fast** due to Hono’s performance optimizations
- 🔄 **JSON-based interaction** for easy integration with web or mobile apps

## Prerequisites
- Node.js (v18+ recommended)
- Firebase Firestore credentials
- A Google Gemini API key

## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/hono-chatbot-api.git
   cd hono-chatbot-api
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file and add the following:
   ```env
   FIREBASE_CREDENTIALS='{"type": "service_account", "project_id": "your-project-id", ... }'
   GEMINI_API_KEY='your-google-gemini-api-key'
   ```

## Usage

### Start the server
```sh
npm start
```
The server will start at `http://localhost:3000`

### API Endpoints

#### 1️⃣ **Send a Message**
- **Endpoint:** `POST /chat`
- **cURL Example:**
  ```sh
  curl -X POST "http://localhost:3000/chat" -H "Content-Type: application/json" -d "{\"message\": \"Who am i?\"}"
  ```

#### 2️⃣ **Get Chat History**
- **Endpoint:** `GET /history`
- **Response:**
  ```json
  {
    "history": [
      { "role": "user", "parts": [{ "text": "Hello!" }] },
      { "role": "model", "parts": [{ "text": "Hi there! How can I help?" }] }
    ]
  }
  ```
- **cURL Example:**
  ```sh
  curl -X GET http://localhost:3000/history
  ```

## Deployment

To deploy the API, you can use platforms like:
- **Vercel**: `vercel deploy`
- **Railway**: `railway up`
- **Render**: Deploy as a Node.js service

