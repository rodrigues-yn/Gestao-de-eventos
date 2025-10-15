const Evento = require('../models/Evento');
const EventoRepository = require('../repositories/EventoRepository');
const InscricaoRepository = require('../repositories/InscricaoRepository');

/**
 * EventoService - Camada de lógica de negócio
 *
 * Demonstra ABSTRAÇÃO e DEPENDENCY INJECTION:
 * - Separa a lógica de negócio da camada de apresentação
 * - Utiliza o padrão Repository para acesso a dados
 * - NÃO conhece detalhes do banco de dados (responsabilidade do Repository)
 */
class EventoService {
  constructor() {
    // Dependency Injection: injeta os repositories
    this.eventoRepository = new EventoRepository();
    this.inscricaoRepository = new InscricaoRepository();
  }

  // CREATE - Criar novo evento
  async criar(dadosEvento) {
    // Cria instância da classe Evento (POO)
    const evento = new Evento(
      null, // ID será gerado pelo banco
      dadosEvento.nome,
      dadosEvento.data,
      dadosEvento.local,
      dadosEvento.numero_vagas,
      dadosEvento.descricao
    );

    // Valida usando o método da classe (Encapsulamento)
    evento.validar();

    // Delega a persistência ao Repository (Abstração)
    return await this.eventoRepository.create(evento);
  }

  // READ - Listar todos os eventos
  async listarTodos() {
    return await this.eventoRepository.findAll();
  }

  // READ - Buscar evento por ID
  async buscarPorId(id) {
    return await this.eventoRepository.findById(id);
  }

  // UPDATE - Atualizar evento
  async atualizar(id, dadosEvento) {
    // Busca evento existente usando Repository
    const eventoExistente = await this.eventoRepository.findById(id);

    // Atualiza os dados usando setters (Encapsulamento com validação)
    if (dadosEvento.nome !== undefined) eventoExistente.setNome(dadosEvento.nome);
    if (dadosEvento.data !== undefined) eventoExistente.setData(dadosEvento.data);
    if (dadosEvento.local !== undefined) eventoExistente.setLocal(dadosEvento.local);
    if (dadosEvento.numero_vagas !== undefined) eventoExistente.setNumeroVagas(dadosEvento.numero_vagas);
    if (dadosEvento.descricao !== undefined) eventoExistente.setDescricao(dadosEvento.descricao);

    // Valida (Encapsulamento)
    eventoExistente.validar();

    // Delega a persistência ao Repository (Abstração)
    return await this.eventoRepository.update(id, eventoExistente);
  }

  // DELETE - Remover evento
  async remover(id) {
    // Remove todas as inscrições primeiro usando Repository
    await this.inscricaoRepository.deleteByEvento(id);

    // Remove o evento usando Repository
    await this.eventoRepository.delete(id);

    return { mensagem: 'Evento removido com sucesso' };
  }

  // Listar participantes de um evento
  async listarParticipantes(eventoId) {
    return await this.eventoRepository.findParticipantes(eventoId);
  }

  // Verificar vagas disponíveis
  async verificarVagasDisponiveis(eventoId) {
    // Busca evento usando Repository
    const evento = await this.eventoRepository.findById(eventoId);

    // Conta inscrições usando Repository
    const vagasOcupadas = await this.eventoRepository.countInscricoes(eventoId);
    const vagasDisponiveis = evento.getNumeroVagas() - vagasOcupadas;

    return {
      total_vagas: evento.getNumeroVagas(),
      vagas_ocupadas: vagasOcupadas,
      vagas_disponiveis: vagasDisponiveis,
      tem_vagas: evento.temVagasDisponiveis(vagasOcupadas)
    };
  }
}

module.exports = new EventoService();
