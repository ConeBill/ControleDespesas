const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsuarioConta = sequelize.define('UsuarioConta', {
    IdUsrConta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdConta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    saldo: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    IdOrigem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SetorOrigem: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = UsuarioConta;