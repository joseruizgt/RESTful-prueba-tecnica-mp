const Usuario = require("./Usuario");
const Fiscalia = require("./fiscalia");

module.exports = () => {
    try {

        //llave foranea fiscalia - usuario
        Fiscalia.belongsTo(Usuario, { foreignKey: 'id_usuario' });
        Usuario.hasMany(Fiscalia, { foreignKey: 'id_usuario' });

    } catch (error) {
        console.log(error)
    }
}

