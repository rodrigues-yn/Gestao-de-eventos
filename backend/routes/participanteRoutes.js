const express = require('express');
const router = express.Router();
const ParticipanteService = require('../services/ParticipanteService');

// CREATE - Criar novo participante
router.post('/', async (req, res) => {
  try {
    const participante = await ParticipanteService.criar(req.body);
    res.status(201).json(participante.toObject());
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// READ - Listar todos os participantes
router.get('/', async (req, res) => {
  try {
    const participantes = await ParticipanteService.listarTodos();
    res.json(participantes.map(p => p.toObject()));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// READ - Buscar participante por ID
router.get('/:id', async (req, res) => {
  try {
    const participante = await ParticipanteService.buscarPorId(req.params.id);
    res.json(participante.toObject());
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
});

// UPDATE - Atualizar participante
router.put('/:id', async (req, res) => {
  try {
    const participante = await ParticipanteService.atualizar(req.params.id, req.body);
    res.json(participante.toObject());
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// DELETE - Remover participante
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await ParticipanteService.remover(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// GET - Listar eventos de um participante
router.get('/:id/eventos', async (req, res) => {
  try {
    const eventos = await ParticipanteService.listarEventos(req.params.id);
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
