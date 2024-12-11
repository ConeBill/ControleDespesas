const Guia = require('./guiaModel');
const Parcela = require('./parcelaModel');
const ContaBancaria = require('./contaModel');
const Usuario = require('./usuarioModel');
const UsuarioConta = require('./usuarioContaModel')
const Receita = require('./receitaModel');
const Pagamento = require('./pagamentoModel');
const MovimentacaoFinanceira = require('./movimentoModel');
const MovimentoConta = require('./contaMovimentoModel');


Guia.hasMany(Parcela, {
    foreignKey: 'IdGuia',
    as: 'parcelas'
});

Parcela.belongsTo(Guia, {
    foreignKey: 'IdGuia',
    as: 'guia'
});

Usuario.belongsToMany(ContaBancaria, {
    through: UsuarioConta,
    foreignKey: 'IdOrigem'
});

ContaBancaria.belongsToMany(Usuario, { 
    through: UsuarioConta, 
    foreignKey: 'IdConta' 
});

Receita.belongsTo(ContaBancaria, { 
    foreignKey: 'IdConta' 
});

ContaBancaria.hasMany(Receita, { 
    foreignKey: 'IdConta' 
});

Pagamento.belongsTo(ContaBancaria, { 
    foreignKey: 'IdConta' 
});

ContaBancaria.hasMany(Pagamento, { 
    foreignKey: 'IdConta' 
});

// Relacionamento entre ContaBancaria e MovimentoConta
ContaBancaria.hasMany(MovimentoConta, {
    foreignKey: 'IdConta'
});
MovimentoConta.belongsTo(ContaBancaria, {
    foreignKey: 'IdConta'
});

// Relacionamento entre MovimentacaoFinanceira e MovimentoConta
MovimentacaoFinanceira.hasMany(MovimentoConta, {
    foreignKey: 'IdMovimento'
});
MovimentoConta.belongsTo(MovimentacaoFinanceira, {
    foreignKey: 'IdMovimento'
});

module.exports = {
    Guia,
    Parcela,
    Usuario,
    ContaBancaria,
    Receita,
    Pagamento,
    MovimentacaoFinanceira
};
