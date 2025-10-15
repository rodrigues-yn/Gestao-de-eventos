const Participante = require('../models/Participante');
const ParticipanteRepository = require('../repositories/ParticipanteRepository');
const InscricaoRepository = require('../repositories/InscricaoRepository');

/**
 * ParticipanteService - Camada de lógica de negócio
 *
 * Demonstra ABSTRAÇÃO e DEPENDENCY INJECTION:
 * - Separa a lógica de negócio da camada de apresentação
 * - Utiliza o padrão Repository para acesso a dados
 * - NÃO conhece detalhes do banco de dados (responsabilidade do Repository)
 */
class ParticipanteService {
  constructor() {
    // Dependency Injection: injeta os repositories
    this.participanteRepository = new ParticipanteRepository();
    this.inscricaoRepository = new InscricaoRepository();
  }

  // CREATE - Criar novo participante
  async criar(dadosParticipante) {
    // Cria instância da classe Participante (POO)
    const participante = new Participante(
      null, // ID será gerado pelo banco
      dadosParticipante.nome,
      dadosParticipante.email
    );

    // Valida usando o método da classe (Encapsulamento)
    participante.validar();

    // Verifica se email já existe usando Repository
    const existente = await this.participanteRepository.findByEmail(participante.getEmail());

    if (existente) {
      throw new Error('Email já cadastrado');
    }

    // Delega a persistência ao Repository (Abstração)
    return await this.participanteRepository.create(participante);
  }

  // READ - Listar todos os participantes
  async listarTodos() {
    return await this.participanteRepository.findAll();
  }

  // READ - Buscar participante por ID
  async buscarPorId(id) {
    return await this.participanteRepository.findById(id);
  }

  // UPDATE - Atualizar participante
  async atualizar(id, dadosParticipante) {
    // Busca participante existente usando Repository
    const participanteExistente = await this.participanteRepository.findById(id);

    // Atualiza os dados usando setters (Encapsulamento com validação)
    if (dadosParticipante.nome !== undefined) {
      participanteExistente.setNome(dadosParticipante.nome);
    }
    if (dadosParticipante.email !== undefined) {
      // Verifica se o novo email já existe usando Repository
      const emailExistente = await this.participanteRepository.findByEmail(dadosParticipante.email);

      if (emailExistente && emailExistente.getId() !== id) {
        throw new Error('Email já cadastrado para outro participante');
      }

      participanteExistente.setEmail(dadosParticipante.email);
    }

    // Valida (Encapsulamento)
    participanteExistente.validar();

    // Delega a persistência ao Repository (Abstração)
    return await this.participanteRepository.update(id, participanteExistente);
  }

  // DELETE - Remover participante
  async remover(id) {
    // Remove todas as inscrições primeiro usando Repository
    await this.inscricaoRepository.deleteByParticipante(id);

    // Remove o participante usando Repository
    await this.participanteRepository.delete(id);

    return { mensagem: 'Participante removido com sucesso' };
  }

  // Listar eventos de um participante
  async listarEventos(participanteId) {
    return await this.participanteRepository.findEventos(participanteId);
  }
}

module.exports = new ParticipanteService();
