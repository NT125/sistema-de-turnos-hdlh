//Rutas para especialidad
const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');
//api/especialidad
router.post('/', especialidadController.crearEspecialidad);
router.get('/',especialidadController.obtenerEspecialidades);
router.get('/medico',especialidadController.obtenerEspecialidadesconMedicos);
router.put('/:id', especialidadController.actualizarEspecialidad);
router.get('/:id', especialidadController.obtenerEspecialidad);
router.delete('/:id', especialidadController.eliminarEspecialidad);

module.exports = router;