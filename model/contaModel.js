const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContaBancaria = sequelize.define('ContaBancaria', {
    IdConta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeConta: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = ContaBancaria;