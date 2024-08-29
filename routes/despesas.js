const express = require('express');
const router = express.Router();
const { lerDadosDoArquivo, escreverDadosNoArquivo } = require('../utils/fileHandler');
const Despesa = require('../models/despesaModel');

// Endpoint para obter todas as despesas
router.get('/', (req, res) => {
    const despesas = lerDadosDoArquivo();
    res.json(despesas);
});

// Endpoint para adicionar uma nova despesa
router.post('/', (req, res) => {
    const novaDespesa = req.body;

    // Validar os campos da nova despesa
    const erros = Despesa.validar(novaDespesa);
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    // Criar instância da nova despesa e salvar
    const despesa = new Despesa(novaDespesa);
    const despesas = lerDadosDoArquivo();
    despesas.push(despesa);
    escreverDadosNoArquivo(despesas);

    res.status(201).json(despesa);
});

module.exports = router;
