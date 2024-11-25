const { type } = require('jquery');
const {mongoose, Schema} = require ('mongoose');
const PacienteSchema = mongoose.Schema({
    dni:{
        type: Number,
        required:true
    },
    nombre:{
        type: String,
        required:true
    },
    telefono:{
        type: String,
        required:true
    },
    passw:{
        type: String,
        required:true
    },
    strikes:{
        type: Number,
        required:false,
        default:0
    },
    email:{
        type: String,
        required:false,
        default:0
    },
    rol:{
        type: String,
        required:false,
        default: 'paciente'
    },
    resetPasswordToken:{
        type: String,
        require: false
    },
    resetPasswordExpires:{
        type: Date,
        require: false
    }
});

module.exports = mongoose.model('Paciente',PacienteSchema);