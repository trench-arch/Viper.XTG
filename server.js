const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const app = express();
app.use(express.json());

let pairCode = "Not generated";

async function startPairing(number) {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  // request pairing code
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(number);
    pairCode = code;
    console.log("PAIR CODE:", code);
  }

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("✅ Connected!");
      pairCode = "CONNECTED";
    }
  });
}

app.post("/pair", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.json({ status: false, message: "Enter number" });
  }

  await startPairing(number);
  res.json({ status: true, code: pairCode });
});

app.get("/code", (req, res) => {
  res.json({ code: pairCode });
});

app.listen(3000, () => {
  console.log("🚀 Pair server running on http://localhost:3000");
});
