//Rutas para paciente
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { checkToken } = require('../utils/middleware');

//api/paciente
router.post('/', pacienteController.crearPaciente);
router.get('/', checkToken, pacienteController.obtenerPacientes);
router.get('/usuarios', checkToken, pacienteController.obtenerUsuarios);
router.get('/pacientes', checkToken, pacienteController.obtenerSoloPacientes);

router.get('/ban', checkToken, pacienteController.obtenerPacientesStrikes);
router.put('/:id', checkToken, pacienteController.actualizarPaciente);
router.get('/:id', checkToken, pacienteController.obtenerPaciente);
router.get('/termino/:termino', checkToken, pacienteController.obtenerPacienteTermino);

router.get('/terminoSec/:termino', checkToken, pacienteController.obtenerPacienteTerminoSec);
router.delete('/:id', checkToken, pacienteController.eliminarPaciente);
router.get('/turnos/:pacienteId', checkToken, pacienteController.obtenerTurnosDelPaciente);
router.post('/register',pacienteController.register);
router.post('/login',pacienteController.login);

// Rutas para recuperación de contraseña
router.post('/request-password-reset', pacienteController.requestPasswordReset);
router.post('/reset-password', pacienteController.resetPassword);
router.post('/reset-sintoken', checkToken, pacienteController.resetPasswordSinToken);
router.put('/admin-password/:id', checkToken, pacienteController.cambiarPasswordAdmin);


module.exports = router;