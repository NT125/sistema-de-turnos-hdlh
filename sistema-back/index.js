const { checkToken } = require("./utils/middleware");
const { client } = require("./utils/whatsapp");
const conectarDB = require("./config/db");
const cors = require("cors");
const express = require("express");
const http = require("http");
const qrcode2 = require("qrcode");
const socketIo = require("socket.io");
const whatsappRoutes = require("./routes/whatsapp.route");

//Creamos servidor
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

conectarDB();

app.use(cors());
app.use(express.json());

let isClientReady = false; // Variable para almacenar el estado del cliente

// Función para manejar la generación del QR
const handleQRCodeGeneration = (qr) => {
  qrcode2.toDataURL(qr, (err, url) => {
    if (err) {
      console.error("Error generating QR code", err);
      return; // Salir si hay un error
    }
    io.emit("qr", url);
  });
};

// Eventos de cliente
client.on("qr", handleQRCodeGeneration);

client.on("ready", () => {
  console.log("Client is ready!");
  isClientReady = true; // Actualizar el estado cuando el cliente esté listo
  io.emit("qr-read", true); // Emitir evento para el frontend
  io.emit("ready"); // Emitir evento 'ready' para los clientes conectados
});

// Emitir el estado actual al conectar un nuevo cliente al socket
io.on("connection", (socket) => {
  console.log("New client connected");

  // Enviar el estado actual del cliente de WhatsApp al frontend
  if (isClientReady) {
    socket.emit("ready"); // Emitir solo al cliente recién conectado
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

client.initialize();
require("./cron");
app.use("/api/login", require("./routes/login"));
app.use("/api/medico", checkToken, require("./routes/medico"));
app.use("/api/especialidad", checkToken, require("./routes/especialidad"));
app.use("/api/paciente", require("./routes/paciente"));
app.use("/api/turno", checkToken, require("./routes/turno"));
app.use("/api/obra", checkToken, require("./routes/obrasocial"));
app.use("/api/whatsapp", whatsappRoutes);
//Inicio
// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
