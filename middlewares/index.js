const validarRol = require('./validarRol');
const validarJWT = require('./validarJWT');


module.exports={
  ...validarRol,
  ...validarJWT
}