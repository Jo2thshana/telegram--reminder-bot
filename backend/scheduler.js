const fs = require('fs');
const path = require('path');
const sendTelegram = require("./sendtelegram");

const TASK_FILE = path.join(__dirname, 'tasks.json');

function checkTasks() {
    if (!fs.existsSync(TASK_FILE)) return;

    const tasks = JSON.parse(fs.readFileSync(TASK_FILE, 'utf-8'));
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    tasks.forEach((task, index) => {
        if (task.time === currentTime) {
            sendTelegram(task.chatId, `⏰ Reminder: ${task.message}`);
            tasks.splice(index, 1);
        }
    });

    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}

console.log("⏱ Reminder scheduler running...");
setInterval(checkTasks, 60000);
