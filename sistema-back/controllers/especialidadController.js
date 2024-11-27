const Especialidad = require('../models/Especialidad');
const Medico = require('../models/Medico');

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
        const especialidadesUsadas = await Medico.distinct('especialidades');

        // Buscar las especialidades cuyos IDs estén en el array especialidadesUsadas
        const especialidades = await Especialidad.find({
            _id: { $in: especialidadesUsadas }
        }).sort({ nombreEsp: 1 });;

        if (especialidades.length === 0) {
            return res.status(404).json({ msg: 'No hay especialidades con médicos cargados' });
        }

        res.json(especialidades);
    } catch (error) {
        console.error('Error al obtener especialidades:', error.message);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarEspecialidad = async(req,res) => {
    try{
        const{nombreEsp}= req.body;
        let especialidad =  await Especialidad.findById(req.params.id);
        if(!especialidad){
           return res.status(404).json({msg: 'No existe la especialidad'});
        }

        especialidad.nombreEsp = nombreEsp;
        especialidad = await Especialidad.findOneAndUpdate({_id:req.params.id},especialidad,{new:true})
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
        onsole.error('Error al obtener la especialidad:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}