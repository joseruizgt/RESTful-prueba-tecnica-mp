const { DataTypes } = require("sequelize");
const db = require("../database/connection");

const Fiscalia = db.define("t_fiscalia",
  {
    id_fiscalia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allownull: false,
    },

    nombre_fiscalia: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    url_imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true
  },
);

module.exports = Fiscalia;