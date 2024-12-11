const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const { Guia, Parcela } = require('../model/index');
const sequelize = require('../config/database');

// Obter todas as despesas do usuário
router.get('/', async (req, res) => {
    try {
        const { idUser } = req.query;
        if (!idUser ) {
            return res.status(400).json({ error: 'IdUsuario é obrigatório' });
        }

        const guias = await sequelize.query(
            `SELECT * 
             FROM guias G 
             JOIN parcelas P ON P.IdGuia = G.IdGuia 
             WHERE G.IdOrigem = :idUser
             AND G.SetorOrigem = 'Usuarios'
             ORDER BY G.IdGuia DESC`,
            {
                replacements: { 
                    idUser: idUser
                },
                type: QueryTypes.SELECT,
            }
        );
        res.status(201).json(guias);
    } catch (error) {
        console.log('Erro ao buscar guias:', error);
        res.status(500).json({ error: 'Erro ao buscar guias' });
    }
});

//Pegando as despesas aptas a pagamentos
router.get('/pagar', async (req, res) => {
    try {
        const { idUser, currentDate } = req.query;
        if (!idUser || !currentDate) {
            return res.status(400).json({ error: 'IdUsuario e currentDate são obrigatórios' });
        }

        const guias = await sequelize.query(
            `SELECT * 
             FROM guias G 
             JOIN parcelas P ON P.IdGuia = G.IdGuia 
             WHERE G.IdOrigem = :idUser
             AND G.SetorOrigem = 'Usuarios'
             AND MONTH(P.DtVencimento) = MONTH(:currentDate) 
             AND YEAR(P.DtVencimento) = YEAR(:currentDate) 
             AND P.DtVencimento > :currentDate
             ORDER BY G.IdGuia DESC`,
            {
                replacements: { 
                    idUser: idUser, 
                    currentDate: currentDate 
                },
                type: QueryTypes.SELECT,
            }
        );
        res.status(200).json(guias);
    } catch (error) {
        console.log('Erro ao buscar guias:', error);
        res.status(500).json({ error: 'Erro ao buscar guias' });
    }
});


// Adicionar uma nova guia
router.post('/', async (req, res) => {
    //Guia
    const Nome = req.body.Descr;
    const IdOrigem = req.body.IdOrigem;
    const SetorOrigem = req.body.SetorOrigem;
    //Parcelas
    const NroParcela = req.body.NroParcela;
    const DtVencimento = req.body.DtVencimento;
    const Situacao = req.body.Situacao;
    const VlrTarifa = req.body.VlrTarifa;

    //Juros caso tenha
    const VlrJuros = req.body.VlrJuros;

    try {
        const novaGuia = await Guia.create({
            IdOrigem: IdOrigem,
            SetorOrigem: SetorOrigem,
            Descr: Nome
        });

        if (NroParcela > 1) {
            let parcelas = [];
            let valorParcela = VlrTarifa / NroParcela;

            for (let i = 1; i < NroParcela; i++) {
                let valorComJuros = valorParcela + (valorParcela * (VlrJuros / 100) * i);
                parcelas.push({
                    IdGuia: novaGuia.IdGuia,
                    NroParcela: i + 1,
                    DtVencimento: new Date(DtVencimento).setMonth(new Date(DtVencimento).getMonth() + i),
                    Situacao: Situacao,
                    VlrTarifa: valorComJuros
                });
            }
            await Parcela.bulkCreate(parcelas);
        } else {
            await Parcela.create({
                GuiaId: novaGuia.id,
                NroParcela: 1,
                DtVencimento: DtVencimento,
                Situacao: Situacao,
                VlrTarifa: VlrTarifa
            });
        }
        return res.status(201).json({ message: 'Guia e parcelas criadas com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar guia ou parcelas', detalhes: error });
    }
});

module.exports = router;
