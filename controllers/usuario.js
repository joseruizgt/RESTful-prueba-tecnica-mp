const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { Op } = require("sequelize");
const Usuario = require('../models/Usuario');

exports.obtenerUsuarios = async (req = request, res = response) => {
    let { busqueda, limite = 5, pagina = 1 } = req.query;

    const pageAsNumber = Number.parseInt(pagina);
    const limitNumber = Number.parseInt(limite);

    if (busqueda === undefined) {
        busqueda = '';
    } else {
        busqueda = busqueda.trim();
    }

    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }

    let size = 5;
    if (!Number.isNaN(limitNumber) && limitNumber > 0 && limitNumber < 6) {
        size = limitNumber;
    }

    try {
        const usuarios = await Usuario.findAll({

            limit: size,
            offset: size * (page - 1),

            where: {
                usuario: {
                    [Op.like]: '%' + busqueda + '%'
                },
            },

            attributes: ['id_usuario', 'nombre', 'usuario', 'contrasenia', 'estado', 'rol']
        });

        const count = await Usuario.count({
            where: {
                usuario: {
                    [Op.like]: '%' + busqueda + '%'
                }
            }
        });

        res.json({
            usuarios,
            cantidad: count,
            totalPaginas: Math.ceil(count / size)
        });

    } catch (error) {
        res.status(404).json({
            msg: 'error',
        });
    }
}

exports.crearUsuario = async (req = request, res = response) => {
    const { nombre, usuario, contrasenia, estado, rol } = req.body;

    try {
        const nuevoUsuario = new Usuario({
            nombre,
            usuario,
            contrasenia,
            estado,
            rol,
        });

        //encriptar la contrasenia
        const salt = bcryptjs.genSaltSync();
        nuevoUsuario.contrasenia = bcryptjs.hashSync(contrasenia, salt);

        //guardar en bd
        await nuevoUsuario.save();

        res.json({
            nuevoUsuario,
        });

    } catch (error) {
        return res.status(400).json({
            msg: 'algo salió mal',
            error
        })
    }



}

exports.editarUsuario = async (req = request, res = response) => {
    const { id_usuario } = req.query;
    const { nombre, usuario, contrasenia ="", estado, rol } = req.body;

    try {
        const usuario1 = await Usuario.findByPk(id_usuario);

        if (usuario1) {
            if (contrasenia === "") {
                await usuario1.update({ nombre, usuario, estado, rol });
            } else {
                //encriptar nueva contraseña
                const salt = bcryptjs.genSaltSync();
                let contraseniaNueva = bcryptjs.hashSync(contrasenia, salt);

                await usuario1.update({ nombre, usuario, contrasenia: contraseniaNueva, estado, rol });
            }
            res.json({
                usuario1,
            });
        } else {
            res.status(400).json({
                msg: 'el usuario no existe',
            });
        }
    } catch (error) {
        res.json({
            error,
        });
    }
}