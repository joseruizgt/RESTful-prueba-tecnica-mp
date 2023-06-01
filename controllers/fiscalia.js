const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { Op } = require("sequelize");
const Fiscalia = require('../models/fiscalia');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

exports.obtenerFiscalias = async (req = request, res = response) => {
    let { busqueda, departamento, limite = 6, pagina = 1 } = req.query;

    const pageAsNumber = Number.parseInt(pagina);
    const limitNumber = Number.parseInt(limite);

    if (busqueda === undefined) {
        busqueda = '';
    } else {
        busqueda = busqueda.trim();
    }

    if (departamento === undefined) {
        departamento = '';
    } else {
        departamento = departamento.trim();
    }

    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }

    let size = 6;
    if (!Number.isNaN(limitNumber) && limitNumber > 0 && limitNumber < 7) {
        size = limitNumber;
    }

    try {
        const fiscalias = await Fiscalia.findAll({

            limit: size,
            offset: size * (page - 1),

            where: {
                nombre_fiscalia: {
                    [Op.like]: '%' + busqueda + '%'
                },

                departamento: {
                    [Op.like]: '%' + departamento + '%'
                }
            },
            attributes: ['id_fiscalia', 'nombre_fiscalia', 'direccion', 'telefono', 'url_imagen', 'departamento']

        });

        const count = await Fiscalia.count({
            where: {
                nombre_fiscalia: {
                    [Op.like]: '%' + busqueda + '%'
                },

                departamento: {
                    [Op.like]: '%' + departamento + '%'
                }
            },
        });

        res.json({
            fiscalias,
            cantidad: count,
            totalPaginas: Math.ceil(count / size)
        });

    } catch (error) {
        res.status(404).json({
            msg: 'error',
        });
    }
}

exports.crearFiscalia = async (req = request, res = response) => {
    const { nombre_fiscalia, descripcion, telefono, departamento, direccion } = req.body;

    if (req.files !== null) {
 
            const { tempFilePath } = req.files.archivos;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

            const nuevaFiscalia = new Fiscalia({
                nombre_fiscalia,
                descripcion,
                telefono,
                ubicacion: direccion,
                direccion,
                departamento,
                url_imagen: secure_url,
                id_usuario: req.usuario.id_usuario

            });

            await nuevaFiscalia.save();

            res.json({
                nuevaFiscalia
            })

        
    } else {
        return res.status(400).json({
            msg: 'Debe cargar una imagen al registro',
        })
    }
}

exports.editarFiscalia = async (req = request, res = response) => {
    const { id_fiscalia } = req.query;
    const { nombre_fiscalia, descripcion, telefono, departamento, direccion } = req.body;

    try {
        const fiscalia = await Fiscalia.findByPk(id_fiscalia);

        if (!fiscalia) {
            return res.status(400).json({
                msg: 'el registro de esta fiscalia no existe',
            });

        } else {
            if (req.files !== null) {
                const { tempFilePath } = req.files.archivos;
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

                await fiscalia.update({ nombre_fiscalia, descripcion, telefono, ubicacion: direccion, departamento, direccion, url_imagen: secure_url, id_usuario: req.usuario.id_usuario });

                res.json({
                    fiscalia,
                });
            } else {
                await fiscalia.update({ nombre_fiscalia, descripcion, telefono, ubicacion: direccion, departamento, direccion, id_usuario: req.usuario.id_usuario });

                res.json({
                    fiscalia,
                });
            }

        }
    } catch (error) {
        res.json({
            error,
        });
    }
}

exports.obtenerFiscaliaIndividual = async (req = request, res = response) => {
    const { id_fiscalia = null } = req.query;

    try {
        if (id_fiscalia !== null) {
            const fiscalia = await Fiscalia.findByPk(id_fiscalia);
            return res.json({
                fiscalia
            })
        } else {
            return res.status(400).json({
                msg: 'La fiscalia no existe'
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: 'algo salió mal'
        })
    }
}

exports.eliminarFiscalia = async (req = request, res = response) => {
    const { id_fiscalia = null } = req.query;

    try {
        if (id_fiscalia !== null) {

            await Fiscalia.destroy({
                where: {
                    id_fiscalia
                },
                force: true
            });

            res.json({
                msg: 'fiscalia eliminada'
            })

        } else {
            return res.status(400).json({
                msg: 'La Fiscalia no existe'
            });
        }

    } catch (error) {
        return res.status(500).json({
            msg: 'algo salió mal'
        })
    }
}