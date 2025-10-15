-- =====================================================
-- Script de Criação do Banco de Dados
-- Sistema de Gestão de Eventos
-- =====================================================

-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de eventos
CREATE TABLE IF NOT EXISTS eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    local VARCHAR(255) NOT NULL,
    numero_vagas INTEGER NOT NULL CHECK (numero_vagas > 0),
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Criar tabela de participantes
CREATE TABLE IF NOT EXISTS participantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Criar tabela de relacionamento evento_participante (N:N)
CREATE TABLE IF NOT EXISTS evento_participante (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    participante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
    data_inscricao TIMESTAMP DEFAULT NOW(),
    UNIQUE(evento_id, participante_id)
);

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data);
CREATE INDEX IF NOT EXISTS idx_participantes_email ON participantes(email);
CREATE INDEX IF NOT EXISTS idx_evento_participante_evento ON evento_participante(evento_id);
CREATE INDEX IF NOT EXISTS idx_evento_participante_participante ON evento_participante(participante_id);

-- =====================================================
-- Dados de Exemplo (OPCIONAL - apenas para teste)
-- =====================================================

-- Inserir eventos de exemplo
INSERT INTO eventos (nome, data, local, numero_vagas, descricao) VALUES
('Workshop de Programação', '2025-11-15', 'Sala A - SENAI', 30, 'Workshop prático de desenvolvimento web com Node.js e React'),
('Palestra sobre IA', '2025-11-20', 'Auditório Principal', 100, 'Palestra sobre Inteligência Artificial e suas aplicações'),
('Hackathon 2025', '2025-12-01', 'Laboratório de Informática', 50, 'Maratona de programação de 24 horas');

-- Inserir participantes de exemplo
INSERT INTO participantes (nome, email) VALUES
('João Silva', 'joao.silva@email.com'),
('Maria Santos', 'maria.santos@email.com'),
('Pedro Oliveira', 'pedro.oliveira@email.com'),
('Ana Costa', 'ana.costa@email.com');

-- Inserir inscrições de exemplo
-- Nota: Substitua os IDs pelos IDs reais gerados após executar os inserts acima
-- Você pode consultar os IDs com: SELECT id, nome FROM eventos; SELECT id, nome FROM participantes;

-- INSERT INTO evento_participante (evento_id, participante_id) VALUES
-- ('id-do-evento-1', 'id-do-participante-1'),
-- ('id-do-evento-1', 'id-do-participante-2');

-- =====================================================
-- Queries Úteis para Verificação
-- =====================================================

-- Ver todos os eventos
-- SELECT * FROM eventos ORDER BY data;

-- Ver todos os participantes
-- SELECT * FROM participantes ORDER BY nome;

-- Ver todas as inscrições com detalhes
-- SELECT
--     e.nome as evento,
--     e.data,
--     p.nome as participante,
--     p.email,
--     ep.data_inscricao
-- FROM evento_participante ep
-- JOIN eventos e ON ep.evento_id = e.id
-- JOIN participantes p ON ep.participante_id = p.id
-- ORDER BY e.data, p.nome;

-- Contar participantes por evento
-- SELECT
--     e.nome as evento,
--     e.numero_vagas as total_vagas,
--     COUNT(ep.id) as vagas_ocupadas,
--     e.numero_vagas - COUNT(ep.id) as vagas_disponiveis
-- FROM eventos e
-- LEFT JOIN evento_participante ep ON e.id = ep.evento_id
-- GROUP BY e.id, e.nome, e.numero_vagas
-- ORDER BY e.nome;
