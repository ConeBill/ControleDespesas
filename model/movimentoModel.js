const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimentacaoFinanceira = sequelize.define('MovimentacaoFinanceira', {
    IdMovimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdOrigem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SetorOrigem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valorMovimentacao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dataPagamento: {
        type: DataTypes.DATE
    },
    dataMovimentacao: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipoMovimentacao: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = MovimentacaoFinanceira;
