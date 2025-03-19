import { serve } from "@hono/node-server";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";

// Parse Firebase credentials from .env
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Initialize Firebase
initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();
const chatHistoryRef = db.collection("chatHistory").doc("session1");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const app = new Hono();

// Load chat history from Firestore
async function loadChatHistory() {
    try {
        const doc = await chatHistoryRef.get();
        return doc.exists ? doc.data().history : [];
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
}

// Save chat history to Firestore
async function saveChatHistory(history) {
    try {
        await chatHistoryRef.set({ history });
    } catch (error) {
        console.error("Error saving chat history:", error);
    }
}

// API to handle chat messages
app.post("/chat", async (c) => {
    const { message } = await c.req.json();
    if (!message) return c.json({ error: "Message is required." }, 400);

    let myContents = await loadChatHistory();

    // Store user input
    myContents.push({ role: "user", parts: [{ text: message }] });

    const data = JSON.stringify({ contents: myContents });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: data,
        });

        const responseData = await response.json();
        const botReply = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

        // Store bot response
        myContents.push({ role: "model", parts: [{ text: botReply }] });

        // Save updated chat history
        await saveChatHistory(myContents);

        return c.json({ question: message, reply: botReply });
    } catch (error) {
        console.error("Error:", error);
        return c.json({ error: "Failed to process request." }, 500);
    }
});

// API to get chat history
app.get("/history", async (c) => {
    const history = await loadChatHistory();
    return c.json({ history });
});

// Start server
serve(app, (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
});
