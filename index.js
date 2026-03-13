const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const app = express();
app.use(express.json());

async function startWhatsApp() {

  const browserPath = await chromium.executablePath();

  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: browserPath,
      headless: true,
      args: chromium.args
    }
  });

  client.on("qr", (qr) => {
    console.log("סרוק QR:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("WhatsApp מחובר");
  });

  client.initialize();

  app.post("/send", async (req, res) => {
    const { groupId, message } = req.body;

    try {
      await client.sendMessage(groupId, message);
      res.send("נשלח");
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

}

startWhatsApp();

app.listen(3000, () => {
  console.log("Server started");
});
