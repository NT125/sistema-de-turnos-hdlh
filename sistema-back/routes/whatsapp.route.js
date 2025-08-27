const express = require("express");
const router = express.Router();
const { client } = require("../utils/whatsapp");
const { MessageMedia } = require("whatsapp-web.js");
const path = require("path");
const axios = require("axios");

const messageBody = (fechaHora, doctor, consultorio, especialidad) => {
  return `📆 *Fecha y Hora*: ${fechaHora}\n🧑‍⚕️ *Doctor*: ${doctor}\n🏥 *Consultorio*: ${consultorio}\n🩺 *Especialidad*: ${especialidad}`;
};

router.post("/send", async (req, res) => {
  const { numeroDestino, mensaje } = req.body;

  if (!numeroDestino || !mensaje) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  try {
    const chatId = `${numeroDestino}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

router.post("/cancelado", async (req, res) => {
  const { target, paciente, fechaHora, doctor, consultorio, especialidad } =
    req.body;

  if (!target) {
    return res.status(400).json({ error: "Número de destino es requeridos" });
  }

  const mensaje = `*Turno cancelado a su solicitud*\n\nEstimado/a *${paciente}*. \n\nConfirmamos que su cita programada ha sido cancelada a su solicitud, detalles de la misma. \n\n${messageBody(
    fechaHora,
    doctor,
    consultorio,
    especialidad
  )} \n\nSi desea reprogramar su cita, no dude en contactarnos. Estaremos encantados de asistirte.\n\nAtentamente *Hospital Distrital las Heras*`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

router.post("/info-turno", async (req, res) => {
  const { target, paciente, fechaHora, doctor, consultorio, especialidad } =
    req.body;

  if (!target) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  const mensaje = `*Información de su turno*\n\nEstimado/a *${paciente}*. \n\nLe informamos que tiene una cita medica programada con los siguientes detalles: \n\n${messageBody(
    fechaHora,
    doctor,
    consultorio,
    especialidad
  )} \n\nLe recordamos la importancia de su asistencia puntual. Si por algún motivo necesita modificar o cancelar su turno, le solicitamos que nos lo comunique a la mayor brevedad posible o también puede hacerlo desde nuestra pagina web.\n\nAgradecemos su confianza en nuestros servicios.\n\nAtentamente *Hospital Distrital las Heras*`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

/**
 * Para informar que desde administracion el turno se cancelo
 */
router.post("/turno-cancelado", async (req, res) => {
  const { target, paciente, fechaHora, doctor, consultorio, especialidad } =
    req.body;

  if (!target) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  const mensaje = `*Turno cancelado*\n\nEstimado/a *${paciente}*. \n\nLamentamos informarle que su cita médica programada con los siguientes detalles ha sido cancelada por motivos administrativos: \n\n${messageBody(
    fechaHora,
    doctor,
    consultorio,
    especialidad
  )} \n\nLe pedimos disculpas por cualquier inconveniente que esta situación pueda causarle. \n\nSi desea reprogramar su cita, le invitamos a comunicarse con nosotros a la brevedad a través de nuestros canales habituales. \n\nAgradecemos su comprensión. \n\nAtentamente, *Hospital Distrital las Heras*`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});
/**
 * Para informar que desde administracion el turno se reprogramo
 */
router.post("/turno-reprogramado", async (req, res) => {
  const { target, paciente, fechaHora, doctor, consultorio, especialidad } =
    req.body;

  if (!target) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  const mensaje = `*Turno reprogramado*\n\nEstimado/a *${paciente}*. \n\nLamentamos informarle que su cita médica programada con los siguientes detalles ha sido reprogramada por motivos administrativos: \n\n${messageBody(
    fechaHora,
    doctor,
    consultorio,
    especialidad
  )} \n\nLe pedimos disculpas por cualquier inconveniente que esta situación pueda causarle.  \n\nAgradecemos su comprensión. \n\nAtentamente, *Hospital Distrital las Heras*`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});
router.post("/recover-password", async (req, res) => {
  const { target, link } = req.body;

  if (!target) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  const mensaje = `*Restablecer contraseña*\n\nRecibimos una solicitud para restablecer su contraseña. Para crear una nueva contraseña, por favor, haga clic en el siguiente enlace. \n\n🔗 ${link} \n\nSi no solicito este cambio, ignore este mensaje.\nSaludos cordiales.\n*Hospital Distrital las Heras*`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

router.post("/recordatorio-turno", async (req, res) => {
  const { target, paciente, fechaHora, doctor, consultorio, especialidad } =
    req.body;

  if (!target) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  const mensaje = `*Recordatorio de su turno*\n\nEstimado/a *${paciente}*. \n\nLe recordamos que tiene una cita médica programada para el día de hoy. A continuación, los detalles de su turno: \n\n${messageBody(
    fechaHora,
    doctor,
    consultorio,
    especialidad
  )} \n\nLe solicitamos que asista puntualmente a su cita. En caso de que necesite reprogramarla o cancelarla, le rogamos nos lo comunique lo antes posible.\n\nGracias por su atención y confianza en nuestros servicios.\n\nAtentamente *Hospital Distrital las Heras*`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

router.post("/enviar-pdf", async (req, res) => {
  const { target, pdfUrl } = req.body;

  if (!target) {
    return res
      .status(400)
      .json({ error: "Número de destino y mensaje son requeridos" });
  }

  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer", // Necesitamos los datos en formato binario
  });

  // Convertir los datos descargados en base64
  const base64Data = Buffer.from(response.data).toString("base64");

  // Extraer el nombre del archivo desde la URL
  const fileName = path.basename(pdfUrl);

  // Crear el objeto MessageMedia con el nombre dinámico
  const media = new MessageMedia("application/pdf", base64Data, fileName);

  const mensaje = `Adjuntamos el siguiente archivo\n\n`;

  try {
    const chatId = `${target}@c.us`;
    const response = await client.sendMessage(chatId, mensaje);
    const response2 = await client.sendMessage(chatId, media);
    res.json({ message: "Mensaje enviado", response });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

module.exports = router;
