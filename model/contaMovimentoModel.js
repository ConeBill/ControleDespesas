const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimentoConta = sequelize.define('MovimentoConta', {
    IdMC: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdConta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IdMovimento: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = MovimentoConta;