const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/', async (req, res) => {

await sequelize.sync({ alter: true })
    .then(() => {
        console.log('Tabelas sincronizadas com sucesso.');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar tabelas:', error);
    });

    res.status(201).json({ msg: 'Sincronizado' });
});

module.exports = router;