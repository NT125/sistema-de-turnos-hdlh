const cron = require("node-cron");
const Turno = require("./models/Turno");
const wpp = require('./controllers/whatsappController');
require('dotenv').config({ path: 'variables.env'});

cron.schedule("00 11 * * *", () => {
  obtenerTurnos()
  procesarTurnos();
  eliminarTurnos()
});


async function obtenerTurnos() {
  try {
    const turnos = await Turno.find({}).populate(
      "medico_id paciente_id obras_sociales.obrasocial_id especialidad_id"
    );
    return turnos;
  } catch (error) {
    console.log(error);
  }
}

async function procesarTurnos() {
  let turnos = await obtenerTurnos();
  for (let i = 0; i < turnos.length; i++) {
    if (turnos[i].fecha) {
      
      
      const fechaTurno = new Date(turnos[i].fecha);
      const fechaActual = new Date(); // Fecha y hora actual

      // Comparamos las fechas. Puedes ajustar la lógica de comparación según lo que necesites.
      if (fechaTurno.toDateString() === fechaActual.toDateString()) {

        // let doctor = turnos[i].medico_id.apellido
        if (turnos[i].medico_id != null && turnos[i].paciente_id != null && turnos[i].estado == 'Ocupado') {
          
          wpp.recordatorio(
            turnos[i].paciente_id.telefono,
            turnos[i].paciente_id.nombre,
            turnos[i].fecha,
            turnos[i].medico_id.nombre,
            turnos[i].consultorio,
            turnos[i].especialidad_id.nombreEsp
          );
        }
        
        
      }
    }
  }
}

async function eliminarTurnos() {
  let turnos = await obtenerTurnos();
  for (let i = 0; i < turnos.length; i++) {
    const fechaTurno = new Date(turnos[i].fecha);
    const fechaActual = new Date();

    const fechaTurnoNormalizada = new Date(fechaTurno.getFullYear(), fechaTurno.getMonth(), fechaTurno.getDate());
    const fechaActualNormalizada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

    const diferenciaTiempo = fechaActualNormalizada.getTime() - fechaTurnoNormalizada.getTime();

    const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);

    if (diferenciaDias >= 60) {
      const id = turnos[i]._id;
      try {
        const turno = await Turno.findByIdAndDelete(id);
        if (!turno) {
          console.log("No se encontró el turno para eliminar.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}



