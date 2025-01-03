const express = require('express');
const router = express.Router();
const UsuarioConta = require('../model/usuarioContaModel');
const MovimentacaoFinanceira = require('../model/movimentoModel');
const Parcela = require('../model/parcelaModel');
const Guia = require('../model/guiaModel');

// Rota para adicionar uma receita
router.post('/add', async (req, res) => {
    const { IdConta, IdOrigem, valorReceita } = req.body;

    if (!IdConta || !IdOrigem || !valorReceita) {
        return res.status(400).json({ error: 'Todos os campos (IdConta, IdOrigem e valorReceita) são obrigatórios.' });
    }
    console.log(IdConta);
    console.log(IdOrigem);
    console.log(valorReceita);

    try {
        // Verifica se existe um saldo associado ao usuário e conta específicos
        const usuarioConta = await UsuarioConta.findOne({
            where: {
                IdConta,
                IdOrigem
            }
        });

        if (!usuarioConta) {
            return res.status(404).json({ error: 'Conta não encontrada para o usuário.' });
        }

        // Cria uma nova movimentação financeira de receita
        await MovimentacaoFinanceira.create({
            valorMovimentacao: valorReceita,
            dataMovimentacao: new Date(),
            tipoMovimentacao: 'receita',
            SetorOrigem: 'Usuarios',
            IdOrigem: IdOrigem,
            IdConta: IdConta,
            UsrIsert: IdOrigem
        });

        // Atualiza o saldo na conta do usuário
        usuarioConta.saldo = parseFloat(usuarioConta.saldo) + parseFloat(valorReceita);
        usuarioConta.saldo = parseFloat(usuarioConta.saldo.toFixed(2));
        await usuarioConta.save();

        return res.status(201).json({ message: 'Receita adicionada e saldo atualizado com sucesso.', saldo: usuarioConta.saldo });

    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        return res.status(500).json({ error: 'Erro ao adicionar a receita', detalhes: error });
    }
});

router.post('/pagamento', async (req, res) => {
    const IdConta = req.body.conta;
    const UsrIsert = req.body.idUser;
    const VlrPagamento = req.body.valorPago;
    const DtPagamento = req.body.dataPagamento;
    const IdOrigem = req.body.idParcela;

    if (!IdConta || !IdOrigem || !VlrPagamento) {
        return res.status(400).json({ error: 'Todos os campos (IdConta, IdOrigem e valorPagamento) são obrigatórios.' });
    }

    try {
        // Verifica se existe um saldo associado ao usuário e conta específicos
        const usuarioConta = await UsuarioConta.findOne({
            where: {
                IdConta,
                IdOrigem: UsrIsert
            }
        });

        if (!usuarioConta) {
            return res.status(404).json({ error: 'Conta não encontrada para o usuário.' });
        }
        
        // Cria uma nova movimentação financeira de pagamento
        await MovimentacaoFinanceira.create({
            valorMovimentacao: parseFloat(VlrPagamento),
            dataMovimentacao: new Date(),
            tipoMovimentacao: 'pagamento',
            dataPagamento: DtPagamento,
            IdConta: IdConta,
            SetorOrigem: 'Parcelas',
            IdOrigem: IdOrigem,
            UsrIsert: UsrIsert
        });

        // Atualiza o saldo na conta do usuário (subtraindo o valor do pagamento)
        usuarioConta.saldo = parseFloat(usuarioConta.saldo) - parseFloat(VlrPagamento);
        usuarioConta.saldo = parseFloat(usuarioConta.saldo.toFixed(2));
        await usuarioConta.save();

        return res.status(201).json({ message: 'Pagamento registrado e saldo atualizado com sucesso.', saldo: usuarioConta.saldo });

    } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        return res.status(500).json({ error: 'Erro ao registrar o pagamento', detalhes: error });
    }
});

// Rota para buscar o extrato de movimentações financeiras de um usuário
router.get('/extrato', async (req, res) => {
    const idUser = req.query.idUser;

    console.log(idUser);

    //try {
        const extrato = await MovimentacaoFinanceira.findAll({
            where: {
                UsrIsert: idUser
            },
            include: {
                model: Parcela,
                as: 'parcela',
                attributes: ['NroParcela', 'DtVencimento'],
                include: {
                    model: Guia,
                    as: 'guia',
                    attributes: ['Descr']
                }
            }
        });

        return res.status(200).json(extrato);

    //} catch (error) {
    //    console.error('Erro ao buscar extrato:', error);
    //    return res.status(500).json({ error: 'Erro ao buscar extrato', detalhes: error });
    //}
});

module.exports = router;