// const fs = require("fs");
// const axios = require("axios");
// require("dotenv").config();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// const headers = {
//     "Content-Type": "application/json"
// };

// const chatHistoryFile = "chat_history.json";

// // Load previous chat history if available
// let myContents = [];
// if (fs.existsSync(chatHistoryFile)) {
//     try {
//         myContents = JSON.parse(fs.readFileSync(chatHistoryFile, "utf-8"));
//     } catch (error) {
//         console.error("Error loading chat history:", error);
//     }
// }

// const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// function saveChatHistory() {
//     fs.writeFileSync(chatHistoryFile, JSON.stringify(myContents, null, 2), "utf-8");
// }

// async function chat() {
//     readline.question("Type...|\t", async (usrInput) => {
//         if (usrInput.toLowerCase() === "exit") {
//             console.log("Exiting chat...");
//             readline.close();
//             return;
//         }

//         // Store user input
//         myContents.push({ role: "user", parts: [{ text: usrInput }] });

//         const data = { contents: myContents };

//         try {
//             const response = await axios.post(url, data, { headers, timeout: 30000 });
//             const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "No response received.";

//             console.log("Mr. Gemni:", botReply);

//             // Store bot response
//             myContents.push({ role: "model", parts: [{ text: botReply }] });

//             // Save updated chat history
//             saveChatHistory();

//         } catch (error) {
//             console.error("Error:", error.response ? error.response.data : error.message);
//         }

//         chat();
//     });
// }

// chat();


const fs = require("fs");
const axios = require("axios");
const readline = require("readline");
require("dotenv").config();
const admin = require("firebase-admin");

// Parse Firebase credentials from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const chatHistoryRef = db.collection("chatHistory").doc("session1");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const headers = { "Content-Type": "application/json" };

// Load chat history from Firestore
async function loadChatHistory() {
    try {
        const doc = await chatHistoryRef.get();
        return doc.exists ? doc.data().history : [];
    } catch (error) {
        console.error("Error fetching chat history from Firestore:", error);
        return [];
    }
}

// Save chat history to Firestore
async function saveChatHistory(history) {
    try {
        await chatHistoryRef.set({ history });
    } catch (error) {
        console.error("Error saving chat history to Firestore:", error);
    }
}

// Start chat
async function chat() {
    let myContents = await loadChatHistory(); // Load previous chat history

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askQuestion() {
        rl.question("Type...|\t", async (usrInput) => {
            if (usrInput.toLowerCase() === "exit") {
                console.log("Exiting chat...");
                rl.close();
                return;
            }

            // Store user input
            myContents.push({ role: "user", parts: [{ text: usrInput }] });

            const data = { contents: myContents };

            try {
                const response = await axios.post(url, data, { headers, timeout: 30000 });
                const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "No response received.";

                console.log("Mr. Gemini:", botReply);

                // Store bot response
                myContents.push({ role: "model", parts: [{ text: botReply }] });

                // Save updated chat history to Firestore
                await saveChatHistory(myContents);
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message);
            }

            askQuestion();
        });
    }

    askQuestion();
}

chat();
