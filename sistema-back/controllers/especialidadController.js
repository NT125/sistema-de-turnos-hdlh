const Especialidad = require('../models/Especialidad');
const Medico = require('../models/Medico');
const Turno = require('../models/Turno');

exports.crearEspecialidad = async(req,res) => {
    try{
        let especialidad;
        //Creamos Especialidad
        especialidad = new Especialidad(req.body);
        await especialidad.save();
        res.send(especialidad);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerEspecialidades = async(req,res) => {
    try{
        const especialidades = await Especialidad.find().sort({ nombreEsp: 1 });;
        res.send(especialidades);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerEspecialidadesconMedicos = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Find all unique especialidades that have an active 'Disponible' Turno in the future
        const especialidadesConTurnos = await Turno.distinct('especialidad_id', {
            estado: 'Disponible',
            fecha: { $gt: hoy }
        });

        // Fetch those especialidades from DB, also ensuring they are active
        const especialidades = await Especialidad.find({
            _id: { $in: especialidadesConTurnos },
            activa: { $ne: false } // Only active specialties
        }).sort({ nombreEsp: 1 });

        if (especialidades.length === 0) {
            return res.json([]);
        }

        res.json(especialidades);
    } catch (error) {
        console.error('Error al obtener especialidades:', error.message);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarEspecialidad = async(req,res) => {
    try{
        const{nombreEsp, activa}= req.body;
        let especialidad =  await Especialidad.findById(req.params.id);
        if(!especialidad){
           return res.status(404).json({msg: 'No existe la especialidad'});
        }

        especialidad.nombreEsp = nombreEsp;
        if (activa !== undefined) {
            especialidad.activa = activa;
        }
        especialidad = await Especialidad.findOneAndUpdate({_id:req.params.id},especialidad,{new:true})
        res.json(especialidad);

    }catch(error){
        console.error('Error al obtener la especialidad:', error.message);

        if (error.name === 'CastError') {
            // Error de formato
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}

exports.obtenerEspecialidad = async(req,res) => {
    try{
        let especialidad =  await Especialidad.findById(req.params.id);
        if(!especialidad){
           return res.status(404).json({msg: 'No existe la especialidad'});
        }
        res.json(especialidad);

    }catch(error){
        console.error('Error al obtener la especialidad:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}
exports.eliminarEspecialidad = async(req,res) => {
    try{
        let especialidad =  await Especialidad.findById(req.params.id);
        if(!especialidad){
            return res.status(404).json({msg: 'No existe la especialidad'});
        }
        await Especialidad.deleteOne({_id:req.params.id});
        res.json({msg: ' Especialidad eliminado'});

    }catch(error){
        console.error('Error al obtener la especialidad:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}