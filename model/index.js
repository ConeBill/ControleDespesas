const Guia = require('./guiaModel');
const Parcela = require('./parcelaModel');

// Defina as associações aqui
Guia.hasMany(Parcela, {
    foreignKey: 'IdGuia',
    as: 'parcelas'
});

Parcela.belongsTo(Guia, {
    foreignKey: 'IdGuia',
    as: 'guia'
});

module.exports = {
    Guia,
    Parcela
};
