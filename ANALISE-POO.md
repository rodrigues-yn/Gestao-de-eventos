# Análise de Paradigmas de Código e Teoria de POO

Este documento apresenta a análise detalhada dos conceitos de Programação Orientada a Objetos (POO) aplicados no projeto, conforme requisitado na Etapa 3 da avaliação.

## 📍 Trechos de Código Selecionados

**Principais Arquivos:**
- `backend/models/Evento.js` - Demonstra Encapsulamento
- `backend/services/EventoService.js` - Demonstra Abstração e Dependency Injection
- `backend/repositories/EventoRepository.js` - Demonstra Repository Pattern

Estes trechos foram escolhidos por demonstrar claramente os conceitos de POO aplicados à lógica de negócio do sistema.

---

## 🔍 Conceitos de POO Identificados

### 1. ENCAPSULAMENTO

**Definição:** Encapsulamento é o conceito de esconder os detalhes internos de implementação e expor apenas o que é necessário através de uma interface pública.

**Aplicação no Código:**

```javascript
class Evento {
  // Atributos PRIVADOS (encapsulados)
  #id;
  #nome;
  #data;
  #local;
  #numeroVagas;
  #descricao;

  // Interface PÚBLICA - Getters
  getNome() {
    return this.#nome;
  }

  // Interface PÚBLICA - Setters com validação
  setNome(nome) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome do evento não pode ser vazio');
    }
    this.#nome = nome;
  }

  setNumeroVagas(numeroVagas) {
    if (numeroVagas < 0) {
      throw new Error('Número de vagas não pode ser negativo');
    }
    this.#numeroVagas = numeroVagas;
  }
}
```

**Benefícios:**
- ✅ **Proteção de Dados:** Os atributos privados (#) não podem ser acessados diretamente
- ✅ **Validação Centralizada:** Toda modificação passa pelos setters, garantindo dados válidos
- ✅ **Controle de Acesso:** Apenas métodos públicos podem manipular os dados internos
- ✅ **Manutenibilidade:** Mudanças internas não afetam código externo

---

### 2. ABSTRAÇÃO

**Definição:** Abstração é o processo de esconder a complexidade da implementação, expondo apenas funcionalidades essenciais através de uma interface simplificada.

**Aplicação no Código:**

```javascript
class EventoService {
  // Método público simples que abstrai toda a complexidade
  async criar(dadosEvento) {
    // 1. Cria instância (complexidade escondida)
    const evento = new Evento(
      null,
      dadosEvento.nome,
      dadosEvento.data,
      dadosEvento.local,
      dadosEvento.numero_vagas,
      dadosEvento.descricao
    );

    // 2. Valida (complexidade escondida na classe)
    evento.validar();

    // 3. Persiste no banco (complexidade escondida)
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento.toObject()])
      .select();

    if (error) throw new Error(`Erro ao criar evento: ${error.message}`);

    return Evento.fromObject(data[0]);
  }
}
```

**Camadas de Abstração:**
1. **Model (Evento):** Abstrai a estrutura de dados e validações
2. **Service (EventoService):** Abstrai a lógica de negócio complexa
3. **Route (eventoRoutes):** Abstrai a comunicação HTTP
4. **Frontend:** Apenas consome a API sem saber dos detalhes

**Benefícios:**
- ✅ **Simplicidade:** Interface limpa oculta complexidade interna
- ✅ **Separação de Responsabilidades:** Cada camada tem seu papel
- ✅ **Facilita Testes:** Cada camada pode ser testada isoladamente
- ✅ **Reduz Acoplamento:** Mudanças internas não afetam o uso externo

---

### 3. REPOSITORY PATTERN (Padrão de Projeto POO)

**Definição:** Repository Pattern é um padrão que encapsula a lógica de acesso a dados, abstraindo completamente o banco de dados das camadas superiores.

**Aplicação no Código:**

```javascript
// repositories/EventoRepository.js
class EventoRepository {
  /**
   * Responsabilidade ÚNICA: Acesso ao banco de dados
   * Encapsula TODA interação com Supabase
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

  async findById(id) {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Erro ao buscar evento: ${error.message}`);
    return Evento.fromObject(data);
  }

  // Outros métodos: findAll(), update(), delete()...
}

// services/EventoService.js
class EventoService {
  constructor() {
    // DEPENDENCY INJECTION: Injeta o repository
    this.eventoRepository = new EventoRepository();
  }

