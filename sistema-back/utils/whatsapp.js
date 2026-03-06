const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // Estos argumentos son obligatorios para Render y otros servidores en la nube
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ]
        // Generalmente no necesitas especificar "executablePath" si configuraste la variable de caché correctamente
    }
});

client.initialize();
module.exports = { client };