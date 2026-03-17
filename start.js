const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const config = require("./config");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m.message) return;

    const text = m.message.conversation || m.message.extendedTextMessage?.text;
    const from = m.key.remoteJid;

    if (!text) return;

    // OWNER COMMAND
    if (text === ".owner") {
      await sock.sendMessage(from, {
        text: `👑 Owner: ${config.OWNER_NAME}\n🤖 Bot: ${config.BOT_NAME}`
      });
    }

    // MENU
    if (text === ".menu") {
      await sock.sendMessage(from, {
        text: `🔥 ${config.BOT_NAME} MENU 🔥

.owner - Show owner
.menu - Show menu

👑 Owner: ${config.OWNER_NAME}`
      });
    }
  });

  console.log(`✅ ${config.BOT_NAME} is running...`);
}

startBot();
