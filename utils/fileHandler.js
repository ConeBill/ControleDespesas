const fs = require('fs');
const path = require('path');
const { differenceInDays, parseISO } = require('date-fns');

const caminhoArquivo = path.join(__dirname, '../data/despesas.txt');

// Função para ler os dados do arquivo
function lerDadosDoArquivo() {
    if (!fs.existsSync(caminhoArquivo)) {
        return [];
    }
    const dadosArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
    return dadosArquivo ? JSON.parse(dadosArquivo) : [];
}

function buscarPorCampo(despesas, campo, valor) {
    return despesas.filter(despesa => despesa[campo] === valor);
}

// Função para ordenar pela data de vencimento mais próxima, com data de referência fornecida
const ordenarPorDataMaisProxima = (despesas, dataReferencia) => {
    const dtReferencia = parseISO(dataReferencia); // Converte a data de referência para formato ISO

    return despesas.sort((a, b) => {
        const dataA = parseISO(a.diaVencimento);
        const dataB = parseISO(b.diaVencimento);

        // Calcula a diferença em dias para cada data em relação à data de referência
        const diffA = Math.abs(differenceInDays(dataA, dtReferencia));
        const diffB = Math.abs(differenceInDays(dataB, dtReferencia));

        // Compara as diferenças para ordenar pela proximidade à data de referência
        return diffA - diffB;
    });
};

// Função para escrever os dados no arquivo
function escreverDadosNoArquivo(dados) {
    fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2), 'utf-8');
}

module.exports = { lerDadosDoArquivo, escreverDadosNoArquivo, buscarPorCampo, ordenarPorDataMaisProxima };
