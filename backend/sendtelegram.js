const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot("8236525475:AAEMQJAY1LxbyjAXNxZx8ZAXbUV4m3-YFpI", { polling: false });

function sendTelegram(chatId, message) {
    bot.sendMessage(chatId, message)
        .then(() => console.log("📩 Sent:", message))
        .catch(err => console.error(err));
}

module.exports = sendTelegram;
