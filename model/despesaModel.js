class Despesa {
    constructor({ nome, valor, status, pago, numeroParcelas, diaVencimento }) {
        this.nome = nome;
        this.valor = valor;
        this.status = status || 'Em dia';
        this.pago = pago || 'N';
        this.numeroParcelas = numeroParcelas || '-';
        this.diaVencimento = diaVencimento || '-';
    }

    static validar(dados) {
        const erros = [];

        if (!dados.nome || typeof dados.nome !== 'string' || dados.nome.trim() === '') {
            erros.push("O campo 'nome' é obrigatório e deve ser uma string não vazia.");
        }
        if (!dados.valor || isNaN(Number(dados.valor))) {
            erros.push("O campo 'valor' é obrigatório e deve ser um número.");
        }
        if (!dados.status || (dados.status !== 'Em dia' && dados.status !== 'Atrasado')) {
            erros.push("O campo 'status' é obrigatório e deve ser 'Em dia' ou 'Atrasado'.");
        }
        if (!dados.pago || (dados.pago !== 'S' && dados.pago !== 'N')) {
            erros.push("O campo 'pago' é obrigatório e deve ser 'S' ou 'N'.");
        }
        if (!dados.numeroParcelas || typeof dados.numeroParcelas !== 'string') {
            erros.push("O campo 'numeroParcelas' deve ser uma string.");
        }
        if (!dados.diaVencimento || typeof dados.diaVencimento !== 'string') {
            erros.push("O campo 'diaVencimento' deve ser uma string.");
        }

        return erros;
    }
}

module.exports = Despesa;