  async criar(dadosEvento) {
    const evento = new Evento(...);
    evento.validar();

    // Service NÃO conhece detalhes do banco!
    // Delega ao Repository (ABSTRAÇÃO)
    return await this.eventoRepository.create(evento);
  }
}
```

**Benefícios do Repository Pattern:**
- ✅ **Separação de Responsabilidades:** Service cuida de lógica de negócio, Repository cuida de dados
- ✅ **Abstração Total:** Service não conhece Supabase, SQL, ou detalhes do banco
- ✅ **Testabilidade:** Fácil mockar o Repository nos testes
- ✅ **Flexibilidade:** Trocar de banco (ex: Supabase → MySQL) só afeta o Repository
- ✅ **Manutenibilidade:** Queries SQL centralizadas em um só lugar

**Comparação:**

| Aspecto | Com Repository | Sem Repository |
|---------|---------------|----------------|
| **Service conhece banco?** | ❌ Não | ✅ Sim |
| **Fácil trocar banco?** | ✅ Sim | ❌ Não |
| **Código duplicado?** | ❌ Não | ✅ Sim |
| **Testável?** | ✅ Muito | ⚠️ Difícil |

---

### 4. DEPENDENCY INJECTION (Injeção de Dependências)

**Definição:** Padrão onde as dependências de uma classe são fornecidas externamente (injetadas), em vez de serem criadas internamente.

**Aplicação no Código:**

```javascript
class EventoService {
  constructor() {
    // Injeta as dependências no construtor
    this.eventoRepository = new EventoRepository();
    this.inscricaoRepository = new InscricaoRepository();
  }

  async remover(id) {
    // Usa as dependências injetadas
    await this.inscricaoRepository.deleteByEvento(id);
    await this.eventoRepository.delete(id);
  }
}
```

**Benefícios:**
- ✅ **Desacoplamento:** Service não cria repositories diretamente
- ✅ **Testabilidade:** Pode injetar mocks para testes
- ✅ **Flexibilidade:** Fácil trocar implementações

---

### 5. VALIDAÇÃO INTEGRADA (Conceito relacionado ao Encapsulamento)

**Aplicação no Código:**

```javascript
class Evento {
  // Método privado de validação
  #validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Método público de validação completa
  validar() {
    if (!this.#nome || this.#nome.trim().length === 0) {
      throw new Error('Nome do evento é obrigatório');
    }
    if (!this.#data) {
      throw new Error('Data do evento é obrigatória');
    }
    if (this.#numeroVagas < 0) {
      throw new Error('Número de vagas não pode ser negativo');
    }
    return true;
  }
}
```

**Benefícios:**
- ✅ **Integridade de Dados:** Garante que objetos sempre estejam em estado válido
- ✅ **Segurança:** Previne dados inválidos no banco
- ✅ **Centralização:** Uma única fonte de verdade para regras de validação

---

## ⚖️ Comparação: POO vs Programação Estruturada/Procedural

### Mesma funcionalidade em Programação Estruturada:

```javascript
// ABORDAGEM ESTRUTURADA/PROCEDURAL

// Dados soltos sem proteção
let evento = {
  id: null,
  nome: '',
  data: '',
  local: '',
  numeroVagas: 0,
  descricao: ''
};

// Funções separadas e dispersas
function validarNomeEvento(nome) {
  if (!nome || nome.trim().length === 0) {
    return false;
  }
  return true;
}

function validarVagas(vagas) {
  if (vagas < 0) {
    return false;
  }
  return true;
}

function criarEvento(nome, data, local, vagas, descricao) {
  // Validações dispersas e repetitivas
  if (!validarNomeEvento(nome)) {
    throw new Error('Nome inválido');
  }
  if (!validarVagas(vagas)) {
    throw new Error('Vagas inválidas');
  }

  // Manipulação direta dos dados
  evento.nome = nome;
  evento.data = data;
  evento.local = local;
  evento.numeroVagas = vagas;
  evento.descricao = descricao;

  // Lógica de banco misturada
  return salvarNoBanco(evento);
}

