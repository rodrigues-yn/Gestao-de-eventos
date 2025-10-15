const express = require('express');
const router = express.Router();
const EventoService = require('../services/EventoService');

// CREATE - Criar novo evento
router.post('/', async (req, res) => {
  try {
    const evento = await EventoService.criar(req.body);
    res.status(201).json(evento.toObject());
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// READ - Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await EventoService.listarTodos();
    res.json(eventos.map(e => e.toObject()));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// READ - Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await EventoService.buscarPorId(req.params.id);
    res.json(evento.toObject());
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
});

// UPDATE - Atualizar evento
router.put('/:id', async (req, res) => {
  try {
    const evento = await EventoService.atualizar(req.params.id, req.body);
    res.json(evento.toObject());
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// DELETE - Remover evento
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await EventoService.remover(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// GET - Listar participantes de um evento
router.get('/:id/participantes', async (req, res) => {
  try {
    const participantes = await EventoService.listarParticipantes(req.params.id);
    res.json(participantes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET - Verificar vagas disponíveis
router.get('/:id/vagas', async (req, res) => {
  try {
    const vagas = await EventoService.verificarVagasDisponiveis(req.params.id);
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
