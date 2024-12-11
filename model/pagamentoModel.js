const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pagamento = sequelize.define('Pagamento', {
    IdPagamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dataPagamento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING
    }
});

module.exports = Pagamento;