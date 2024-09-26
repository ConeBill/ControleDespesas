const express = require('express');
const app = express();
const cors = require('cors');
const despesasRoutes = require('./routes/despesas');
const verifyToken = require('./middleware/authMiddleware');
require('dotenv').config();

const PORTA = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.ORIGIN
}));

app.use(express.json());
app.use('/despesas', verifyToken, despesasRoutes);
app.use('/', (req, res) => {
    res.json({"mgs": "Hello World"});
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
