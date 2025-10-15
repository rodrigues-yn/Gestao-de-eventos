const EventoService = require('./EventoService');
const ParticipanteService = require('./ParticipanteService');
const InscricaoRepository = require('../repositories/InscricaoRepository');

/**
 * InscricaoService - Gerencia inscrições de participantes em eventos
 *
 * Demonstra ABSTRAÇÃO, DEPENDENCY INJECTION e COMPOSIÇÃO:
 * - Compõe funcionalidades de EventoService e ParticipanteService
 * - Utiliza Repository para persistência
 * - Centraliza regras de negócio complexas (validações, verificações)
 */
class InscricaoService {
  constructor() {
    // Dependency Injection: injeta o repository
    this.inscricaoRepository = new InscricaoRepository();
  }

  // Inscrever participante em evento
  async inscrever(eventoId, participanteId) {
    // Verifica se evento existe (usando outro Service - Composição)
    const evento = await EventoService.buscarPorId(eventoId);

    // Verifica se participante existe (usando outro Service - Composição)
    const participante = await ParticipanteService.buscarPorId(participanteId);

    // Verifica se já está inscrito usando Repository
    const inscricaoExistente = await this.inscricaoRepository.findByEventoAndParticipante(
      eventoId,
      participanteId
    );

    if (inscricaoExistente) {
      throw new Error('Participante já inscrito neste evento');
    }

    // Verifica vagas disponíveis (usando outro Service - Composição)
    const vagas = await EventoService.verificarVagasDisponiveis(eventoId);
    if (!vagas.tem_vagas) {
      throw new Error('Não há vagas disponíveis para este evento');
    }

    // Realiza a inscrição usando Repository (Abstração)
    const inscricao = await this.inscricaoRepository.create(eventoId, participanteId);

    return {
      mensagem: 'Inscrição realizada com sucesso',
      inscricao,
      evento: evento.toObject(),
      participante: participante.toObject()
    };
  }

  // Cancelar inscrição por ID
  async cancelar(inscricaoId) {
    await this.inscricaoRepository.deleteById(inscricaoId);
    return { mensagem: 'Inscrição cancelada com sucesso' };
  }

  // Cancelar inscrição por evento e participante
  async cancelarPorEventoParticipante(eventoId, participanteId) {
    await this.inscricaoRepository.deleteByEventoAndParticipante(eventoId, participanteId);
    return { mensagem: 'Inscrição cancelada com sucesso' };
  }

  // Listar todas as inscrições
  async listarTodas() {
    return await this.inscricaoRepository.findAll();
  }
}

module.exports = new InscricaoService();
