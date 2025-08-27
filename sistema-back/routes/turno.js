//Rutas para especialidad
const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
//api/turno
router.post('/', turnoController.crearTurno);
router.get('/',turnoController.obtenerTurnos);
router.get('/hoy',turnoController.obtenerTurnosHoy);
router.get('/fecha/:fecha',turnoController.obtenerTurnosPorFecha);
// Ruta para obtener turnos por médico (nombre o legajo)
router.get('/medico/:termino', turnoController.obtenerTurnosPorMedico);
// Ruta para obtener turnos por paciente (nombre o DNI)
router.get('/paciente2/:termino', turnoController.obtenerTurnosPorPaciente);
router.get('/obra/:termino', turnoController.obtenerTurnosPorObraSocial);
router.get('/consultorio/:termino', turnoController.obtenerTurnosPorConsultorio);
router.get('/especialidad/:termino', turnoController.obtenerTurnosPorEspecialidad);
router.get('/:id',turnoController.obtenerTurno);
router.put('/:id', turnoController.actualizarTurno);
router.put('/secretaria/:id', turnoController.actualizarTurnoSecretaria);
router.delete('/:id', turnoController.eliminarTurno);
router.get('/paciente/:paciente_id', turnoController.getTurnosByPaciente);
module.exports = router;