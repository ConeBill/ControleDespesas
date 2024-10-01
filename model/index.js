const Guia = require('./guiaModel');
const Parcela = require('./parcelaModel');

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
