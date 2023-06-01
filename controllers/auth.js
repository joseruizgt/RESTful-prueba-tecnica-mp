const bcryptjs = require('bcryptjs');
const Usuario = require("../models/Usuario");
const { generarJWT } = require('../helpers');


exports.login = async (req = request, res = response) => {
    const { usuario, contrasenia } = req.body;

    try {

        //verificar si el usuario existe
        const usuario1 = await Usuario.findOne({ where: { usuario } });


        if (!usuario1) {
            return res.status(400).json({
                msg: 'el usuario que ingresó no se encuentra registrado',
            });
        }

        //verificar si el usuario1 esta activo
        if (usuario1.estado !== 1) {
            return res.status(400).json({
                msg: 'la cuenta se encuentra deshabilitada',
            });
        }

        //verificar la contrasenia
        const validarContrasenia = bcryptjs.compareSync(contrasenia, usuario1.contrasenia);

        if (!validarContrasenia) {
            res.status(400).json({
                msg: 'la constraseña es incorrecta',
            });
        }

        //generar JWT
        const token = await generarJWT(usuario1.id_usuario);

        res.json({
            token,
            rol: usuario1.rol,
            msg: 'inicio éxitoso'
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'algo salio mal',
            error
        })
    }
}
