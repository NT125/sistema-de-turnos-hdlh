const mongoose = require('mongoose');

const ItemCobroSchema = new mongoose.Schema({
    item: { type: Number },
    medicamento: { type: String, required: true },
    cantidad: { type: Number, required: true, default: 1 },
    precioUnitario: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    porcentajeCobro: { type: Number, required: true },
    importeCobrar: { type: Number, required: true }
}, { _id: false });

const ComprobanteFarmaciaSchema = new mongoose.Schema({
    numeroComprobante: {
        type: String,
        unique: true,
        sparse: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    paciente: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    numeroCarnet: {
        type: String,
        default: ''
    },
    tipoCarnet: {
        type: String,
        required: true
    },
    porcentajeCobro: {
        type: Number,
        required: true
    },
    observaciones: {
        type: String,
        default: ''
    },
    items: [ItemCobroSchema],
    subtotalGeneral: {
        type: Number,
        required: true
    },
    totalACobrar: {
        type: Number,
        required: true
    },
    usuarioEmisor: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('ComprobanteFarmacia', ComprobanteFarmaciaSchema);
