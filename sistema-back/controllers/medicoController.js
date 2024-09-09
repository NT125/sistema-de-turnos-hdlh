const Medico = require('../models/Medico');
const Turno = require('../models/Turno');
const Especialidad = require('../models/Especialidad')
exports.crearMedico = async(req,res) => {
    try{
        
        let log = await Medico.find().where('legajo').equals(req.body.legajo)
        if(log[0]==null){
            try{
                let medico;
                //Creamos Medico
                medico = new Medico(req.body);
                await medico.save();
                res.send(medico);
        
            }catch(error){
                console.log(error);
                res.status(500).send('Hubo un error');
            }
        }
        else{
            res.json({
                'status': '2',
                'msg': 'Medico Existente, Con el mismo Legajo'
            })
        }
        

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }

    
}
exports.obtenerMedicos = async(req,res) => {
    try{
        const medicos = await Medico.find({}).populate('especialidades.especialidad_id');
        res.send(medicos);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.actualizarMedico = async(req,res) => {
    try{
        const medico = await Medico.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!medico){
            return res.status(404).json({msg: 'No existe el medico'});
        }

        res.json(medico);

    }catch(error){
        console.error('Error al obtener la especialidad:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}

exports.obtenerMedico = async(req,res) => {
    try{
        let medico =  await Medico.findById(req.params.id);
        if(!medico){
           return res.status(404).json({msg: 'No existe el medico'});
        }
        res.json(medico);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.eliminarMedico = async(req,res) => {
    try{
        let medico =  await Medico.findById(req.params.id);
        if(!medico){
            return res.status(404).json({msg: 'No existe el medico'});
        }
        await Medico.deleteOne({_id:req.params.id});
        res.json({msg: ' Medico eliminado'});

    }catch(error){
        console.error('Error al obtener el medico:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}
exports.obtenerMedicosporEspecialidad = async(req,res) =>{
    try {
        const especialidadId = req.params.especialidad_id;
        
        // Verificar si la especialidad existe
        let especialidad = await Especialidad.findById(especialidadId);
        
        if (!especialidad) {
            return res.status(404).json({ msg: 'No existe la especialidad' });
        }

        // Obtener médicos que tienen esta especialidad
        const medicos = await Medico.find({ especialidades: especialidadId })
            .populate('especialidades', 'nombre')  // Opcional: Poblar detalles de especialidades
            .exec();

        if (!medicos || medicos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron médicos para esta especialidad' });
        }

        res.json(medicos);
    } catch (error) {
        console.error('Error al obtener médicos por especialidad:', error.message);
        res.status(500).send('Hubo un error al obtener los médicos');
    }
}
exports.obtenerTurnosDelMedico = async (req, res) => {
    try {
        const medicoId = req.params.medicoId;

        // Verificar si el paciente existe (opcional, si quieres asegurarte de que el paciente exista)
        let medico = await Medico.findById(medicoId);
        if (!medico) {
             return res.status(404).json({ msg: 'No existe el paciente' });
        }

        // Obtener turnos del paciente
        let turnos = await Turno.find({ medico_id: medicoId })
            .populate('paciente_id', 'dni nombre') // Opcional: Poblar detalles del médico
            .populate('obras_sociales', 'nombreOS') // Opcional: Poblar detalles de las obras sociales
            .exec();

        if (!turnos || turnos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron turnos para este medico' });
        }

        res.json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos del medico:', error.message);
        res.status(500).send('Hubo un error al obtener los turnos');
    }
}
exports.obtenerTurnosDelMedicoDisp = async (req, res) => {
    try {
        const medicoId = req.params.medicoId;

        // Verificar si el medico existe (opcional, si quieres asegurarte de que el medico exista)
        let medico = await Medico.findById(medicoId);
        if (!medico) {
             return res.status(404).json({ msg: 'No existe el medico' });
        }

        // Obtener turnos del medico
        let turnos = await Turno.find({ medico_id: medicoId, estado:"Disponible" })
            .populate('paciente_id', 'dni nombre') // Opcional: Poblar detalles del médico
            .populate('obras_sociales', 'nombreOS') // Opcional: Poblar detalles de las obras sociales
            .exec();

        if (!turnos || turnos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron turnos disponibles' });
        }

        res.json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos del medico:', error.message);
        res.status(500).send('Hubo un error al obtener los turnos');
    }
}
exports.obtenerTurnosMedicoEsp= async (req,res) => {
    try {
        let medicoId=req.params.medicoId;
        let especialidadId=req.params.especialidadId;
        // Buscar los turnos que coincidan con el ID del médico y el ID de la especialidad
        let turnos = await Turno.find({medico_id: medicoId,especialidad_id: especialidadId}) 
        .populate('paciente_id', 'dni nombre') // Opcional: Poblar detalles del médico
        .populate('obras_sociales', 'nombreOS') // Opcional: Poblar detalles de las obras sociales
        .exec();

        if (turnos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron turnos para el médico con la especialidad especificada' });
        }

        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerTurnosMedicoEspDisponibles = async (req,res) => {
    try {
        let medicoId=req.params.medicoId;
        let especialidadId=req.params.especialidadId;
        // Buscar los turnos que coincidan con el ID del médico y el ID de la especialidad
        let turnos = await Turno.find({medico_id: medicoId,especialidad_id: especialidadId,estado:"Disponible"}) 
        .populate('paciente_id', 'dni nombre') // Opcional: Poblar detalles del médico
        .populate('obras_sociales', 'nombreOS') // Opcional: Poblar detalles de las obras sociales
        .exec();

        if (turnos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron turnos para el médico con la especialidad especificada' });
        }

        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};