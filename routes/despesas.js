const express = require('express');
const router = express.Router();
const { lerDadosDoArquivo, escreverDadosNoArquivo } = require('../utils/fileHandler');
const Despesa = require('../model/despesaModel');

// Obter todas as despesas
router.get('/', (req, res) => {
    const despesas = lerDadosDoArquivo();
    res.json(despesas);
});

// Obtendo todas as despesas passivas de pagamento
router.get('/get', (req, res) => {
    const despesas = lerDadosDoArquivo();
    console.log(despesas);
    res.json(despesas);
})

// Adicionar uma nova despesa
router.post('/', (req, res) => {
    const novaDespesa = req.body;

    const erros = Despesa.validar(novaDespesa);
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const despesa = new Despesa(novaDespesa);
    const despesas = lerDadosDoArquivo();
    despesas.push(despesa);
    escreverDadosNoArquivo(despesas);

    res.status(201).json({
        despesa: despesa,
        msg: "Sucesso"
    });
 
});

// Atualizar uma despesa
router.put('/:nome', (req, res) => {
/*const { nome } = req.params;
const updates = req.body;

const despesas = lerDadosDoArquivo();
const despesaIndex = despesas.findIndex(d => d.nome === nome);

if (despesaIndex === -1) {
    return res.status(404).json({ error: 'Despesa não encontrada' });
}

const despesaAtualizada = { ...despesas[despesaIndex], ...updates };
despesas[despesaIndex] = despesaAtualizada;
escreverDadosNoArquivo(despesas);

res.json(despesaAtualizada);*/
res.json({mgs: "Atualizando"})
});

module.exports = router;
