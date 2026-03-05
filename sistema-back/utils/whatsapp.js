const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox","--disable-dev-shm-usage"],
  },
  authStrategy: new LocalAuth(),
});

module.exports = { client };
