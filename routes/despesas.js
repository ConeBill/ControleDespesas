const express = require('express');
const router = express.Router();
const { QueryTypes, INTEGER } = require('sequelize');
const { Guia, Parcela } = require('../model/index');
const sequelize = require('../config/database');

// Obter todas as despesas do usuário
router.get('/', async (req, res) => {
    try {
        const { idUser } = req.query;
        if (!idUser) {
            return res.status(400).json({ error: 'IdUsuario é obrigatório' });
        }

        // Consulta para obter as guias
        const guias = await sequelize.query(
            `SELECT G.IdGuia, G.IdOrigem, G.SetorOrigem, G.Descr, SUM(ABS(P.VlrTarifa)) AS VlrTotal
             FROM guias G 
             JOIN parcelas P ON P.IdGuia = G.IdGuia 
             WHERE G.IdOrigem = :idUser
             AND G.SetorOrigem = 'Usuarios'
             GROUP BY IdGuia, IdOrigem, SetorOrigem, Descr
             ORDER BY G.IdGuia DESC`,
            {
                replacements: { idUser: idUser },
                type: QueryTypes.SELECT,
            }
        );

        // Consulta para obter as parcelas
        const parcelas = await sequelize.query(
            `SELECT P.IdGuia, P.IdParcela, P.NroParcela, P.DtVencimento, P.Situacao, P.VlrTarifa
             FROM parcelas P
             WHERE P.IdGuia IN (:idGuias)
             ORDER BY P.IdGuia, P.NroParcela`,
            {
                replacements: { idGuias: guias.map(guia => guia.IdGuia) },
                type: QueryTypes.SELECT,
            }
        );

        // Agrupar as parcelas por guia
        const guiasComParcelas = guias.map(guia => {
            return {
                ...guia,
                parcelas: parcelas.filter(parcela => parcela.IdGuia === guia.IdGuia)
            };
        });

        res.status(200).json(guiasComParcelas);
    } catch (error) {
        console.log('Erro ao buscar guias ou parcelas:', error);
        res.status(500).json({ error: 'Erro ao buscar guias ou parcelas' });
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
    const Nome = req.body.Descr;
    const IdOrigem = req.body.IdOrigem;
    const SetorOrigem = req.body.SetorOrigem;
    const NroParcela = req.body.NroParcela;
    const DtVencimento = req.body.DtVencimento;
    const Situacao = req.body.Situacao;
    const VlrTarifa = parseFloat(req.body.VlrTarifa);
    const VlrJuros = parseFloat(req.body.VlrJuros);

    // Verificar se VlrTarifa e VlrJuros são números válidos
    if (isNaN(VlrTarifa)) {
        return res.status(400).json({ error: 'VlrTarifa inválido' });
    }

    let novaGuia;
    try {
        // Criar a guia
        novaGuia = await Guia.create({
            IdOrigem: IdOrigem,
            SetorOrigem: SetorOrigem,
            Descr: Nome
        });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao criar a guia', detalhes: error });
    }

    try {
        console.log('Entrou no try');
        // Verificar e criar parcelas
        if (NroParcela === 0) {
            console.log('IdGuia', novaGuia.IdGuia);
            await Parcela.create({
                IdGuia: novaGuia.IdGuia,
                NroParcela: 0,
                DtVencimento: DtVencimento,
                Situacao: Situacao,
                VlrTarifa: VlrTarifa
            });
        } else {
            let parcelas = [];
            let valorParcela = VlrTarifa / NroParcela;



            for (let i = 0; i < NroParcela + 1; i++) {
                if (i === 0) {
                    parcelas.push({
                        IdGuia: novaGuia.IdGuia,
                        NroParcela: 0,
                        DtVencimento: new Date(DtVencimento).setMonth(new Date(DtVencimento).getMonth() + i),
                        Situacao: Situacao,
                        VlrTarifa: VlrTarifa
                    });
                } else {
                    let valorComJuros = valorParcela + (valorParcela * (VlrJuros / 100) * NroParcela);
                    parcelas.push({
                        IdGuia: novaGuia.IdGuia,
                        NroParcela: i,
                        DtVencimento: new Date(DtVencimento).setMonth(new Date(DtVencimento).getMonth() + i),
                        Situacao: Situacao,
                        VlrTarifa: valorComJuros
                    });
                }
            }

            await Parcela.bulkCreate(parcelas);
        }

        return res.status(201).json({ message: 'Guia e parcelas criadas com sucesso.' });
    } catch (error) {
        // Se ocorrer um erro ao criar parcelas, deletar a guia
        if (novaGuia) {
            await Guia.destroy({ where: { IdGuia: novaGuia.IdGuia } });
        }

        return res.status(400).json({ error: 'Erro ao criar parcelas', detalhes: error });
    }
});


module.exports = router;
