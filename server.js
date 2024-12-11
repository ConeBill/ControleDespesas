const express = require('express');
const app = express();
const cors = require('cors');
const despesasRoutes = require('./routes/despesas');
const contasRoutes = require('./routes/contas');
const movimentosRoutes = require('./routes/movimentos');
const sincRoutes = require('./routes/sinc');
const autMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();
const sequelize = require('./config/database');

const PORTA = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.ORIGIN
}));

app.use(express.json());
app.use('/despesas',  despesasRoutes);
app.use('/movimentos', movimentosRoutes);
app.use('/contas', contasRoutes);
app.use('/sinc', sincRoutes);
app.use('/', (req, res) => {
    res.json({"mgs": "Hello World"});
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
