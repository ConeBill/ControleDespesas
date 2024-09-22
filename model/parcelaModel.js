const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parcela = sequelize.define('Parcela', {
    IdParcela: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdGuia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NroParcela: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    DtVencimento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Situacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    VlrTarifa: {
        type: DataTypes.DECIMAL(16,2),
        allowNull: false
    }
}, {
    tableName: 'parcelas',
    timestamps: false
});

module.exports = Parcela;