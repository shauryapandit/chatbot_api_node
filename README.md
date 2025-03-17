# Gemini Chatbot API

This is a simple chatbot API built using **Express.js** and **Google Gemini API**. The API allows users to send messages and receive AI-generated responses, while also maintaining a chat history.

## Features
- Supports real-time chat with the **Gemini AI model**.
- Stores chat history in a JSON file.
- Provides an endpoint to fetch previous conversations.
- Built with **Node.js**, **Express.js**, and **Axios**.

## Prerequisites
- **Node.js** (v14+ recommended)
- **npm** (or **yarn**)
- **Google Gemini API Key**
- **Postman** (Optional, for API testing)

## Installation

1. **Clone the repository**


2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root.
   - Add your **Google Gemini API Key**:
     ```env
     GEMINI_API_KEY=your_api_key_here
     PORT=5000
     ```

4. **Run the server:**
   ```sh
   node server.js
   ```

## API Endpoints

### 1️⃣ Send a Chat Message
- **Endpoint:** `POST /chat`
- **Request Body:**
  ```json
  {
    "message": "What is the capital of India?"
  }
  ```
- **Response:**
  ```json
  {
    "question": "What is the capital of India?",
    "reply": "The capital of India is New Delhi."
  }
  ```

### 2️⃣ Get Chat History
- **Endpoint:** `GET /history`
- **Response:**
  ```json
  {
    "history": [
      { "role": "user", "parts": [{ "text": "Hello!" }] },
      { "role": "model", "parts": [{ "text": "Hi! How can I assist you?" }] }
    ]
  }
  ```

## Testing with Postman
1. Open **Postman**.
2. Set method to **POST**, and enter `http://localhost:5000/chat`.
3. Go to **Body → raw → JSON** and enter:
   ```json
   { "message": "Tell me a joke." }
   ```
4. Click **Send** to get a response.



