const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

client.on("qr", (qr) => {
  console.log("סרוק את ה-QR:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("וואטסאפ מחובר!");
});

client.initialize();

/* API לשליחת הודעה */

app.post("/send", async (req, res) => {

  const { groupId, message } = req.body;

  try {
    await client.sendMessage(groupId, message);
    res.send("נשלח");
  } catch (err) {
    res.status(500).send(err.message);
  }

});

app.get("/", (req,res)=>{
  res.send("whatsapp server running");
});

app.listen(3000, () => {
  console.log("server started");
});
