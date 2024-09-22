const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guia = sequelize.define('Guia', {
    IdGuia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DtGeracao: {
        type: DataTypes.DATE,
        allowNull: false
    },
    IdOrigem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SetorOrigem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descr: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'guias',
    timestamps: true,  
    createdAt: 'DtGeracao',  
    updatedAt: false
});

module.exports = Guia;
