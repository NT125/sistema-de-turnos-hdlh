const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const moment = require('moment-timezone');
const emailService = require('../utils/email');

// Crear Turno
exports.crearTurno = async (req, res) => {
    try {
        let turno = new Turno(req.body);
        await turno.save();
        res.json({
            'status': '1',
            'msg': 'Turno creado.'
        })
    } catch (error) {
        res.json({
            'status': '0',
            'msg': 'Error.'
        })
    }
};

exports.obtenerTurno = async(req,res) => {
    try{
        let turno =  await Turno.findById(req.params.id).populate('medico_id paciente_id especialidad_id');
        if(!turno){
            res.status(404).json({msg: 'No existe el paciente'});
        }
        res.json(turno);

    }catch(error){
        console.error('Error al obtener la Espe:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}
// Obtener Todos los Turnos
exports.obtenerTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find({}).populate('medico_id paciente_id especialidad_id obras_sociales').sort({ fecha: 1 });
        res.send(turnos);
    } catch (error) {
        res.send(error);
    }
};

exports.obtenerTurnosHoy = async (req, res) => {
    try {
        const hoy = moment.tz("America/Argentina/Buenos_Aires").startOf('day'); 
        const mañana = hoy.clone().add(1, 'day'); 

        const turnos = await Turno.find({
            fecha: {
                $gte: hoy.toDate(), 
                $lt: mañana.toDate() 
            }
        })
        .populate('medico_id paciente_id obras_sociales especialidad_id')
        .sort({ fecha: 1 });

        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos de hoy", error });
    }
};

exports.obtenerTurnosPorFecha = async (req, res) => {
    try {
        const fechaParametro = moment.tz(req.params.fecha, "YYYY-MM-DD", "America/Argentina/Buenos_Aires").startOf('day');
        const siguienteDia = fechaParametro.clone().add(1, 'day'); 

        const turnos = await Turno.find({
            fecha: {
                $gte: fechaParametro.toDate(),
                $lt: siguienteDia.toDate()
            }
        })
        .populate('medico_id paciente_id obras_sociales especialidad_id')
        .sort({ fecha: 1 });

        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos de la fecha", error });
    }
};

/*exports.obtenerTurnosPorMedico = async (req, res) => {
    try {
        const searchTerm = req.params.termino; // Puede ser nombre o legajo (parcial)
        
        // Buscar los turnos donde el nombre o el legajo del médico coincidan parcialmente
        const turnos = await Turno.find({
            $or: [
                { 'medico_id.nombre': { $regex: searchTerm, $options: 'i' } }, // Nombre parcial (insensible a mayúsculas/minúsculas)
                { 'medico_id.legajo': { $regex: searchTerm, $options: 'i' } }  // Legajo parcial
            ]
        }).populate('medico_id paciente_id obras_sociales.obrasocial_id especialidad_id');
        console.log(turnos);
        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos por médico", error });
    }
};*/
exports.obtenerTurnosPorMedico = async (req, res) => {
    try {
        const searchTerm = req.params.termino; // Puede ser nombre o legajo (parcial)
        const isNumeric = !isNaN(searchTerm);
        // Usamos agregación para buscar por campos dentro de la referencia poblada
        const turnos = await Turno.aggregate([
            {
                $lookup: {
                    from: 'medicos', // Nombre de la colección de médicos
                    localField: 'medico_id',
                    foreignField: '_id',
                    as: 'medico'
                }
            },
            { $unwind: '$medico' }, // Descomponer array resultante de $lookup
            {
                $match: {
                    $or: isNumeric
                        ? [{ 'medico.legajo': parseInt(searchTerm)}]   // Legajo parcial
                   
                        :[{ 'medico.nombre': { $regex: searchTerm, $options: 'i' } }], // Nombre parcial insensible a mayúsculas/minúsculas
                    
                }
            },
            {
                $lookup: {
                    from: 'pacientes', // Nombre de la colección de pacientes
                    localField: 'paciente_id',
                    foreignField: '_id',
                    as: 'paciente_id'
                }
            },
            
            { $unwind: { path: '$paciente_id', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'especialidads', // Nombre de la colección de especialidades
                    localField: 'especialidad_id',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            { $unwind: '$especialidad' },
            {
                $lookup: {
                    from: 'obrasocials', // Nombre de la colección de obras sociales
                    localField: 'obras_sociales',
                    foreignField: '_id',
                    as: 'obras_sociales'
                }
            }
        ])
        .sort({ fecha: 1 });
        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos por médico", error });
    }
};
exports.obtenerTurnosPorPaciente = async (req, res) => {
    try {
        const searchTerm = req.params.termino; // Puede ser nombre o DNI (parcial)
        const isNumeric = !isNaN(searchTerm);
        // Usamos agregación para buscar por campos dentro de la referencia poblada
        const turnos = await Turno.aggregate([
            {
                $lookup: {
                    from: 'pacientes', // Nombre de la colección de pacientes
                    localField: 'paciente_id',
                    foreignField: '_id',
                    as: 'paciente_id'
                }
            },
            { $unwind: '$paciente_id'}, // Descomponer array resultante de $lookup
            {
                $match: {
                    $or: isNumeric
                        ?[{ 'paciente_id.dni':  parseInt(searchTerm) } ] // DNI parcial
                    
                        :[{ 'paciente_id.nombre': { $regex: searchTerm, $options: 'i' } }] // Nombre parcial insensible a mayúsculas/minúsculas
                        
                }
            },
            {
                $lookup: {
                    from: 'medicos', // Nombre de la colección de médicos
                    localField: 'medico_id',
                    foreignField: '_id',
                    as: 'medico'
                }
            },
            { $unwind: '$medico' }, // Descomponer array resultante de $lookup
            {
                $lookup: {
                    from: 'especialidads', // Nombre de la colección de especialidades
                    localField: 'especialidad_id',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            { $unwind: '$especialidad' }, // Descomponer array resultante de $lookup
            {
                $lookup: {
                    from: 'obrasocials', // Nombre de la colección de obras sociales
                    localField: 'obras_sociales',
                    foreignField: '_id',
                    as: 'obras_sociales'
                }
            }
        ]).sort({ fecha: 1 });

        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos por paciente", error });
    }
};
exports.obtenerTurnosPorObraSocial = async (req, res) => {
    try {
        const searchTerm = req.params.termino; // Nombre parcial de la obra social
        
        const turnos = await Turno.aggregate([
            {
                $lookup: {
                    from: 'obrasocials', // Nombre de la colección de obras sociales
                    localField: 'obras_sociales',
                    foreignField: '_id',
                    as: 'obras_sociales'
                }
            },
            {
                $match: {
                    'obras_sociales.nombreOS': { $regex: searchTerm, $options: 'i' } // Buscar en el array por nombre parcial (case insensitive)
                }
            },
            {
                $lookup: {
                    from: 'medicos',
                    localField: 'medico_id',
                    foreignField: '_id',
                    as: 'medico'
                }
            },
            { $unwind: '$medico' }, // Descomponer el resultado de medico
            {
                $lookup: {
                    from: 'pacientes',
                    localField: 'paciente_id',
                    foreignField: '_id',
                    as: 'paciente_id'
                }
            },
            { $unwind: { path: '$paciente_id', preserveNullAndEmptyArrays: true } }, // Preservar cuando no haya paciente
            {
                $lookup: {
                    from: 'especialidads',
                    localField: 'especialidad_id',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            { $unwind: '$especialidad' }, // Descomponer el resultado de especialidad
        ])
        .sort({ fecha: 1 });

        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos por obra social", error });
    }
};

exports.obtenerTurnosPorConsultorio = async (req, res) => {
   try {
            const searchTerm = req.params.termino; // Número o nombre del consultorio
            const turnos = await Turno.find({
                consultorio: { $regex: searchTerm, $options: 'i' } // Búsqueda parcial insensible a mayúsculas/minúsculas
            })
            .populate('medico_id paciente_id especialidad_id obras_sociales') // Poblamos las referencias a otras colecciones
            .sort({ fecha: 1 }); // Ordenamos los turnos por fecha
            
            res.send(turnos);
        } catch (error) {
            res.status(500).send({ message: "Error al obtener turnos por consultorio", error });
        }
    
    
};
exports.obtenerTurnosPorEspecialidad = async (req, res) => {
    try {
        const searchTerm = req.params.termino; // Nombre parcial de la especialidad
        const turnos = await Turno.aggregate([
            {
                $lookup: {
                    from: 'especialidads', // Nombre de la colección de especialidades
                    localField: 'especialidad_id',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            { $unwind: '$especialidad' }, // Descomponer array de especialidad
            {
                $match: {
                    'especialidad.nombreEsp': { $regex: searchTerm, $options: 'i' } // Buscar por nombre parcial insensible a mayúsculas/minúsculas
                }
            },
            {
                $lookup: {
                    from: 'medicos',
                    localField: 'medico_id',
                    foreignField: '_id',
                    as: 'medico'
                }
            },
            { $unwind: '$medico' },
            {
                $lookup: {
                    from: 'pacientes',
                    localField: 'paciente_id',
                    foreignField: '_id',
                    as: 'paciente_id'
                }
            },
            { $unwind: { path: '$paciente_id', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'obrasocials',
                    localField: 'obras_sociales',
                    foreignField: '_id',
                    as: 'obras_sociales'
                }
            }
        ])
        .sort({ fecha: 1 });

        res.send(turnos);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener turnos por especialidad", error });
    }
};


// Actualizar Turno
exports.actualizarTurno = async (req, res) => {
    try {

      /*  const pacienteId = req.body.paciente_id;
        const especialidadId = req.body.especialidad_id;

         const existeTurno = await Turno.findOne({
            paciente_id: pacienteId,
            especialidad_id: especialidadId,
            estado: 'Ocupado'
        });

        if (existeTurno) {
            return res.json({
                status: "3",
                msg: "El paciente ya tiene un turno en esta especialidad"
            });
        }*/
        //const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const turno = await Turno.findOneAndUpdate(
            { _id: req.params.id, estado: 'Disponible' }, // condición extra
            { ...req.body, estado: 'Ocupado' },           // fuerza el ocupado
            { new: true, runValidators: true }
        );
        if (!turno) {
            return res.json({
                'status': '1',
                'msg': 'El turno ya fue ocupado por otro paciente',
                
            }) 
        }

        // Enviar email de reserva
        try {
            const turnoPopulated = await Turno.findById(turno._id).populate('medico_id paciente_id especialidad_id');
            if (turnoPopulated) {
                let correoDestino = null;
                let nombreDestino = null;

                if (turnoPopulated.emailTerminal) {
                    correoDestino = turnoPopulated.emailTerminal;
                    nombreDestino = turnoPopulated.nombreTerminal || 'Paciente';
                } else if (turnoPopulated.paciente_id && turnoPopulated.paciente_id.email && turnoPopulated.paciente_id.email !== 'terminal@terminal.terminal') {
                    correoDestino = turnoPopulated.paciente_id.email;
                    nombreDestino = turnoPopulated.paciente_id.nombre;
                }

                if (correoDestino) {
                    emailService.reservaConfirmada(
                        correoDestino,
                        nombreDestino,
                        turnoPopulated.fecha,
                        turnoPopulated.medico_id.nombre,
                        turnoPopulated.consultorio,
                        turnoPopulated.especialidad_id.nombreEsp
                    );
                }
            }
        } catch (mailError) {
            console.error("Error enviando email al reservar turno:", mailError);
        }
        res.json({
            'status': '2',
            'msg': 'Turno creado con exito',
            
        }) 
    } catch (error) {
        console.log(error);
        res.json({
            'status': '0',
            'msg': 'ERROR! Por favor cargue sus datos correctamente',
            
        }) 
    }
};
exports.actualizarTurnoSecretaria = async (req, res) => {
    try {

        const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
       
        if (!turno) {
            return res.json({
                'status': '1',
                'msg': 'Error',
                
            }) 
        }

        if (req.body.estado === 'Ocupado') {
            try {
                const turnoPopulated = await Turno.findById(turno._id).populate('medico_id paciente_id especialidad_id');
                
                let correoDestino = null;
                let nombreDestino = null;
                
                if (turnoPopulated.emailTerminal) {
                    correoDestino = turnoPopulated.emailTerminal;
                    nombreDestino = turnoPopulated.nombreTerminal || 'Paciente';
                } else if (turnoPopulated.paciente_id && turnoPopulated.paciente_id.email) {
                    correoDestino = turnoPopulated.paciente_id.email;
                    nombreDestino = turnoPopulated.paciente_id.nombre;
                }

                if (correoDestino) {
                    emailService.reservaConfirmada(
                        correoDestino,
                        nombreDestino,
                        turnoPopulated.fecha,
                        turnoPopulated.medico_id.nombre,
                        turnoPopulated.consultorio,
                        turnoPopulated.especialidad_id.nombreEsp
                    );
                }
            } catch (mailError) {
                console.error("Error enviando email en secretaria:", mailError);
            }
        }
        res.json({
            'status': '2',
            'msg': 'Turno editado con exito',
            
        }) 
    } catch (error) {
        console.log(error);
        res.json({
            'status': '0',
            'msg': 'ERROR! Por favor cargue sus datos correctamente',
            
        }) 
    }
};
// Eliminar Turno
exports.eliminarTurno = async (req, res) => {
    try {
        const turno = await Turno.findByIdAndDelete(req.params.id);
        if (!turno) {
            return res.status(404).send();
        }
        res.status(200).send(turno);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Obtener Turnos de un Paciente
exports.getTurnosByPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const turnos = await Turno.find({ paciente_id }).populate('medico_id obra_social_id especialidad_id paciente_id');
        console.log(turnos);
        
        
        if (turnos.length === 0) {
            return res.status(404).send({ message: "No se encontraron turnos para este paciente." });
        }

        res.send(turnos);
    } catch (error) {
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerEstadisticas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        let filtroFecha = {};
        
        if (fechaInicio || fechaFin) {
            filtroFecha.fecha = {};
            if (fechaInicio) filtroFecha.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) {
                let endDate = new Date(fechaFin);
                endDate.setHours(23, 59, 59, 999);
                filtroFecha.fecha.$lte = endDate;
            }
        }

        const totalTurnos = await Turno.countDocuments(filtroFecha);
        const turnosOcupados = await Turno.countDocuments({ ...filtroFecha, estado: 'Ocupado' });
        const turnosDisponibles = await Turno.countDocuments({ ...filtroFecha, estado: 'Disponible' });
        const turnosCancelados = await Turno.countDocuments({ ...filtroFecha, estado: 'Cancelado' });
        const turnosFinalizados = await Turno.countDocuments({ ...filtroFecha, estado: 'Finalizado' });
        
        // Group by especialidad
        const turnosPorEspecialidad = await Turno.aggregate([
            { $match: filtroFecha },
            {
                $lookup: {
                    from: 'especialidads',
                    localField: 'especialidad_id',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            { $unwind: '$especialidad' },
            {
                $group: {
                    _id: '$especialidad.nombreEsp',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Group by medico
        const turnosPorMedico = await Turno.aggregate([
            { $match: filtroFecha },
            {
                $lookup: {
                    from: 'medicos',
                    localField: 'medico_id',
                    foreignField: '_id',
                    as: 'medico'
                }
            },
            { $unwind: '$medico' },
            {
                $group: {
                    _id: { nombre: '$medico.nombre', apellido: '$medico.apellido' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    medico: { $concat: ['$_id.nombre', ' ', '$_id.apellido'] },
                    count: 1
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Turnos sacados por terminal
        const turnosTerminal = await Turno.countDocuments({ ...filtroFecha, dniTerminal: { $exists: true, $ne: null } });

        // Pacientes con strikes
        const pacientesStrikes = await Paciente.find({ strikes: { $gt: 0 } })
            .select('nombre dni strikes')
            .sort({ strikes: -1 })
            .limit(10);

        res.json({
            totales: {
                total: totalTurnos,
                ocupados: turnosOcupados,
                disponibles: turnosDisponibles,
                cancelados: turnosCancelados,
                finalizados: turnosFinalizados,
                porTerminal: turnosTerminal
            },
            porEspecialidad: turnosPorEspecialidad,
            turnosPorMedico,
            pacientesStrikes
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).send('Hubo un error');
    }
};
