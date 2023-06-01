const { request, response } = require("express");
const jwt = require('jsonwebtoken');
const Usuario = require("../models/Usuario");


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            msg: 'no existe un token en la peticion'
        });
    }

    //verificar si el token es autentico y si el usuario tiene un estado activo
    try {
        const { id_usuario } = jwt.verify(token, process.env.SECRET_KEY);

        //Busqueda del usuario en bd
        const usuario = await Usuario.findByPk(id_usuario);

        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario no existe'
            });
        }

        //verificar si el usuario tiene un estado activo
        if (usuario.estado !== 1) {
            return res.status(400).json({
                msg: 'El usuario se encuentra deshabilitado'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(600).json({
                msg: 'Token expiró'
            })
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                msg: 'Token no valido.'
            })
        } else if (error.name === "NotBeforeError") {
            return res.status(407).json({
                msg: 'Token no valido..'
            })
        } else {
            return res.status(500).json({
                msg: 'Error interno'
            })
        }
    }

}

module.exports = {
    validarJWT
}