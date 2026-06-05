// bot.js
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

const token = '8236525475:AAEMQJAY1LxbyjAXNxZx8ZAXbUV4m3-YFpI';
const bot = new TelegramBot(token, { polling: true });

const TASK_FILE = path.join(__dirname, 'task.json');

// Create task.json if not exists
if (!fs.existsSync(TASK_FILE)) {
    fs.writeFileSync(TASK_FILE, JSON.stringify([], null, 2));
}

bot.on('message', (msg) => {
    console.log("Chat ID:", msg.chat.id);
    bot.sendMessage(msg.chat.id, "✔ Bot connected! Chat ID received.");
});
