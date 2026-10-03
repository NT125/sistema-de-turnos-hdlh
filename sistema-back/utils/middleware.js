const jwt = require('jsonwebtoken')
const checkToken=(req,res,next)=> {
    if(!req.headers['authorization']){
        return res.status(401).json({
            error:'Debes incluir la cabecera con el token'
        })
    }
    const token = req.headers['authorization'];
    let payload;
    try{
        payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.paciente_id;
        req.userRol = payload.paciente_rol;
    }catch(error){
        return res.status(401).json({error:'El token no es correcto'});
    }
    next();
}
module.exports={checkToken};