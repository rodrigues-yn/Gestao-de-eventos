const supabase = require('../config/supabase');

/**
 * InscricaoRepository - Padrão Repository
 *
 * Responsabilidade: Encapsular TODA a lógica de acesso ao banco de dados
 * para a tabela evento_participante (inscrições).
 *
 * Conceitos de POO aplicados:
 * - ABSTRAÇÃO: Oculta detalhes do Supabase dos Services
 * - ENCAPSULAMENTO: Centraliza acesso a dados em uma única classe
 * - SINGLE RESPONSIBILITY: Apenas acesso a dados, nada de lógica de negócio
 */
class InscricaoRepository {

  /**
   * Cria uma nova inscrição
   * @param {string} eventoId - UUID do evento
   * @param {string} participanteId - UUID do participante
   * @returns {Promise<Object>} Inscrição criada
   */
  async create(eventoId, participanteId) {
    const { data, error } = await supabase
      .from('evento_participante')
      .insert([{
        evento_id: eventoId,
        participante_id: participanteId,
        data_inscricao: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar inscrição: ${error.message}`);
    }

    return data;
  }

  /**
   * Busca inscrição por evento e participante
   * @param {string} eventoId - UUID do evento
   * @param {string} participanteId - UUID do participante
   * @returns {Promise<Object|null>} Inscrição encontrada ou null
   */
  async findByEventoAndParticipante(eventoId, participanteId) {
    const { data, error } = await supabase
      .from('evento_participante')
      .select('*')
      .eq('evento_id', eventoId)
      .eq('participante_id', participanteId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw new Error(`Erro ao buscar inscrição: ${error.message}`);
    }

    return data;
  }

  /**
   * Remove uma inscrição por ID
   * @param {string} inscricaoId - UUID da inscrição
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  async deleteById(inscricaoId) {
    const { error } = await supabase
      .from('evento_participante')
      .delete()
      .eq('id', inscricaoId);

    if (error) {
      throw new Error(`Erro ao remover inscrição: ${error.message}`);
    }

    return true;
  }

  /**
   * Remove uma inscrição por evento e participante
   * @param {string} eventoId - UUID do evento
   * @param {string} participanteId - UUID do participante
   * @returns {Promise<Object>} Inscrição removida
   */
  async deleteByEventoAndParticipante(eventoId, participanteId) {
    const { data, error } = await supabase
      .from('evento_participante')
      .delete()
      .eq('evento_id', eventoId)
      .eq('participante_id', participanteId)
      .select();

    if (error) {
      throw new Error(`Erro ao remover inscrição: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Inscrição não encontrada');
    }

    return data[0];
  }

  /**
   * Remove todas as inscrições de um evento
   * @param {string} eventoId - UUID do evento
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  async deleteByEvento(eventoId) {
    const { error } = await supabase
      .from('evento_participante')
      .delete()
      .eq('evento_id', eventoId);

    if (error) {
      throw new Error(`Erro ao remover inscrições do evento: ${error.message}`);
    }

    return true;
  }

  /**
   * Remove todas as inscrições de um participante
   * @param {string} participanteId - UUID do participante
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  async deleteByParticipante(participanteId) {
    const { error } = await supabase
      .from('evento_participante')
      .delete()
      .eq('participante_id', participanteId);

    if (error) {
      throw new Error(`Erro ao remover inscrições do participante: ${error.message}`);
    }

    return true;
  }

  /**
   * Lista todas as inscrições com dados de evento e participante
   * @returns {Promise<Array>} Lista de inscrições
   */
  async findAll() {
    const { data, error } = await supabase
      .from('evento_participante')
      .select(`
        id,
        data_inscricao,
        eventos (
          id,
          nome,
          data,
          local
        ),
        participantes (
          id,
          nome,
          email
        )
      `)
      .order('data_inscricao', { ascending: false });

    if (error) {
      throw new Error(`Erro ao listar inscrições: ${error.message}`);
    }

    return data;
  }
}

module.exports = InscricaoRepository;
