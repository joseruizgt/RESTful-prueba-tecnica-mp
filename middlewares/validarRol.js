const { request, response } = require("express");

const validarRol = (...roles) => {
    return (req = request, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'se quiere verificar el rol sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'el servicio require un rol distinto al que posee'
            });
        }
        next();
    }
}

module.exports = {
    validarRol
}