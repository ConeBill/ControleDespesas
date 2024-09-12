class Despesa {
    constructor({ id, nome, valor, status, pago, numeroParcelas, diaVencimento, diaPagamento }) {
        this.id = id;
        this.nome = nome;
        this.valor = valor;
        this.status = status;
        this.pago = pago || 'N';
        this.numeroParcelas = numeroParcelas || 1;
        this.diaVencimento = diaVencimento || null;
        this.diaPagamento = diaPagamento || null;
    }

    static validar(dados) {
        const erros = [];

        if (!dados.nome || typeof dados.nome !== 'string' || dados.nome.trim() === '') {
            erros.push("O campo 'nome' é obrigatório e deve ser uma string não vazia.");
        }
        if (!dados.valor || isNaN(Number(dados.valor))) {
            erros.push("O campo 'valor' é obrigatório e deve ser um número.");
        }

        return erros;
    }
}

module.exports = Despesa;
