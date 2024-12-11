const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Receita = sequelize.define('Receita', {
    IdReceita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dataReceita: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING
    },
    IdConta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Receita;