const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

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

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

function saveChatHistory() {
    fs.writeFileSync(chatHistoryFile, JSON.stringify(myContents, null, 2), "utf-8");
}

async function chat() {
    readline.question("Type...|\t", async (usrInput) => {
        if (usrInput.toLowerCase() === "exit") {
            console.log("Exiting chat...");
            readline.close();
            return;
        }

        // Store user input
        myContents.push({ role: "user", parts: [{ text: usrInput }] });

        const data = { contents: myContents };

        try {
            const response = await axios.post(url, data, { headers, timeout: 30000 });
            const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "No response received.";

            console.log("Mr. Gemni:", botReply);

            // Store bot response
            myContents.push({ role: "model", parts: [{ text: botReply }] });

            // Save updated chat history
            saveChatHistory();

        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
        }

        chat();
    });
}

chat();


