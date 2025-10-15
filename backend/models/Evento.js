/**
 * Classe Evento - Demonstra POO com Encapsulamento
 *
 * Conceitos de POO aplicados:
 * 1. ENCAPSULAMENTO: Atributos privados (#) protegem os dados internos
 * 2. ABSTRAÇÃO: Interface pública simplificada (getters/setters) esconde a complexidade
 * 3. VALIDAÇÃO: Métodos garantem integridade dos dados
 */
class Evento {
  // Atributos privados (encapsulamento)
  #id;
  #nome;
  #data;
  #local;
  #numeroVagas;
  #descricao;

  constructor(id, nome, data, local, numeroVagas, descricao) {
    this.#id = id;
    this.#nome = nome;
    this.#data = data;
    this.#local = local;
    this.#numeroVagas = numeroVagas;
    this.#descricao = descricao;
  }

  // Getters - Acesso controlado aos atributos privados (Encapsulamento)
  getId() {
    return this.#id;
  }

  getNome() {
    return this.#nome;
  }

  getData() {
    return this.#data;
  }

  getLocal() {
    return this.#local;
  }

  getNumeroVagas() {
    return this.#numeroVagas;
  }

  getDescricao() {
    return this.#descricao;
  }

  // Setters - Modificação controlada com validação (Encapsulamento)
  setNome(nome) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do evento não pode ser vazio');
    }
    this.#nome = nome;
  }

  setData(data) {
    const dataEvento = new Date(data);
    if (isNaN(dataEvento.getTime())) {
      throw new Error('Data inválida');
    }
    this.#data = data;
  }

  setLocal(local) {
    if (!local || local.trim().length === 0) {
      throw new Error('Local do evento não pode ser vazio');
    }
    this.#local = local;
  }

  setNumeroVagas(numeroVagas) {
    if (numeroVagas < 0) {
      throw new Error('Número de vagas não pode ser negativo');
    }
    this.#numeroVagas = numeroVagas;
  }

  setDescricao(descricao) {
    this.#descricao = descricao;
  }

  // Método de validação - Abstração da lógica de validação
  validar() {
    if (!this.#nome || this.#nome.trim().length === 0) {
      throw new Error('Nome do evento é obrigatório');
    }
    if (!this.#data) {
      throw new Error('Data do evento é obrigatória');
    }
    if (!this.#local || this.#local.trim().length === 0) {
      throw new Error('Local do evento é obrigatório');
    }
    if (this.#numeroVagas < 0) {
      throw new Error('Número de vagas não pode ser negativo');
    }
    return true;
  }

  // Método para verificar disponibilidade de vagas
  temVagasDisponiveis(vagasOcupadas) {
    return vagasOcupadas < this.#numeroVagas;
  }

  // Método para converter para objeto simples (para banco de dados)
  toObject() {
    const obj = {
      nome: this.#nome,
      data: this.#data,
      local: this.#local,
      numero_vagas: this.#numeroVagas,
      descricao: this.#descricao
    };

    // Só inclui o ID se não for null (para criação de novos registros)
    if (this.#id !== null) {
      obj.id = this.#id;
    }

    return obj;
  }

  // Método estático para criar instância a partir de objeto do banco
  static fromObject(obj) {
    return new Evento(
      obj.id,
      obj.nome,
      obj.data,
      obj.local,
      obj.numero_vagas,
      obj.descricao
    );
  }
}

module.exports = Evento;
