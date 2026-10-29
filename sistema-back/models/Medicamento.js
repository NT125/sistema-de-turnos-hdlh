const mongoose = require('mongoose');

const MedicamentoSchema = new mongoose.Schema({
    item: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true
    },
    precioTexto: {
        type: String
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Medicamento', MedicamentoSchema);
