/**
 * Classe Participante - Demonstra POO com Encapsulamento
 *
 * Conceitos de POO aplicados:
 * 1. ENCAPSULAMENTO: Atributos privados (#) protegem os dados internos
 * 2. ABSTRAÇÃO: Interface pública simplificada (getters/setters) esconde a complexidade
 * 3. VALIDAÇÃO: Métodos garantem integridade dos dados (ex: validação de email)
 */
class Participante {
  // Atributos privados (encapsulamento)
  #id;
  #nome;
  #email;

  constructor(id, nome, email) {
    this.#id = id;
    this.#nome = nome;
    this.#email = email;
  }

  // Getters - Acesso controlado aos atributos privados (Encapsulamento)
  getId() {
    return this.#id;
  }

  getNome() {
    return this.#nome;
  }

  getEmail() {
    return this.#email;
  }

  // Setters - Modificação controlada com validação (Encapsulamento)
  setNome(nome) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do participante não pode ser vazio');
    }
    this.#nome = nome;
  }

  setEmail(email) {
    if (!this.#validarEmail(email)) {
      throw new Error('Email inválido');
    }
    this.#email = email;
  }

  // Método privado de validação de email (Encapsulamento)
  #validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Método de validação completa - Abstração da lógica de validação
  validar() {
    if (!this.#nome || this.#nome.trim().length === 0) {
      throw new Error('Nome do participante é obrigatório');
    }
    if (!this.#email || !this.#validarEmail(this.#email)) {
      throw new Error('Email válido é obrigatório');
    }
    return true;
  }

  // Método para converter para objeto simples (para banco de dados)
  toObject() {
    const obj = {
      nome: this.#nome,
      email: this.#email
    };

    // Só inclui o ID se não for null (para criação de novos registros)
    if (this.#id !== null) {
      obj.id = this.#id;
    }

    return obj;
  }

  // Método estático para criar instância a partir de objeto do banco
  static fromObject(obj) {
    return new Participante(
      obj.id,
      obj.nome,
      obj.email
    );
  }
}

module.exports = Participante;
