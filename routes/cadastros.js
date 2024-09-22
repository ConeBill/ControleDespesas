const express = require('express');
const router = express.Router();
const Usuario = require('../model/usuarioModel');

router.post('/novo', async (req, res) => {
    try {
        const novoUsuario = await Usuario.create(req.body);
        res.status(201).json({
            usuario: novoUsuario,
            msg: "Sucesso"
        });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar o usuario', detalhes: error });
    }
})

module.exports = router;