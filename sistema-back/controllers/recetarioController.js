const Medicamento = require('../models/Medicamento');
const ComprobanteFarmacia = require('../models/ComprobanteFarmacia');
const Paciente = require('../models/Paciente');
const path = require('path');
const fs = require('fs');

// Obtener medicamentos (si está vacía la BD, hace auto-seed con la lista inicial)
exports.obtenerMedicamentos = async (req, res) => {
    try {
        let medicamentos = await Medicamento.find({ activo: true }).sort({ item: 1 });
        
        if (!medicamentos || medicamentos.length === 0) {
            try {
                const seedPath = path.join(__dirname, '../data/medicamentos.json');
                if (fs.existsSync(seedPath)) {
                    const rawData = fs.readFileSync(seedPath, 'utf8');
                    const items = JSON.parse(rawData);
                    await Medicamento.insertMany(items);
                    medicamentos = await Medicamento.find({ activo: true }).sort({ item: 1 });
                }
            } catch (seedErr) {
                console.error('Error al hacer seed de medicamentos:', seedErr);
            }
        }

        res.json(medicamentos);
    } catch (error) {
        console.error('Error al obtener medicamentos:', error);
        res.status(500).json({ msg: 'Hubo un error al obtener medicamentos' });
    }
};

// Crear nuevo comprobante de cobro de medicación
exports.crearComprobante = async (req, res) => {
    try {
        const count = await ComprobanteFarmacia.countDocuments();
        const nextNum = (count + 1).toString().padStart(6, '0');
        const numeroComprobante = `REC-${nextNum}`;

        const nuevoComprobante = new ComprobanteFarmacia({
            ...req.body,
            numeroComprobante: req.body.numeroComprobante || numeroComprobante,
            usuarioEmisor: req.body.usuarioEmisor || (req.userRol ? `${req.userRol}` : 'Recetario')
        });

        await nuevoComprobante.save();
        res.status(201).json({
            status: '1',
            msg: 'Comprobante guardado exitosamente',
            comprobante: nuevoComprobante
        });
    } catch (error) {
        console.error('Error al crear comprobante:', error);
        res.status(500).json({ status: '0', msg: 'Hubo un error al guardar el comprobante', error: error.message });
    }
};

// Obtener historial de comprobantes
exports.obtenerComprobantes = async (req, res) => {
    try {
        const { busqueda, fecha } = req.query;
        let filtro = {};

        if (busqueda) {
            const regex = new RegExp(busqueda.trim(), 'i');
            filtro.$or = [
                { paciente: regex },
                { dni: regex },
                { numeroComprobante: regex },
                { numeroCarnet: regex }
            ];
        }

        if (fecha) {
            const start = new Date(fecha);
            start.setHours(0, 0, 0, 0);
            const end = new Date(fecha);
            end.setHours(23, 59, 59, 999);
            filtro.fecha = { $gte: start, $lte: end };
        }

        const comprobantes = await ComprobanteFarmacia.find(filtro)
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(comprobantes);
    } catch (error) {
        console.error('Error al obtener comprobantes:', error);
        res.status(500).json({ msg: 'Hubo un error al obtener comprobantes' });
    }
};

// Obtener un comprobante por ID
exports.obtenerComprobantePorId = async (req, res) => {
    try {
        const comprobante = await ComprobanteFarmacia.findById(req.params.id);
        if (!comprobante) {
            return res.status(404).json({ msg: 'Comprobante no encontrado' });
        }
        res.json(comprobante);
    } catch (error) {
        console.error('Error al obtener comprobante:', error);
        res.status(500).json({ msg: 'Hubo un error al obtener comprobante' });
    }
};

// Crear nuevo medicamento
exports.crearMedicamento = async (req, res) => {
    try {
        let { item, nombre, precio, precioTexto } = req.body;
        if (!nombre || precio === undefined) {
            return res.status(400).json({ msg: 'Nombre y precio son obligatorios' });
        }
        if (!item) {
            const maxItem = await Medicamento.findOne().sort({ item: -1 });
            item = maxItem ? (Number(maxItem.item) || 0) + 1 : 1;
        }
        const nuevo = new Medicamento({ item, nombre, precio, precioTexto, activo: true });
        await nuevo.save();
        res.status(201).json({ msg: 'Medicamento creado exitosamente', medicamento: nuevo });
    } catch (error) {
        console.error('Error al crear medicamento:', error);
        res.status(500).json({ msg: 'Error al crear medicamento' });
    }
};

// Obtener medicamento por ID
exports.obtenerMedicamentoPorId = async (req, res) => {
    try {
        const med = await Medicamento.findById(req.params.id);
        if (!med) return res.status(404).json({ msg: 'Medicamento no encontrado' });
        res.json(med);
    } catch (error) {
        console.error('Error al obtener medicamento:', error);
        res.status(500).json({ msg: 'Error al obtener medicamento' });
    }
};

// Actualizar precio y datos de medicamento
exports.actualizarMedicamento = async (req, res) => {
    try {
        const { precio, nombre, activo, item, precioTexto } = req.body;
        const updateData = {};
        if (precio !== undefined) updateData.precio = Number(precio);
        if (nombre !== undefined) updateData.nombre = nombre;
        if (activo !== undefined) updateData.activo = activo;
        if (item !== undefined) updateData.item = item;
        if (precioTexto !== undefined) updateData.precioTexto = precioTexto;

        const medicamento = await Medicamento.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!medicamento) {
            return res.status(404).json({ msg: 'Medicamento no encontrado' });
        }
        res.json({ msg: 'Medicamento actualizado con éxito', medicamento });
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        res.status(500).json({ msg: 'Error al actualizar medicamento' });
    }
};

// Eliminar medicamento
exports.eliminarMedicamento = async (req, res) => {
    try {
        const med = await Medicamento.findByIdAndDelete(req.params.id);
        if (!med) return res.status(404).json({ msg: 'Medicamento no encontrado' });
        res.json({ msg: 'Medicamento eliminado de la base de datos' });
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        res.status(500).json({ msg: 'Error al eliminar medicamento' });
    }
};

// Buscar paciente por DNI para autocompletar en recetario
exports.buscarPacientePorDni = async (req, res) => {
    try {
        const dniParam = req.params.dni?.toString().trim();
        if (!dniParam) {
            return res.status(400).json({ msg: 'Debe ingresar un DNI' });
        }
        const cleaned = dniParam.replace(/[\.\s-]/g, '');
        const dniNum = parseInt(cleaned, 10);
        let condiciones = [];
        if (!isNaN(dniNum)) {
            condiciones.push({ dni: dniNum });
            condiciones.push({ dni: cleaned });
        }
        condiciones.push({ dni: dniParam });
        condiciones.push({ nombre: { $regex: dniParam, $options: 'i' } });

        const paciente = await Paciente.findOne({ $or: condiciones });
        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente no encontrado con ese DNI' });
        }
        res.json(paciente);
    } catch (error) {
        console.error('Error al buscar paciente:', error);
        res.status(500).json({ msg: 'Error al buscar paciente' });
    }
};
