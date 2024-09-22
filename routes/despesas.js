const express = require('express');
const router = express.Router();
const Guia = require('../model/guiaModel');
const Parcela = require('../model/parcelaModel');

// Adicionar uma nova guia
router.post('/', async (req, res) => {
    //Guia
    const Nome = req.body.Descr;
    const IdOrigem = req.body.IdOrigem;
    const SetorOrigem = req.body.SetorOrigem;
    //Parcela
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
        try {
            const novaParcela = await Parcela.create({
                IdGuia: novaGuia.IdGuia,
                NroParcela: NroParcela,
                DtVencimento: DtVencimento,
                Situacao: Situacao,
                VlrTarifa: VlrTarifa
            });
            res.status(201).json({ msg: 'Sucesso ao criar guia' });
        } catch (error) {
            res.status(400).json({ error: 'Erro ao criar parcelas', detalhes: error });
        }
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar guia', detalhes: error });
    }
});

// Obter todas as despesas
router.get('/', (req, res) => {
    const despesas = lerDadosDoArquivo();
    if(despesas)
        res.json(despesas);
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
