const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { QueryTypes, INTEGER } = require('sequelize');
const { Guia, Parcela } = require('../model/index');

router.get('/status', async (req, res) => {
    const IdGuia = req.query.IdGuia;
    
    if (!IdGuia) {
        return res.status(400).json({ error: 'Erro ao fornecer o IdGuia' });
    }
    
    const guiaEncontrada = await Guia.findOne({ WHERE: { IdGuia: IdGuia } });
    
    console.log(guiaEncontrada);
    if (!guiaEncontrada) {
        return res.status(404).json({ error: 'Guia não encontrada' });
    }

    console.log(Guia);
    return res.status(404).json({ error: 'Testes' });
    
    /*try {
    const [statusGuia] = await sequelize.query(
        `SELECT g.IdGuia,
                SUM(p.VlrTarifa - mf.valorMovimentacao) AS VlrTotal
         FROM guias g
         JOIN parcelas p ON p.IdGuia = g.IdGuia 
         JOIN MovimentacaoFinanceiras mf on mf.IdOrigem = p.IdParcela AND mf.tipoMovimentacao = 'Pagamento'
         WHERE g.IdGuia = :IdGuia
         GROUP BY g.IdGuia`,
        {
            replacements: { IdGuia: IdGuia },
            type: QueryTypes.SELECT,
        }
    );
    console.log(statusGuia)
    res.status(200).json(statusGuia);        
    } catch (error) {
        console.log('Erro ao buscar status das guias:', error);
        res.status(500).json({ error: 'Erro ao buscar status das guias' });
    }*/
});

module.exports = router;