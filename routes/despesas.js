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
        if(NroParcela > 0) {
            try {
                let dataVencimento = new Date(DtVencimento);
                for (let i = 0; i < NroParcela; i++) {
                    const novaParcela = await Parcela.create({
                        IdGuia: novaGuia.IdGuia,
                        NroParcela: i + 1,
                        DtVencimento: new Date(dataVencimento.setMonth(dataVencimento.getMonth() + 1)),
                        Situacao: Situacao,
                        VlrTarifa: VlrTarifa
                    });
                }
                res.status(201).json({ msg: 'Sucesso ao criar as parcelas' });
            } catch (error) {
                console.log(error);
                res.status(400).json({ error: 'Erro ao criar parcelas'});
            }
            } else {
                try {
                    const novaParcela = await Parcela.create({
                        IdGuia: novaGuia.IdGuia,
                        NroParcela: NroParcela,
                        DtVencimento: DtVencimento,
                        Situacao: Situacao,
                        VlrTarifa: VlrTarifa
                    });
                    res.status(201).json({ msg: 'Sucesso ao criar parcela' });
                } catch (error) {
                    res.status(400).json({ error: 'Erro ao criar parcela', detalhes: error });
                }
            }
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar guia', detalhes: error });
    }
});

// Obter todas as despesas
router.get('/', async (req, res) => {
    try {
        const despesas = await Guia.findAll({
            include: [{
                model: Parcela,
                as: 'parcelas' // O alias deve corresponder ao nome dado na relação
            }]
        });

        if (despesas.length > 0) {
            res.status(200).json(despesas);
        } else {
            res.status(404).json({ msg: 'Nenhuma guia encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar guias e parcelas', detalhes: error });
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