function salvarNoBanco(evento) {
  // Código de banco misturado com lógica
  // ...
}
```

---

## 📊 Análise Crítica: Vantagens e Desvantagens

### ✅ Vantagens da POO no Contexto do Projeto

| Aspecto | POO | Estruturada |
|---------|-----|-------------|
| **Manutenibilidade** | ⭐⭐⭐⭐⭐ Mudanças localizadas em classes específicas | ⭐⭐ Mudanças podem afetar múltiplas funções |
| **Reusabilidade** | ⭐⭐⭐⭐⭐ Classes podem ser reutilizadas em outros módulos | ⭐⭐ Funções podem ter dependências dispersas |
| **Escalabilidade** | ⭐⭐⭐⭐⭐ Fácil adicionar novos métodos ou estender classes | ⭐⭐⭐ Requer criação de mais funções soltas |
| **Organização** | ⭐⭐⭐⭐⭐ Código agrupado logicamente por classes | ⭐⭐ Funções podem ficar dispersas |
| **Proteção de Dados** | ⭐⭐⭐⭐⭐ Encapsulamento protege dados internos | ⭐ Dados expostos, sem proteção |
| **Testabilidade** | ⭐⭐⭐⭐⭐ Cada classe pode ser testada isoladamente | ⭐⭐⭐ Funções podem ter dependências cruzadas |

### 🔍 Desvantagens da POO (Contexto Geral)

1. **Complexidade Inicial:** Requer mais planejamento e design
2. **Overhead:** Mais código para implementar estruturas básicas
3. **Curva de Aprendizado:** Conceitos abstratos podem ser difíceis para iniciantes
4. **Performance:** Em alguns casos, pode ter overhead de memória (não relevante neste projeto)

### ✅ Por que POO é Superior Neste Projeto?

#### 1. Manutenibilidade
**Cenário:** Adicionar validação de data futura nos eventos

**POO:**
```javascript
// Apenas modificar a classe Evento
setData(data) {
  const dataEvento = new Date(data);
  const hoje = new Date();
  if (dataEvento < hoje) {
    throw new Error('Data deve ser futura');
  }
  this.#data = data;
}
```
✅ Mudança em **1 lugar**

**Estruturada:**
```javascript
// Precisa modificar todas as funções que criam/atualizam eventos
function criarEvento(...) {
  if (new Date(data) < new Date()) throw new Error(...);
  // ...
}
function atualizarEvento(...) {
  if (new Date(data) < new Date()) throw new Error(...);
  // ...
}
```
❌ Mudança em **N lugares**

#### 2. Reusabilidade
**POO:** A classe `Evento` pode ser importada e usada em qualquer módulo
```javascript
import Evento from './models/Evento';
const evento = new Evento(...);
```

**Estruturada:** Precisa copiar/importar múltiplas funções relacionadas
```javascript
import { criarEvento, validarEvento, salvarEvento } from './eventos';
```

#### 3. Escalabilidade
**POO:** Adicionar novas funcionalidades é simples
```javascript
class Evento {
  // ...métodos existentes...

  // Novo método - não quebra código existente
  calcularDiasRestantes() {
    const hoje = new Date();
    const dataEvento = new Date(this.#data);
    return Math.floor((dataEvento - hoje) / (1000 * 60 * 60 * 24));
  }
}
```

---

## 🎯 Conclusão

A Programação Orientada a Objetos é **superior** para este projeto pelos seguintes motivos:

1. **Proteção de Dados:** Encapsulamento garante integridade
2. **Organização:** Código limpo e bem estruturado em classes
3. **Manutenção:** Mudanças localizadas facilitam evolução
4. **Escalabilidade:** Fácil adicionar novas funcionalidades
5. **Profissionalismo:** Padrão da indústria para sistemas complexos

Para projetos pequenos e scripts simples, a programação estruturada pode ser suficiente. Porém, para sistemas que crescem e precisam de manutenção, **POO é essencial**.

---

## 📚 Conceitos Aplicados - Resumo

| Conceito | Onde Foi Aplicado | Benefício |
|----------|-------------------|-----------|
| **Encapsulamento** | Classes Evento e Participante com atributos privados (#) | Proteção e validação de dados |
| **Abstração** | Separação em camadas (Model, Service, Repository, Route) | Redução de complexidade |
| **Repository Pattern** | Classes EventoRepository, ParticipanteRepository, InscricaoRepository | Abstração total do banco de dados |
| **Dependency Injection** | Constructor injection nos Services | Desacoplamento e testabilidade |
| **Validação Integrada** | Métodos validar() e setters nas classes | Integridade de dados |
| **Single Responsibility** | Cada classe tem uma única responsabilidade | Código mais limpo e manutenível |
| **Factory Methods** | Métodos fromObject() e toObject() | Conversão entre formatos |

---

**Data:** Novembro 2025
**Projeto:** Sistema de Gestão de Eventos - SENAI
