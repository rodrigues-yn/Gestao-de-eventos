const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventoRoutes = require('./routes/eventoRoutes');
const participanteRoutes = require('./routes/participanteRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Rotas da API
app.use('/api/eventos', eventoRoutes);
app.use('/api/participantes', participanteRoutes);
app.use('/api/inscricoes', inscricaoRoutes);

// Rota raiz
app.get('/api', (req, res) => {
  res.json({
    mensagem: 'API de Gestão de Eventos',
    versao: '1.0.0',
    endpoints: {
      eventos: '/api/eventos',
      participantes: '/api/participantes',
      inscricoes: '/api/inscricoes'
    }
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API disponível em http://localhost:${PORT}/api`);
});
