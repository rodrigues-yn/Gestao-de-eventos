const supabase = require('../config/supabase');
const Evento = require('../models/Evento');

/**
 * EventoRepository - Padrão Repository
 *
 * Responsabilidade: Encapsular TODA a lógica de acesso ao banco de dados
 * para a entidade Evento.
 *
 * Conceitos de POO aplicados:
 * - ABSTRAÇÃO: Oculta detalhes do Supabase dos Services
 * - ENCAPSULAMENTO: Centraliza acesso a dados em uma única classe
 * - SINGLE RESPONSIBILITY: Apenas acesso a dados, nada de lógica de negócio
 */
class EventoRepository {

  /**
   * Insere um novo evento no banco de dados
   * @param {Evento} evento - Instância da classe Evento
   * @returns {Promise<Evento>} Evento criado
   */
  async create(evento) {
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento.toObject()])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao inserir evento no banco: ${error.message}`);
    }

    return Evento.fromObject(data);
  }

  /**
   * Busca todos os eventos ordenados por data
   * @returns {Promise<Array<Evento>>} Lista de eventos
   */
  async findAll() {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('data', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    return data.map(obj => Evento.fromObject(obj));
  }

  /**
   * Busca evento por ID
   * @param {string} id - UUID do evento
   * @returns {Promise<Evento>} Evento encontrado
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar evento: ${error.message}`);
    }

    if (!data) {
      throw new Error('Evento não encontrado');
    }

    return Evento.fromObject(data);
  }

  /**
   * Atualiza um evento existente
   * @param {string} id - UUID do evento
   * @param {Evento} evento - Instância da classe Evento com dados atualizados
   * @returns {Promise<Evento>} Evento atualizado
   */
  async update(id, evento) {
    const { data, error } = await supabase
      .from('eventos')
      .update(evento.toObject())
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar evento: ${error.message}`);
    }

    return Evento.fromObject(data);
  }

  /**
   * Remove um evento do banco de dados
   * @param {string} id - UUID do evento
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  async delete(id) {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao remover evento: ${error.message}`);
    }

    return true;
  }

  /**
   * Conta o número de inscrições em um evento
   * @param {string} eventoId - UUID do evento
   * @returns {Promise<number>} Número de inscrições
   */
  async countInscricoes(eventoId) {
    const { count, error } = await supabase
      .from('evento_participante')
      .select('*', { count: 'exact', head: true })
      .eq('evento_id', eventoId);

    if (error) {
      throw new Error(`Erro ao contar inscrições: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Busca participantes de um evento
   * @param {string} eventoId - UUID do evento
   * @returns {Promise<Array>} Lista de participantes com dados de inscrição
   */
  async findParticipantes(eventoId) {
    const { data, error } = await supabase
      .from('evento_participante')
      .select(`
        id,
        data_inscricao,
        participantes (
          id,
          nome,
          email
        )
      `)
      .eq('evento_id', eventoId);

    if (error) {
      throw new Error(`Erro ao buscar participantes: ${error.message}`);
    }

    return data.map(item => ({
      inscricao_id: item.id,
      data_inscricao: item.data_inscricao,
      ...item.participantes
    }));
  }
}

module.exports = EventoRepository;
