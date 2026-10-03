const ObraSocial = require('../models/ObraSocial');
exports.crearObra = async(req,res) => {
    try{
        let obra;
        //Creamos Obra Social
        obra = new ObraSocial(req.body);
        await obra.save();
        res.send(obra);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.obtenerObras = async(req,res) => {
    try{
        const obras = await ObraSocial.find();
        res.send(obras);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
exports.actualizarObra = async(req,res) => {
    try{
        const obra = await ObraSocial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

         if(!obra){
            return res.status(404).json({msg: 'No existe la obra social'});
        }

        res.json(obra);

    }catch(error){
        console.error('Error al obtener la obra:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}

exports.obtenerObra = async(req,res) => {
    try{
        let obra =  await ObraSocial.findById(req.params.id);
        if(!obra){
            return res.status(404).json({msg: 'No existe la obra social'});
        }
        res.json(obra);

    }catch(error){
        console.error('Error al obtener la Obra:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}
exports.eliminarObra = async(req,res) => {
    try{
        let obra =  await ObraSocial.findById(req.params.id);
        if(!obra){
           return res.status(404).json({msg: 'No existe la obra social'});
        }
        await ObraSocial.deleteOne({_id:req.params.id});
        res.json({msg: ' Obra eliminado'});

    }catch(error){
        console.error('Error al obtener la Obra:', error.message);

        if (error.name === 'CastError') {
            // Error de formato de ObjectId
            return res.status(400).json({ msg: 'Formato de ID no válido' });
        }

        res.status(500).send('Hubo un error');
    }
}