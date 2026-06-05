const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// ====== CONFIGURE HERE ======
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = 7190824172;           // Replace with your chat id
// ============================

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const tasksFile = path.join(__dirname, 'tasks.json');

// Read tasks from file
function loadTasks() {
  return JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
}

// Save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// Command: set task
bot.onText(/\/task (.+) at (.+)/, (msg, match) => {
  const taskText = match[1];
  const time = match[2]; // format HH:MM (24hr)

  const tasks = loadTasks();
  tasks.push({ task: taskText, time });
  saveTasks(tasks);

  bot.sendMessage(msg.chat.id, `Task saved! 📌\n📝 ${taskText}\n⏰ ${time}`);
});

// SCHEDULE CHECK EVERY MINUTE
cron.schedule("* * * * *", () => {
  const now = new Date();
  const current = now.toTimeString().slice(0, 5); // HH:MM

  const tasks = loadTasks();

  tasks.forEach((t, index) => {
    if (t.time === current) {
      bot.sendMessage(CHAT_ID, `⏰ Reminder!\n${t.task}`);

      // Remove task after reminding
      tasks.splice(index, 1);
      saveTasks(tasks);
    }
  });
});

// Test start message
bot.sendMessage(CHAT_ID, "Bot started and ready! 🚀");
