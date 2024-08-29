const fs = require('fs');
const path = require('path');

const caminhoArquivo = path.join(__dirname, '../data/despesas.txt');

// Função para ler os dados do arquivo
function lerDadosDoArquivo() {
    if (!fs.existsSync(caminhoArquivo)) {
        return [];
    }
    const dadosArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
    return dadosArquivo ? JSON.parse(dadosArquivo) : [];
}

// Função para escrever os dados no arquivo
function escreverDadosNoArquivo(dados) {
    fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2), 'utf-8');
}

module.exports = { lerDadosDoArquivo, escreverDadosNoArquivo };
