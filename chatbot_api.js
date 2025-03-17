const express = require("express");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const headers = {
    "Content-Type": "application/json"
};

const chatHistoryFile = "chat_history.json";

// Load previous chat history if available
let myContents = [];
if (fs.existsSync(chatHistoryFile)) {
    try {
        myContents = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
}

// Middleware
app.use(express.json());

// Save chat history function
function saveChatHistory() {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(myContents, null, 2), "utf-8");
}

// API endpoint to send and receive chat messages
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    // Store user input
    myContents.push({ role: "user", parts: [{ text: message }] });

    const data = { contents: myContents };

    try {
        const response = await axios.post(url, data, { headers, timeout: 30000 });
        const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "No response received.";

        // Store bot response
        myContents.push({ role: "model", parts: [{ text: botReply }] });

        // Save updated chat history
        saveChatHistory();

        return res.json({ question: message , reply: botReply});

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Failed to process request." });
    }
});

// API to get chat history
app.get("/history", (req, res) => {
    return res.json({ history: myContents });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});