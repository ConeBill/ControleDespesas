const Guia = require('../model/guiaModel');
const Parcela = require('../model/parcelaModel');

Guia.hasMany(Parcela, { foreignKey: 'IdGuia' });
Parcela.belongsTo(Guia, { foreignKey: 'IdGuia' });

module.exports = { Guia, Parcela };