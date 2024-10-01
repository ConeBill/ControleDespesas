const express = require('express');
const router = express.Router();
const { Guia, Parcela } = require('../model/index');

// Obter todas as despesas
router.get('/', async (req, res) => {
    try {
        const guias = await Guia.findAll({
            include: {
                model: Parcela,
                as: 'parcelas'
            }
        });
        res.json(guias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar guias', detalhes: error });
    }
});

// Adicionar uma nova guia
router.post('/', async (req, res) => {
    //Guia
    const Nome = req.body.Descr;
    const IdOrigem = req.body.IdOrigem;
    const SetorOrigem = req.body.SetorOrigem;
    //Parcelas
    const NroParcela = req.body.NroParcela;
    const DtVencimento = req.body.DtVencimento;
    const Situacao = req.body.Situacao;
    const VlrTarifa = req.body.VlrTarifa;

    try {
        const novaGuia = await Guia.create({
            IdOrigem: IdOrigem,
            SetorOrigem: SetorOrigem,
            Descr: Nome
        });

        if (NroParcela > 0) {
            const parcelas = [];

            for (let i = 1; i <= NroParcela; i++) {
                const novaParcela = {
                    IdGuia: novaGuia.IdGuia,
                    NroParcela: i,
                    DtVencimento: new Date(new Date(DtVencimento).setMonth(new Date(DtVencimento).getMonth() + (i - 1))),
                    Situacao: Situacao,
                    VlrTarifa: VlrTarifa
                };
                parcelas.push(novaParcela);
            }

            await Parcela.bulkCreate(parcelas);

            res.status(201).json({ msg: 'Guia e parcelas criadas com sucesso!' });
        } else {
            res.status(400).json({ error: 'O número de parcelas deve ser maior que 0' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar guia ou parcelas', detalhes: error });
    }
});

/*
// Obtendo todas as despesas passivas de pagamento
router.get('/get', (req, res) => {
    const despesas = lerDadosDoArquivo();
    const resultadoBusca = buscarPorCampo(despesas, 'pago', 'N');
    res.json(resultadoBusca);
})

// Obtendo todas as despesas por data
router.get('/getForDate', (req, res) => {
    const despesas = lerDadosDoArquivo();
    const dataReferencia = req.body.dataSelecionada;
    const despesasOrder = ordenarPorDataMaisProxima(despesas, dataReferencia);
    res.json(despesasOrder);
})

// Atualizar uma despesa
router.put('/:nome', (req, res) => {
const { nome } = req.params;
const updates = req.body;

const despesas = lerDadosDoArquivo();
const despesaIndex = despesas.findIndex(d => d.nome === nome);

if (despesaIndex === -1) {
    return res.status(404).json({ error: 'Despesa não encontrada' });
}

const despesaAtualizada = { ...despesas[despesaIndex], ...updates };
despesas[despesaIndex] = despesaAtualizada;
escreverDadosNoArquivo(despesas);

res.json(despesaAtualizada);
});*/

module.exports = router;
