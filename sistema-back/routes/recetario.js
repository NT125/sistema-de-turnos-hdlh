const express = require('express');
const router = express.Router();
const recetarioController = require('../controllers/recetarioController');

router.get('/medicamentos', recetarioController.obtenerMedicamentos);
router.post('/medicamentos', recetarioController.crearMedicamento);
router.get('/medicamentos/:id', recetarioController.obtenerMedicamentoPorId);
router.put('/medicamentos/:id', recetarioController.actualizarMedicamento);
router.delete('/medicamentos/:id', recetarioController.eliminarMedicamento);
router.post('/comprobantes', recetarioController.crearComprobante);
router.get('/comprobantes', recetarioController.obtenerComprobantes);
router.get('/comprobantes/:id', recetarioController.obtenerComprobantePorId);
router.get('/paciente/:dni', recetarioController.buscarPacientePorDni);

module.exports = router;
