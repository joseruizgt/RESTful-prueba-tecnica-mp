const { validarRol, validarJWT } = require('../middlewares');
const { Router } = require('express');
const router = Router();

//Importacion de los controladores
const authController = require('../controllers/auth');
const usuarioController = require('../controllers/usuario');
const fiscaliaController = require('../controllers/fiscalia');

module.exports = () => {

    //Auth
    router.post('/auth/login', authController.login);

    //usuario
    router.get('/usuario', validarJWT, validarRol(1), usuarioController.obtenerUsuarios);
    router.post('/usuario/crear', validarJWT, validarRol(1), usuarioController.crearUsuario);
    router.put('/usuario/editar', validarJWT, validarRol(1), usuarioController.editarUsuario);

    //fiscalia
    router.get('/fiscalia', validarJWT, validarRol(1), fiscaliaController.obtenerFiscalias);
    router.post('/fiscalia/crear', validarJWT, validarRol(1), fiscaliaController.crearFiscalia);
    router.get('/fiscalia/individual', validarJWT, validarRol(1), fiscaliaController.obtenerFiscaliaIndividual);
    router.delete('/fiscalia/eliminar', validarJWT, validarRol(1), fiscaliaController.eliminarFiscalia);
    router.put('/fiscalia/editar', validarJWT, validarRol(1), fiscaliaController.editarFiscalia);

    return router;
}