# Sistema de Gestão de Eventos

Sistema completo de gestão de eventos desenvolvido como trabalho técnico do curso SENAI. Aplicação full-stack que permite gerenciar eventos, participantes e inscrições através de um painel administrativo.

## 📋 Descrição do Projeto

Este projeto resolve o problema de organização e controle de eventos, facilitando:
- Cadastro e gerenciamento de eventos
- Controle de participantes
- Inscrições com validação de vagas disponíveis
- Visualização de participantes por evento e eventos por participante

## 🏗️ Arquitetura Técnica

### Backend
- **Node.js** com Express
- **Programação Orientada a Objetos (POO)**
- Padrão de arquitetura em camadas:
  - **Models**: Classes com encapsulamento (Evento, Participante)
  - **Repositories**: Abstração do acesso ao banco de dados (Repository Pattern)
  - **Services**: Lógica de negócio com Dependency Injection
  - **Routes**: Endpoints da API REST

### Frontend
- **HTML5** puro (sem frameworks)
- **CSS3** com design moderno para desktop
- **JavaScript** vanilla para interatividade

### Banco de Dados
- **PostgreSQL** via **Supabase**
- 3 tabelas com relacionamento N:N

## 📊 Modelo de Dados

### Tabela: eventos
```sql
CREATE TABLE eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    local VARCHAR(255) NOT NULL,
    numero_vagas INTEGER NOT NULL CHECK (numero_vagas > 0),
    descricao TEXT
);
```

### Tabela: participantes
```sql
CREATE TABLE participantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
```

### Tabela: evento_participante
```sql
CREATE TABLE evento_participante (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    participante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
    data_inscricao TIMESTAMP DEFAULT NOW(),
    UNIQUE(evento_id, participante_id)
);
```

## 🚀 Como Configurar e Executar

### 1. Pré-requisitos
- Node.js (versão 16 ou superior)
- Conta no Supabase

### 2. Configurar Banco de Dados no Supabase

1. Acesse https://supabase.com e crie uma conta (se ainda não tiver)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute os comandos SQL acima para criar as tabelas
4. Em **Project Settings** > **API**, copie:
   - `Project URL` (SUPABASE_URL)
   - `anon/public` key (SUPABASE_KEY)

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_publica_aqui
PORT=3000
```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Executar o Servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

### 6. Acessar a Aplicação

Abra o navegador e acesse:
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
gestao-eventos/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Configuração do Supabase
│   ├── models/
│   │   ├── Evento.js            # Classe Evento (POO)
│   │   └── Participante.js      # Classe Participante (POO)
│   ├── repositories/            # 🆕 Repository Pattern
│   │   ├── EventoRepository.js  # Acesso a dados - Eventos
│   │   ├── ParticipanteRepository.js  # Acesso a dados - Participantes
│   │   └── InscricaoRepository.js     # Acesso a dados - Inscrições
│   ├── services/
│   │   ├── EventoService.js     # Lógica de negócio - Eventos
│   │   ├── ParticipanteService.js  # Lógica de negócio - Participantes
│   │   └── InscricaoService.js  # Lógica de negócio - Inscrições
│   ├── routes/
│   │   ├── eventoRoutes.js      # Rotas API - Eventos
│   │   ├── participanteRoutes.js   # Rotas API - Participantes
│   │   └── inscricaoRoutes.js   # Rotas API - Inscrições
│   └── server.js                # Servidor Express
├── frontend/
│   ├── css/
│   │   └── styles.css           # Estilos da aplicação
│   ├── js/
│   │   ├── app.js              # Lógica principal e inscrições
│   │   ├── eventos.js          # CRUD de eventos
│   │   └── participantes.js    # CRUD de participantes
│   └── index.html              # Interface principal
├── .env.example                # Exemplo de variáveis de ambiente
├── package.json                # Dependências do projeto
└── README.md                   # Este arquivo
```

## 🔌 API Endpoints

