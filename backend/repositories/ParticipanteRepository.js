const supabase = require('../config/supabase');
const Participante = require('../models/Participante');

/**
 * ParticipanteRepository - Padrão Repository
 *
 * Responsabilidade: Encapsular TODA a lógica de acesso ao banco de dados
 * para a entidade Participante.
 *
 * Conceitos de POO aplicados:
 * - ABSTRAÇÃO: Oculta detalhes do Supabase dos Services
 * - ENCAPSULAMENTO: Centraliza acesso a dados em uma única classe
 * - SINGLE RESPONSIBILITY: Apenas acesso a dados, nada de lógica de negócio
 */
class ParticipanteRepository {

  /**
   * Insere um novo participante no banco de dados
   * @param {Participante} participante - Instância da classe Participante
   * @returns {Promise<Participante>} Participante criado
   */
  async create(participante) {
    const { data, error } = await supabase
      .from('participantes')
      .insert([participante.toObject()])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao inserir participante no banco: ${error.message}`);
    }

    return Participante.fromObject(data);
  }

  /**
   * Busca todos os participantes ordenados por nome
   * @returns {Promise<Array<Participante>>} Lista de participantes
   */
  async findAll() {
    const { data, error } = await supabase
      .from('participantes')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar participantes: ${error.message}`);
    }

    return data.map(obj => Participante.fromObject(obj));
  }

  /**
   * Busca participante por ID
   * @param {string} id - UUID do participante
   * @returns {Promise<Participante>} Participante encontrado
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('participantes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar participante: ${error.message}`);
    }

    if (!data) {
      throw new Error('Participante não encontrado');
    }

    return Participante.fromObject(data);
  }

  /**
   * Busca participante por email
   * @param {string} email - Email do participante
   * @returns {Promise<Participante|null>} Participante encontrado ou null
   */
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('participantes')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw new Error(`Erro ao buscar participante por email: ${error.message}`);
    }

    return data ? Participante.fromObject(data) : null;
  }

  /**
   * Atualiza um participante existente
   * @param {string} id - UUID do participante
   * @param {Participante} participante - Instância da classe Participante com dados atualizados
   * @returns {Promise<Participante>} Participante atualizado
   */
  async update(id, participante) {
    const { data, error } = await supabase
      .from('participantes')
      .update(participante.toObject())
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar participante: ${error.message}`);
    }

    return Participante.fromObject(data);
  }

  /**
   * Remove um participante do banco de dados
   * @param {string} id - UUID do participante
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  async delete(id) {
    const { error } = await supabase
      .from('participantes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao remover participante: ${error.message}`);
    }

    return true;
  }

  /**
   * Busca eventos de um participante
   * @param {string} participanteId - UUID do participante
   * @returns {Promise<Array>} Lista de eventos com dados de inscrição
   */
  async findEventos(participanteId) {
    const { data, error } = await supabase
      .from('evento_participante')
      .select(`
        id,
        data_inscricao,
        eventos (
          id,
          nome,
          data,
          local,
          numero_vagas,
          descricao
        )
      `)
      .eq('participante_id', participanteId);

    if (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    return data.map(item => ({
      inscricao_id: item.id,
      data_inscricao: item.data_inscricao,
      ...item.eventos
    }));
  }
}

module.exports = ParticipanteRepository;
