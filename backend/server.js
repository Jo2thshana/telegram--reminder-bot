const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// ===== CONFIG =====
const BOT_TOKEN = "8209785872:AAEpLlWIfgVhH0-mkGgjiqI3M9PmwrXMGr0";
// ==================

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const tasksFile = path.join(__dirname, 'tasks.json');

// Create tasks.json if not exists
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

  bot.sendMessage(
    msg.chat.id,

`🚀 Focus Reminder Bot

Commands:

1️⃣ Add Reminder
remind HH:MM message

Example:
remind 14:30 drink water

2️⃣ View Reminders
/list

3️⃣ Delete Reminder
/delete 1`
  );
});

// ADD REMINDER
bot.on('message', (msg) => {

  const text = msg.text;

  if (!text.startsWith('remind')) return;

  const parts = text.split(' ');

  if (parts.length < 3) {

    bot.sendMessage(
      msg.chat.id,
      '❌ Format:\nremind HH:MM message'
    );

    return;
  }

  const time = parts[1];
  const task = parts.slice(2).join(' ');

  const tasks = loadTasks();

  tasks.push({
    time,
    task,
    chatId: msg.chat.id
  });

  saveTasks(tasks);

  bot.sendMessage(
    msg.chat.id,
    `✅ Reminder saved!\n⏰ ${time}\n📝 ${task}`
  );
});

// LIST REMINDERS
bot.onText(/\/list/, (msg) => {

  const tasks = loadTasks();

  if (tasks.length === 0) {

    bot.sendMessage(
      msg.chat.id,
      '📭 No reminders found.'
    );

    return;
  }

  let text = '📋 Your Reminders:\n\n';

  tasks.forEach((t, index) => {

    text += `${index + 1}. ⏰ ${t.time} → ${t.task}\n`;
  });

  bot.sendMessage(msg.chat.id, text);
});

// DELETE REMINDER
bot.onText(/\/delete (.+)/, (msg, match) => {

  const index = parseInt(match[1]) - 1;

  let tasks = loadTasks();

  if (index < 0 || index >= tasks.length) {

    bot.sendMessage(
      msg.chat.id,
      '❌ Invalid reminder number'
    );

    return;
  }

  const removed = tasks.splice(index, 1);

  saveTasks(tasks);

  bot.sendMessage(
    msg.chat.id,
    `🗑 Deleted: ${removed[0].task}`
  );
});

// CHECK REMINDERS EVERY MINUTE
cron.schedule('* * * * *', () => {

  const current =
    new Date().toTimeString().slice(0, 5);

  console.log("Checking reminders:", current);

  let tasks = loadTasks();

  tasks.forEach((t, index) => {

    if (t.time === current) {

      bot.sendMessage(
        t.chatId,
        `⏰ Reminder:\n${t.task}`
      );

      tasks.splice(index, 1);

      saveTasks(tasks);
    }
  });
});

// KEEP BOT ALIVE
setInterval(() => {
  console.log("Bot is alive...");
}, 60000);

console.log("🚀 Bot started and ready!");