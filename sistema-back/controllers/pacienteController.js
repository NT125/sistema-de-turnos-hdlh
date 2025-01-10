const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Paciente = require('../models/Paciente');
const Turno = require('../models/Turno');
const wpp = require('../controllers/whatsappController');
require('dotenv').config();

exports.crearPaciente = async(req,res) => {
   try{     
    let log = await Paciente.find().where('dni').equals(req.body.dni)
        if(log[0]==null){
            try{

                let paciente;
                //Creamos Paciente
                paciente = new Paciente(req.body);
                await paciente.save();
                res.send(paciente);

            }catch(error){
                console.log(error);
                res.status(500).send('Hubo un error');
            }
        }else{
            res.json({
                'status': '2',
                'msg': 'Medico Dni, Con el mismo dni'
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerPacientes = async(req,res) => {
    try{
        const pacientes = await Paciente.find();
        res.send(pacientes);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerUsuarios = async(req,res) => {
    try{
        const usuarios = await Paciente.find({
            $or: [
                { rol: 'admin' },
                { rol: 'secretaria' }
            ]}
        );
        res.send(usuarios);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerSoloPacientes = async(req,res) => {
    try{
        const pacientes = await Paciente.find(
            { rol: 'paciente' }
            
        );
        res.send(pacientes);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerPacientesStrikes = async(req,res) => {
    try{
        const pacientes = await Paciente.find(
           { rol: 'paciente' ,
            strikes: { $gte: 3 } 
           }
        );
        res.send(pacientes);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.actualizarPaciente = async(req,res) => {
    try{
        if(req.body.passw !=undefined){
            console.log(req.body.passw)
            req.body.passw = bcrypt.hashSync(req.body.passw,12);
        }
        const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
       
        if(!paciente){
           return res.status(404).json({msg: 'No existe el paciente'});
        }
        res.json({
            'status': '1',
            'msg': 'Paciente actualizado.'
        })

    }catch(error){
        console.error('Error al obtener el paciente:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}

exports.obtenerPaciente = async(req,res) => {
    try{
        let paciente =  await Paciente.findById(req.params.id);
        if(!paciente){
            res.status(404).json({msg: 'No existe el paciente'});
        }
        res.json(paciente);

    }catch(error){
        console.error('Error al obtener la Espe:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}
exports.obtenerPacienteTermino = async (req, res) => {
    try {
        const searchTerm = req.params.termino?.trim(); // Limpiar espacios en blanco
        const isNumeric = !isNaN(searchTerm);
        let pacientes;

        if (!searchTerm) {
            
            pacientes = await Paciente.find({});
        } else {
            pacientes = await Paciente.find({
                $or: isNumeric 
                ?[{dni: parseInt(searchTerm)}]
                :[
                    { nombre: { $regex: searchTerm, $options: 'i' } }, // Coincidencia parcial en el nombre
                    { apellido: { $regex: searchTerm, $options: 'i' } } // Coincidencia parcial en el apellido
                ]
            })
        }

        
        if (searchTerm && (!pacientes || pacientes.length === 0)) {
            return res.status(404).json({ msg: 'No se encontraron pacientes que coincidan con la búsqueda' });
        }

        
        res.json(pacientes);

    } catch (error) {
        console.error('Error al obtener pacientes:', error.message);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerPacienteTerminoSec = async (req, res) => {
    try {
        const searchTerm = req.params.termino?.trim(); // Limpiar espacios en blanco
        const isNumeric = !isNaN(searchTerm);
        let pacientes;

        if (!searchTerm) {
            
            pacientes = await Paciente.find({});
        } else {
            pacientes = await Paciente.find({
                rol:'paciente',
                $or: isNumeric 
                ?[{dni:parseInt(searchTerm)}]
                :[
                    { nombre: { $regex: searchTerm, $options: 'i' } }, // Coincidencia parcial en el nombre
                    { apellido: { $regex: searchTerm, $options: 'i' } }
                ]
            })
        }

        
        if (searchTerm && (!pacientes || pacientes.length === 0)) {
            return res.status(404).json({ msg: 'No se encontraron pacientes que coincidan con la búsqueda' });
        }

        
        res.json(pacientes);

    } catch (error) {
        console.error('Error al obtener pacientes:', error.message);
        res.status(500).send('Hubo un error');
    }
}
exports.eliminarPaciente = async(req,res) => {
    try {
        const pacienteId = req.params.id;

        // Buscar el paciente a eliminar
        let paciente = await Paciente.findById(pacienteId);
        if (!paciente) {
            return res.status(404).json({ msg: 'No existe el paciente' });
        }

        // Actualizar los turnos relacionados a que estén disponibles
        await Turno.updateMany(
            { paciente_id: pacienteId },
            { $set: { estado: 'Disponible' } }
        );

        // Eliminar el paciente
        await Paciente.deleteOne({ _id: pacienteId });

        res.json({ msg: 'Paciente eliminado y turnos actualizados a Disponible' });

    } catch (error) {
        console.error('Error al eliminar el paciente:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}
exports.obtenerTurnosDelPaciente = async (req, res) => {
    try {
        const pacienteId = req.params.pacienteId;

        // Verificar si el paciente existe (opcional, si quieres asegurarte de que el paciente exista)
        const paciente = await Paciente.findById(pacienteId);
        if (!paciente) {
            return res.status(404).json({ msg: 'No existe el paciente' });
        }

        // Obtener fecha actual y ajustarla al inicio del día
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Obtener turnos del paciente con fecha igual o posterior a hoy
        const turnos = await Turno.find({
            paciente_id: pacienteId,
            estado: 'Ocupado', // Estado ocupado
            fecha: { $gte: hoy }, // Fecha igual o posterior a hoy
        })
            .populate('medico_id', 'nombre apellido') // Poblar detalles del médico
            .populate('obras_sociales', 'nombreOS') // Poblar detalles de las obras sociales
            .exec();

        if (!turnos || turnos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron turnos para este paciente' });
        }

        res.json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos del paciente:', error.message);
        res.status(500).send('Hubo un error al obtener los turnos');
    }
};

//LOGIN

exports.register = async(req,res) => {
    try{     
     let log = await Paciente.find().where('dni').equals(req.body.dni)
     let tel = await Paciente.find().where('telefono').equals(req.body.telefono)
         if(log[0]==null && tel[0]==null){
             try{
 
                 let paciente;
                 //Creamos Paciente
                 req.body.passw = bcrypt.hashSync(req.body.passw,12);
                 paciente = new Paciente(req.body);
                 await paciente.save();
                 //res.send(paciente);
                 res.json({
                    'status': '1',
                    'msg': 'Paciente guardado.'
                })
 
             }catch(error){
                 console.log(error);
                 res.json({
                    'status': '0',
                    'msg': 'Error procesando operacion.'
                })
             }
         }else{
            if(log[0]!=null){
                res.json({
                    'status': '2',
                    'msg': 'Paciente Dni, Con el mismo dni'
                })
            }
            else{
                res.json({
                    'status': '3',
                    'msg': 'Paciente Tel, Con el mismo telefono'
                })
            }
             
         }
     }catch(error){
         console.log(error);
         res.json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
     }
 }
 exports.login = async(req,res) => {
    try{
     
     const paciente = await Paciente.findOne({dni: req.body.dni});
     if(!paciente){
        return res.json({
            'status': '2',
            'msg': 'Error en el DNI o contraseña'
        }) 
     }
     else{
        const eq = bcrypt.compareSync(req.body.passw, paciente.passw);
      
        if(!eq){
            return res.json({
                'status': '3',
                'msg': 'Error en el DNI o contraseña',
                
            }) 
        }
        else{
            return res.json({
                'status': '1',
                'msg': 'Sesion Iniciada.',
                'token': createToken(paciente),
                'dni': paciente.dni,
                'telefono': paciente.telefono,
                'id': paciente._id,
                'rol':paciente.rol,
                'nombre':paciente.nombre,
                'strikes':paciente.strikes
            })
        }
     }
    }catch(error){
            console.log(error);
            return res.json({
               'status': '0',
               'msg': 'Error procesando operacion.'
           })
        }
}

const SECRET_KEY = process.env.JWT_SECRET;

exports.requestPasswordReset = async (req, res) => {
    const { dni, number } = req.body;
    const paciente = await Paciente.findOne({ dni });
  
    console.log("DNI: ", dni);
    console.log("Number: ", number);
    
    if (!paciente) {
      return res.status(404).json({
        'status': '404',
        'msg': 'DNI no encontrado'
      });
    }    
  
    if (paciente.telefono != number) {
      return res.status(400).json({
        'status': '400',
        'msg': 'El número es incorrecto'
      });
    }
  
    // Genera un token con el ID del usuario y una expiración de 1 hora
    const token = jwt.sign({ userId: paciente._id }, SECRET_KEY, { expiresIn: '1h' });
  
    // Guarda el token en la base de datos
    paciente.resetPasswordToken = token;
    paciente.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora
    await paciente.save();
  
    // Crea el enlace con el token
    const resetLink = `https://turnos-hdlh.onrender.com/reset-password?token=${token}`;
  
    console.log("link: ", resetLink);
    
    // Envía el enlace a través de WhatsApp
    console.log("Se esta por enviar el mensaje");
    
    wpp.sendUrlResetPassword(number, `${resetLink}`);
  
    res.status(200).json({
      'status': '200',
      'msg': 'Se envió un mensaje a su WhatsApp con el enlace para restablecer su contraseña'
    });
  };
  

exports.resetPassword = async(req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verifica el token nuevamente
        const decoded = jwt.verify(token, SECRET_KEY); 
        
        const paciente = await Paciente.findOne({
            _id: decoded.userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!paciente) {
            // return res.status(400).json('Invalid or expired token');
            return res.status(400).json({
                'status': '400',
                'msg': 'Invalido o token expirado'
            });
        }

        // Hashea la nueva contraseña y guárdala
        paciente.passw = await bcrypt.hash(newPassword, 10);
        paciente.resetPasswordToken = undefined; // Borra el token después de usarlo
        paciente.resetPasswordExpires = undefined;
        await paciente.save();

        // res.status(200).json('Password updated successfully');
        res.status(200).json({
            'status': '200',
            'msg': 'Contraseña actualizada con exito'
        });
    } catch (error) {
        // res.status(400).json('Invalid token');
        res.status(400).json({
            'status': '400',
            'msg': 'Token invalido'
        });
    }
}

exports.resetPasswordSinToken = async (req, res) => {
    const { cPassword, newPassword, idPac } = req.body;
    
    try {
        // Busca al paciente por su ID
        const paciente = await Paciente.findById(idPac);

        if (!paciente) {
            return res.status(404).json({
                'status': '404',
                'msg': 'Paciente no encontrado'
            });
        }

        // Compara la contraseña actual proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(cPassword, paciente.passw);

        if (!isMatch) {
            return res.status(400).json({
                'status': '400',
                'msg': 'La contraseña actual es incorrecta'
            });
        }

        // Si las contraseñas coinciden, hash de la nueva contraseña
        paciente.passw = await bcrypt.hash(newPassword, 10);

        // Guarda los cambios en la base de datos
        await paciente.save();

        res.status(200).json({
            'status': '200',
            'msg': 'Contraseña actualizada con éxito'
        });

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error.message);
        res.status(500).json({
            'status': '500',
            'msg': 'Hubo un error al intentar cambiar la contraseña'
        });
    }
};

function createToken(paciente){
    const payload={
        paciente_id:paciente._id,
        paciente_rol:paciente.rol
    }
    return jwt.sign(payload,'en un lugar de las Heras');
}