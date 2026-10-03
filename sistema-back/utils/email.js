const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com', // El usuario debe configurarlo en variables.env
    pass: process.env.EMAIL_PASS || 'tu-password-de-aplicacion'
  }
});

exports.sendUrlResetPassword = async (email, link) => {
  if (!email) return;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecer contraseña - Hospital Distrital Las Heras',
    text: `Recibimos una solicitud para restablecer su contraseña. Para crear una nueva contraseña, por favor, haga clic en el siguiente enlace:\n\n${link}\n\nSi no solicitó este cambio, ignore este mensaje.\nSaludos cordiales.\nHospital Distrital las Heras`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de recuperación enviado a:", email);
  } catch (error) {
    console.error("Error al enviar email de recuperación:", error);
  }
};

exports.recordatorio = async (email, paciente, fechaHora, doctor, consultorio, especialidad) => {
  if (!email) return;

  const fecha = new Date(fechaHora);
  fecha.setHours(fecha.getHours() - 3);

  const opcionesFecha = { day: 'numeric', month: 'long' };
  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
  const opcionesHora = { hour: 'numeric', minute: '2-digit', hour12: true };
  const horaFormateada = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);
  const fechaHoraFormateada = `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recordatorio de su turno médico',
    text: `Estimado/a ${paciente},\n\nLe recordamos que tiene una cita médica programada para el día de hoy.\n\nDetalles del turno:\n- Fecha y Hora: ${fechaHoraFormateada}\n- Doctor: ${doctor}\n- Consultorio: ${consultorio}\n- Especialidad: ${especialidad}\n\nLe solicitamos que asista puntualmente a su cita.\n\nAtentamente,\nHospital Distrital Las Heras`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de recordatorio enviado a:", email);
  } catch (error) {
    console.error("Error al enviar email de recordatorio:", error);
  }
};

exports.reservaConfirmada = async (email, paciente, fechaHora, doctor, consultorio, especialidad) => {
  if (!email) return;

  const fecha = new Date(fechaHora);
  fecha.setHours(fecha.getHours() - 3);

  const opcionesFecha = { day: 'numeric', month: 'long' };
  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
  const opcionesHora = { hour: 'numeric', minute: '2-digit', hour12: true };
  const horaFormateada = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);
  const fechaHoraFormateada = `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de Reserva de Turno',
    text: `Estimado/a ${paciente},\n\nSu turno ha sido reservado exitosamente.\n\nDetalles del turno:\n- Fecha y Hora: ${fechaHoraFormateada}\n- Doctor: ${doctor}\n- Consultorio: ${consultorio}\n- Especialidad: ${especialidad}\n\nEn caso de no poder asistir, le rogamos cancelar con al menos 24 horas de antelación desde la plataforma.\n\nAtentamente,\nHospital Distrital Las Heras`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de reserva enviado a:", email);
  } catch (error) {
    console.error("Error al enviar email de reserva:", error);
  }
};

exports.turnoCancelado = async (email, paciente, fechaHora, doctor, consultorio, especialidad) => {
  if (!email) return;

  const fecha = new Date(fechaHora);
  fecha.setHours(fecha.getHours() - 3);

  const opcionesFecha = { day: 'numeric', month: 'long' };
  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
  const opcionesHora = { hour: 'numeric', minute: '2-digit', hour12: true };
  const horaFormateada = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);
  const fechaHoraFormateada = `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}, ${horaFormateada}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de Cancelación de Turno',
    text: `Estimado/a ${paciente},\n\nLe confirmamos que su cita médica ha sido cancelada.\n\nDetalles del turno cancelado:\n- Fecha y Hora: ${fechaHoraFormateada}\n- Doctor: ${doctor}\n- Consultorio: ${consultorio}\n- Especialidad: ${especialidad}\n\nSi desea reprogramar, no dude en contactarnos.\n\nAtentamente,\nHospital Distrital Las Heras`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de cancelación enviado a:", email);
  } catch (error) {
    console.error("Error al enviar email de cancelación:", error);
  }
};
