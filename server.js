const express = require('express');
const app = express();
const cors = require('cors');
const despesasRoutes = require('./routes/despesas');
const cadastrosRoutes = require('./routes/cadastros');
require('dotenv').config();
const sequelize = require('./config/database');
const Despesa = require('./model/guiaModel');

// Sincronize o banco de dados
sequelize.sync({ force: true }) // Usar com cuidado, pois recriará as tabelas e deletará os dados
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

const PORTA = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.ORIGIN
}));

app.use(express.json());
app.use('/cadastros', cadastrosRoutes)
app.use('/despesas', despesasRoutes);
app.use('/', (req, res) => {
    res.json({"mgs": "Hello World"});
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
