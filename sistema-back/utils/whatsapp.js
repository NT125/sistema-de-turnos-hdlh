const { Client, LocalAuth } = require("whatsapp-web.js");
const puppeteer = require("puppeteer");

const client = new Client({
  puppeteer: {
    executablePath: puppeteer.executablePath(),
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ],
  },
  authStrategy: new LocalAuth(),
});

module.exports = { client };