const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// ===== CONFIGURE HERE =====
const BOT_TOKEN = "8209785872:AAEpLlWIfgVhH0-mkGgjiqI3M9PmwrXMGr0";
const CHAT_ID = "7190824172";
// ==========================

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const tasksFile = path.join(__dirname, 'tasks.json');

// Create tasks.json automatically
if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, '[]');
}

// ===== START COMMAND =====
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `🚀 Welcome to Focus Reminder Bot!

Commands:
/add HH:MM Task
/list
/delete TASK_NUMBER`
    );
});

// ===== LOAD TASKS =====
function loadTasks() {
    return JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
}

// ===== SAVE TASKS =====
function saveTasks(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// ===== ADD TASK =====
bot.onText(/\/add (.+)/, (msg, match) => {
    const input = match[1];

    const firstSpace = input.indexOf(' ');

    if (firstSpace === -1) {
        bot.sendMessage(msg.chat.id, '❌ Format:\n/add 18:30 Study Java');
        return;
    }

    const time = input.substring(0, firstSpace);
    const task = input.substring(firstSpace + 1);

    const tasks = loadTasks();

    tasks.push({
        time,
        task
    });

    saveTasks(tasks);

    bot.sendMessage(
        msg.chat.id,
        `✅ Reminder Added\n⏰ ${time}\n📌 ${task}`
    );
});

// ===== LIST TASKS =====
bot.onText(/\/list/, (msg) => {
    const tasks = loadTasks();

    if (tasks.length === 0) {
        bot.sendMessage(msg.chat.id, '📭 No reminders found.');
        return;
    }

    let text = '📋 Your Reminders:\n\n';

    tasks.forEach((t, index) => {
        text += `${index + 1}. ⏰ ${t.time} → ${t.task}\n`;
    });

    bot.sendMessage(msg.chat.id, text);
});

// ===== DELETE TASK =====
bot.onText(/\/delete (\d+)/, (msg, match) => {
    const index = parseInt(match[1]) - 1;

    const tasks = loadTasks();

    if (index < 0 || index >= tasks.length) {
        bot.sendMessage(msg.chat.id, '❌ Invalid task number');
        return;
    }

    const removed = tasks.splice(index, 1);

    saveTasks(tasks);

    bot.sendMessage(
        msg.chat.id,
        `🗑 Deleted: ${removed[0].task}`
    );
});

// ===== CHECK REMINDERS EVERY MINUTE =====
cron.schedule('* * * * *', () => {

    const current = new Date().toTimeString().slice(0, 5);

    const tasks = loadTasks();

    tasks.forEach((t) => {

        if (t.time === current) {

            bot.sendMessage(
                CHAT_ID,
                `⏰ Reminder:\n${t.task}`
            );
        }
    });
});

// ===== TEST MESSAGE =====
bot.sendMessage(CHAT_ID, '🚀 Bot started and ready!');