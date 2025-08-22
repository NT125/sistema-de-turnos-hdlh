const mongoose = require ('mongoose');
const Medico = require('./Medico');
const Paciente = require('./Paciente');
const Especialidad = require('./Especialidad');
const ObraSocial = require('./ObraSocial');

const {Schema} = mongoose;
const TurnoSchema = mongoose.Schema({
    medico_id:{type: Schema.Types.ObjectId, ref:'Medico'},
    paciente_id:{type: Schema.Types.ObjectId, ref:'Paciente'},
    dniTerminal:{type:Number},
    nombreTerminal:{type:String},
    fecha:{
        type: Date,
        required:true
    },
    especialidad_id:{type: Schema.Types.ObjectId, ref:'Especialidad'},
    obras_sociales:[{type:Schema.Types.ObjectId, ref:'ObraSocial'}],
    estado:{
        type:String,
        enum:['Disponible','Ocupado','Cancelado','Finalizado'],
        default:'Disponible',
        required:true
    },
    consultorio:{
        type:String,
        required:true
    },
    duracion:{
        type:Number,
        required:true
    },
    observacion:{
        type:String
    }
});

module.exports = mongoose.model('Turno',TurnoSchema);