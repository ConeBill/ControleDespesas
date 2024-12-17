const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const UsuarioConta = require('../model/usuarioContaModel');
const { ContaBancaria } = require('../model/index');
const { ca } = require('date-fns/locale');

router.get('/usr', async (req, res) => {
    try {
        const Saldo = await sequelize.query(
            `SELECT * 
               FROM ContaBancaria CB
               JOIN UsuarioConta UC ON UC.IdConta = CB.IdConta
              WHERE UC.IdOrigem = :IdOrigem
                AND UC.SetorOrigem = 'Usuarios'`,
            {
                replacements: {
                    IdOrigem: req.query.idOrigem
                },
                type: QueryTypes.SELECT,
            }
        );

        res.json(Saldo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar contas', detalhes: error });
    }
});

router.get('/full', async (req, res) => {
    try {
        const contas = await ContaBancaria.findAll();

        return res.json(contas);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar contas', detalhes: error });
    }
});

router.post('/novaconta', async (req, res) => {
    const { nomeConta, IdOrigem, Nota, Saldo, IdConta } = req.body;

    if (!IdOrigem) {
        return res.status(400).json({ error: 'O campo IdOrigem é obrigatório' });
    }


    try {
        if (IdConta) {
                const conta = await ContaBancaria.findOne({ where: { IdConta } });
                if (!conta) {
                    return res.status(404).json({ error: 'Conta não encontrada' });
                }

                const usuarioConta = await UsuarioConta.findOne({
                    where: {
                        IdConta,
                        IdOrigem
                    }
                });

                if (!usuarioConta) {
                    if (Saldo > 0) {

                        // Cria um saldo para o usuário e a conta
                        await UsuarioConta.create({
                            IdConta: conta.IdConta,
                            IdOrigem,
                            SetorOrigem: 'Usuarios',
                            saldo: Saldo
                        });

                        return res.status(201).json({ message: 'Conta criada e saldo associado ao usuário com sucesso.' });
                    };
                    // Cria o saldo para o usuário e a conta
                    await UsuarioConta.create({
                        IdConta: conta.IdConta,
                        IdOrigem,
                        SetorOrigem: 'Usuarios',
                        saldo: 0.00
                    });
                }

                usuarioConta.saldo = Saldo;
                await usuarioConta.save();

                return res.status(200).json({ message: 'Conta atualizada com sucesso.' });
            }

            // Verifica se já existe uma conta com o mesmo nome
            let conta = await ContaBancaria.findOne({ where: { nomeConta } });

            if (!conta) {
                conta = await ContaBancaria.create({ nomeConta });
            }
            // Verifica se já existe um saldo para o usuário e conta específicos
            const existeSaldo = await UsuarioConta.findOne({
                where: {
                    IdConta: conta.IdConta,
                    IdOrigem
                }
            });

            if (existeSaldo) {
                return res.status(400).json({ error: 'O usuário já possui uma conta cadastrada.' });
            }

            if (Saldo > 0) {
                // Cria um saldo para o usuário e a conta
                await UsuarioConta.create({
                    IdConta: conta.IdConta,
                    IdOrigem,
                    SetorOrigem: 'Usuarios',
                    saldo: Saldo
                });

                return res.status(201).json({ message: 'Conta criada e saldo associado ao usuário com sucesso.' });
            };

            // Cria o saldo para o usuário e a conta
            await UsuarioConta.create({
                IdConta: conta.IdConta,
                IdOrigem,
                SetorOrigem: 'Usuarios',
                saldo: 0.00
            });

            return res.status(201).json({ message: 'Conta criada e saldo associado ao usuário com sucesso.' });

        } catch (error) {
            console.error('Erro ao criar conta:', error);
            return res.status(500).json({ error: 'Erro ao criar a conta', detalhes: error });
        }
    });

module.exports = router;
