const mongoose = require ('mongoose');
const Medico = require('./Medico');
const Paciente = require('./Paciente');
const Especialidad = require('./Especialidad');
const ObraSocial = require('./ObraSocial');

const {Schema} = mongoose;
const TurnoSchema = mongoose.Schema({
    medico_id:{type: Schema.Types.ObjectId, ref:'Medico'},
    paciente_id:{type: Schema.Types.ObjectId, ref:'Paciente'},
    fecha:{
        type: String,
        required:true
    },
    especialidad_id:{type: Schema.Types.ObjectId, ref:'Especialidad'},
    obras_sociales:[{type:Schema.Types.ObjectId, ref:'ObraSocial'}],
    estado:{
        type:String,
        enum:['Disponible','Ocupado','Cancelado'],
        default:'Disponible',
        require:true
    },
    consultorio:{
        type:String,
        require:true
    },
    duracion:{
        type:Number,
        require:true
    }
});

module.exports = mongoose.model('Turno',TurnoSchema);