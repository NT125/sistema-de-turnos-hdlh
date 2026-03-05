const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.wwebjs_auth"
  }),

  webVersionCache: {
    type: "none"
  },

  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process"
    ]
  }
});

/* ======================
   EVENTOS
====================== */

client.on("qr", (qr) => {
  console.log("📱 Escanea el QR con WhatsApp");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("🔐 WhatsApp autenticado");
});

client.on("ready", () => {
  console.log("✅ WhatsApp conectado");
});

client.on("auth_failure", msg => {
  console.error("❌ Error de autenticación:", msg);
});

client.on("disconnected", reason => {
  console.log("⚠️ WhatsApp desconectado:", reason);
  console.log("🔄 Reintentando conexión...");
  client.initialize();
});

/* ======================
   INICIAR CLIENTE
====================== */

client.initialize();

module.exports = { client };