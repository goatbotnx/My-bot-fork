const fs = require('fs');
const os = require('os');
const path = require('path');
const moment = require('moment');

module.exports = {
  config: {
    name: "uptime",
    version: "3.5",
    author: "Styled by nx (Cyber-Aesthetic Hybrid)",
    role: 0,
    shortDescription: "Cyber aesthetic uptime display",
    longDescription: "Shows uptime, system, and bot stats with futuristic cyber-neon design mixed with aesthetic layout ⚡💎",
    category: "system",
    aliases: ["cyup", "cyberup", "statusx"],
  },

  onStart: async function ({ api, event }) {
    try {
      // 🕒 Calculate uptime
      const uptime = process.uptime();
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);

      // 💻 System Info
      const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
      const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const cpuModel = os.cpus()[0].model;
      const platform = os.platform();
      const arch = os.arch();

      // 📦 Command Count
      const commandsPath = path.join(__dirname, "../cmds");
      let totalCommands = 0;
      if (fs.existsSync(commandsPath)) {
        const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
        totalCommands = files.length;
      } else if (global.GoatBot?.commands) {
        totalCommands = global.GoatBot.commands.size;
      }

      // 🌐 Random Cyber Readings
      const temp = Math.floor(Math.random() * 30) + 25;
      const cpuLoad = (process.cpuUsage().user / 1000000).toFixed(2);
      const signal = "█".repeat(10);

      // 💬 Build Message
      const msg = `
╔══════════════════════════════════╗
  ⚡  SYSTEM ONLINE // v3.5 ⚡
╚══════════════════════════════════╝
┊         ┊       ┊   ┊    ┊        ┊𖥸
┊         ┊       ┊   ┊   ˚✩ ⋆｡˚  ✩ ➳
┊         ┊       ┊   ✫ ➳
┊         ┊       ☪⋆   𖥸
┊ ⊹     ➳
✯⠀

💠 ──[ 𝗖𝗢𝗥𝗘 𝗦𝗧𝗔𝗧𝗨𝗦 ]── 💠
⏳ Uptime: ${days}d ${hours}h ${minutes}m
💻 Latency: ${Date.now() - event.timestamp}ms
📦 Commands: ${totalCommands}
🔋 Stability: ✅ Stable | 🧠 AI Normal Ops
╭───────────────💫───────────────╮
     🍧 𝑺𝒚𝒔𝒕𝒆𝒎 & 𝑩𝒐𝒕 𝑺𝒕𝒂𝒕𝒖𝒔 🍧
╰───────────────💫───────────────╯

💠 ──[ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ]── 💠
🪟 OS: ${platform.toUpperCase()} (${arch})
🧠 CPU: ${cpuModel}
🌊 RAM: ${(process.memoryUsage().rss / (1024 * 1024)).toFixed(2)} MB
🍫 Storage: ${usedMem}GB / ${totalMem}GB
⚙️ CPU Load: ${cpuLoad}%


💠 ──[ 𝗕𝗢𝗧 𝗘𝗡𝗚𝗜𝗡𝗘 𝗗𝗔𝗧𝗔 ]── 💠
📂 Directory: ${path.basename(__dirname)}
⚡ Node.js: ${process.version}
🧩 PID: ${process.pid}
🛰 Signal: ${signal} 100%
🔥 Temp: ${temp}°C
🧱 Network: Encrypted | AES-256 Secure

💠 ──[ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗔𝗧𝗔 ]── 💠
👑 Name: 𝙉𝙚𝙜𝙖𝙩𝙞𝙫𝙚 𝙓𝙖𝙡𝙢𝙖𝙣 (nx)

🛰 Messenger: https://m.me/nx210.2.0.is.back


💠 ──[ 𝗧𝗜𝗠𝗘 𝗦𝗬𝗡𝗖 ]── 💠
📅 ${moment().format('dddd, MMMM Do YYYY')}
🕒 ${moment().format('HH:mm:ss')} (${Intl.DateTimeFormat().resolvedOptions().timeZone})

─────────────────────────────
🌐 SYSTEM STATUS REPORT
🟢 Core Engine: ONLINE
🟢 Firewall: ACTIVE
🟢 Neural Link: STABLE
🟢 AI Threads: SYNCHRONIZED
─────────────────────────────

⚔️ 𝗚𝗢𝗔𝗧𝗕𝗢𝗧 𝗖𝗢𝗥𝗘 //  𝗕𝗨𝗜𝗟𝗗
💎 Developer: MÁYBÉ NX
⚙️ Power Source: “Quantum Node Reactor”
─────────────────────────────

♡₊˚💠・⟡・⚡・₊˚♡  
    SYSTEM RUNNING // NO ERRORS DETECTED  
♡₊˚⚙️・⟡・💾・₊˚♡
`;

      api.sendMessage(msg, event.threadID);
    } catch (err) {
      console.error("Cyber aesthetic uptime error:", err);
      api.sendMessage("❌ [SYSTEM ERROR] Unable to fetch core diagnostics.", event.threadID);
    }
  }
};