### Eventos
- `GET /api/eventos` - Listar todos os eventos
- `GET /api/eventos/:id` - Buscar evento por ID
- `POST /api/eventos` - Criar novo evento
- `PUT /api/eventos/:id` - Atualizar evento
- `DELETE /api/eventos/:id` - Remover evento
- `GET /api/eventos/:id/participantes` - Listar participantes do evento
- `GET /api/eventos/:id/vagas` - Verificar vagas disponíveis

### Participantes
- `GET /api/participantes` - Listar todos os participantes
- `GET /api/participantes/:id` - Buscar participante por ID
- `POST /api/participantes` - Criar novo participante
- `PUT /api/participantes/:id` - Atualizar participante
- `DELETE /api/participantes/:id` - Remover participante
- `GET /api/participantes/:id/eventos` - Listar eventos do participante

### Inscrições
- `GET /api/inscricoes` - Listar todas as inscrições
- `POST /api/inscricoes` - Criar nova inscrição
- `DELETE /api/inscricoes/:id` - Cancelar inscrição

## 💡 Funcionalidades Principais

✅ **CRUD Completo de Eventos**
- Criar, listar, editar e excluir eventos
- Controle de vagas disponíveis
- Validação de dados

✅ **CRUD Completo de Participantes**
- Cadastro com validação de email único
- Edição e exclusão de participantes
- Visualização de eventos inscritos

✅ **Sistema de Inscrições**
- Inscrição de participantes em eventos
- Validação de vagas disponíveis em tempo real
- Prevenção de inscrições duplicadas
- Cancelamento de inscrições

✅ **Interface Intuitiva**
- Navegação por abas
- Modais para formulários
- Alertas visuais de sucesso/erro
- Design responsivo para desktop

## 🎯 Conceitos de POO Aplicados

### 1. Encapsulamento
As classes `Evento` e `Participante` utilizam atributos privados (`#`) protegendo os dados internos:

```javascript
class Evento {
  #nome;
  #data;

  getNome() { return this.#nome; }
  setNome(nome) {
    if (!nome) throw new Error('Nome obrigatório');
    this.#nome = nome;
  }
}
```

### 2. Abstração
Separação clara em camadas oculta a complexidade:
- **Models**: Representação dos dados
- **Repositories**: Abstração do banco de dados (Repository Pattern)
- **Services**: Lógica de negócio abstraída
- **Routes**: Interface simples para o cliente

### 3. Repository Pattern
Encapsula toda lógica de acesso ao banco de dados:

```javascript
class EventoRepository {
  async create(evento) {
    // Toda interação com Supabase fica isolada aqui
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento.toObject()])
      .select();
    return Evento.fromObject(data);
  }
}
```

### 4. Dependency Injection
Services recebem dependências via construtor:

```javascript
class EventoService {
  constructor() {
    this.eventoRepository = new EventoRepository();
  }
}
```

### 5. Validação Integrada
Métodos de validação nas classes garantem integridade:

```javascript
validar() {
  if (!this.#nome) throw new Error('Nome obrigatório');
  if (!this.#email) throw new Error('Email obrigatório');
  return true;
}
```

## 🔍 Comparação: POO vs Programação Estruturada

### Vantagens da POO neste projeto:
- **Manutenibilidade**: Código organizado em classes facilita alterações
- **Reusabilidade**: Classes podem ser reutilizadas em outros contextos
- **Encapsulamento**: Dados protegidos com validação centralizada
- **Escalabilidade**: Fácil adicionar novos métodos ou estender classes

### Abordagem Estruturada (exemplo):
```javascript
// Sem POO - funções soltas
function validarEvento(nome, data, local, vagas) {
  if (!nome) return false;
  if (!data) return false;
  // ... validações dispersas
}

function criarEvento(dados) {
  if (!validarEvento(...)) return;
  // ... lógica misturada
}
```

## 👥 Autor

Trabalho desenvolvido para o curso técnico SENAI - Programação de Aplicativos

## 📄 Licença

MIT
