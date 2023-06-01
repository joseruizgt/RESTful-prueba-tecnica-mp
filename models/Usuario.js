const { DataTypes } = require("sequelize");
const db = require("../database/connection");

const Usuario = db.define("t_usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allownull: false,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    contrasenia: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

    rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true
  }
  
);

module.exports = Usuario;