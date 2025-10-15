const express = require('express');
const router = express.Router();
const InscricaoService = require('../services/InscricaoService');

// POST - Inscrever participante em evento
router.post('/', async (req, res) => {
  try {
    const { evento_id, participante_id } = req.body;
    const resultado = await InscricaoService.inscrever(evento_id, participante_id);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// DELETE - Cancelar inscrição por ID
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await InscricaoService.cancelar(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// DELETE - Cancelar inscrição por evento e participante
router.delete('/evento/:eventoId/participante/:participanteId', async (req, res) => {
  try {
    const resultado = await InscricaoService.cancelarPorEventoParticipante(
      req.params.eventoId,
      req.params.participanteId
    );
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// GET - Listar todas as inscrições
router.get('/', async (req, res) => {
  try {
    const inscricoes = await InscricaoService.listarTodas();
    res.json(inscricoes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
