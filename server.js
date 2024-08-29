const express = require('express');
const app = express();
const despesasRoutes = require('./routes/despesas');

const PORTA = 3001;

app.use(express.json());
app.use('/despesas', despesasRoutes);

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
