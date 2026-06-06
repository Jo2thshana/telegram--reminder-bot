const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// ===== CONFIG =====
const BOT_TOKEN = "8209785872:AAEpLlWIfgVhH0-mkGgjiqI3M9PmwrXMGr0";
const CHAT_ID = "7190824172";
// ==================

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const tasksFile = path.join(__dirname, 'tasks.json');

// Create file if not exists
if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, '[]');
}

// Load tasks
function loadTasks() {
  return JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
}

// Save tasks
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// START command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`🚀 Focus Reminder Bot Ready!

Use:
remind HH:MM message

Example:
remind 10:30 drink water`);
});

// Reminder command
bot.on('message', (msg) => {

  const text = msg.text;

  if (!text.startsWith('remind')) return;

  const parts = text.split(' ');

  if (parts.length < 3) {
    bot.sendMessage(msg.chat.id,
      '❌ Format:\nremind HH:MM message');
    return;
  }

  const time = parts[1];
  const task = parts.slice(2).join(' ');

  const tasks = loadTasks();

  tasks.push({ time, task });

  saveTasks(tasks);

  bot.sendMessage(
    msg.chat.id,
    `✅ Reminder saved!\n⏰ ${time}\n📝 ${task}`
  );
});

// Check reminders every minute
cron.schedule('* * * * *', () => {

  const current =
    new Date().toTimeString().slice(0, 5);

  const tasks = loadTasks();

  tasks.forEach((t, index) => {

    if (t.time === current) {

      bot.sendMessage(
        CHAT_ID,
        `⏰ Reminder:\n${t.task}`
      );

      tasks.splice(index, 1);

      saveTasks(tasks);
    }
  });
});

console.log("Bot running...");