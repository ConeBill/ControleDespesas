const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    IdUsr: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Usr: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NomeUsr: {
        type: DataTypes.STRING
    },
    SenhaUsr: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;