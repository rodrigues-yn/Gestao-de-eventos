# 🏗️ Arquitetura do Sistema - Gestão de Eventos

## 📊 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Cliente)                      │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │
│  │  │ index.   │  │ styles.  │  │   app.   │               │  │
│  │  │  html    │  │   css    │  │    js    │               │  │
│  │  └──────────┘  └──────────┘  └──────────┘               │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────────┐                          │  │
│  │  │ eventos. │  │ participantes.│                          │  │
│  │  │   js     │  │     js       │                          │  │
│  │  └──────────┘  └──────────────┘                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
                         │ (JSON)
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (Servidor)                            │
│                      Node.js + Express                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    CAMADA DE ROTAS                         │  │
│  │  ┌──────────────┐ ┌─────────────────┐ ┌───────────────┐  │  │
│  │  │ eventoRoutes │ │participanteRoutes│ │inscricaoRoutes│  │  │
│  │  └──────┬───────┘ └────────┬─────────┘ └───────┬───────┘  │  │
│  └─────────┼──────────────────┼───────────────────┼──────────┘  │
│            │                  │                   │              │
│  ┌─────────▼──────────────────▼───────────────────▼──────────┐  │
│  │                 CAMADA DE SERVIÇOS (POO)                   │  │
│  │  ┌───────────────┐ ┌──────────────────┐ ┌──────────────┐ │  │
│  │  │ EventoService │ │ParticipanteService│ │InscricaoServ.│ │  │
│  │  │(Dependency    │ │(Dependency        │ │(Dependency   │ │  │
│  │  │ Injection)    │ │ Injection)        │ │ Injection)   │ │  │
│  │  └───────┬───────┘ └────────┬──────────┘ └──────┬───────┘ │  │
│  └──────────┼──────────────────┼────────────────────┼─────────┘  │
│             │                  │                    │             │
│  ┌──────────▼──────────────────▼────────────────────▼─────────┐  │
│  │            CAMADA DE REPOSITORIES (Repository Pattern)      │  │
│  │  ┌─────────────────┐ ┌──────────────────────┐ ┌─────────┐ │  │
│  │  │EventoRepository │ │ParticipanteRepository│ │Inscricao│ │  │
│  │  │                 │ │                      │ │Repository│ │  │
│  │  │ - Abstração DB  │ │  - Abstração DB      │ │- Abstr. │ │  │
│  │  └────────┬────────┘ └──────────┬───────────┘ └────┬────┘ │  │
│  └───────────┼───────────────────────┼──────────────────┼──────┘  │
│              │                       │                  │          │
│  ┌───────────▼───────────────────────▼──────────────────▼──────┐  │
│  │                  CAMADA DE MODELOS (POO)                     │  │
│  │     ┌──────────────────┐      ┌─────────────────────┐       │  │
│  │     │  Classe Evento   │      │ Classe Participante │       │  │
│  │     │                  │      │                     │       │  │
│  │     │ - Encapsulamento │      │  - Encapsulamento   │       │  │
│  │     │ - Validação      │      │  - Validação        │       │  │
│  │     │ - Getters/Setters│      │  - Getters/Setters  │       │  │
│  │     └──────────────────┘      └─────────────────────┘       │  │
│  └──────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────────┘
                              │ Supabase Client
                              │ (@supabase/supabase-js)
┌─────────────────────────────▼───────────────────────────────────┐
│                        BANCO DE DADOS                            │
│                    PostgreSQL (Supabase)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ┌──────────┐    ┌──────────────┐    ┌────────────────┐  │  │
│  │  │ eventos  │    │participantes │    │evento_partici- │  │  │
│  │  │          │    │              │    │    pante       │  │  │
│  │  │ - id     │◄───┤              │───►│                │  │  │
│  │  │ - nome   │    │ - id         │    │ - evento_id    │  │  │
│  │  │ - data   │    │ - nome       │    │ - participan-  │  │  │
│  │  │ - local  │    │ - email      │    │   te_id        │  │  │
│  │  │ - vagas  │    │              │    │ - data_inscr.  │  │  │
│  │  └──────────┘    └──────────────┘    └────────────────┘  │  │
│  │                                                            │  │
│  │            Relacionamento N:N (Muitos para Muitos)        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados (Exemplo: Criar Evento)

```
1. USUÁRIO                  → Clica em "Novo Evento" e preenche formulário
                              ↓
2. FRONTEND (eventos.js)    → Captura dados do formulário
                              ↓
3. FRONTEND (app.js)        → POST /api/eventos com JSON
                              ↓
4. BACKEND (eventoRoutes)   → Recebe requisição HTTP
                              ↓
5. BACKEND (EventoService)  → Cria instância da classe Evento
                              ↓
6. MODELO (Evento)          → Valida dados (POO: Encapsulamento)
                              ↓
7. SERVICE                  → Delega ao Repository (Abstração)
                              ↓
8. REPOSITORY (EventoRepo)  → Chama Supabase (Repository Pattern)
                              ↓
9. SUPABASE                 → Insere no PostgreSQL
                              ↓
10. SUPABASE                → Retorna dados inseridos
                              ↓
11. REPOSITORY              → Converte para objeto Evento (Factory)
                              ↓
12. SERVICE                 → Retorna Evento ao Route
                              ↓
13. ROUTES                  → Retorna JSON ao cliente
                              ↓
14. FRONTEND                → Atualiza tabela na tela
                              ↓
15. USUÁRIO                 → Vê evento criado na lista
```

---

## 🎯 Separação de Responsabilidades (POO)

### Camada 1: MODELOS (Models)
**Responsabilidade:** Estrutura de dados e validação

```javascript
class Evento {
  #nome;  // Atributo privado (Encapsulamento)

  validar() {  // Método de validação (Abstração)
    // Lógica de validação centralizada
  }
}
```

**Conceitos POO:**
- ✅ Encapsulamento (atributos privados)
- ✅ Validação integrada
- ✅ Métodos getters/setters

---

### Camada 2: REPOSITORIES (Repositories) - 🆕
**Responsabilidade:** Acesso ao banco de dados

```javascript
class EventoRepository {
  async create(evento) {
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento.toObject()])
      .select();
    // ...
  }
}
```

**Conceitos POO:**
- ✅ Repository Pattern (abstração total do BD)
- ✅ Single Responsibility (só acessa dados)
- ✅ Encapsulamento da lógica de persistência

---

### Camada 3: SERVIÇOS (Services)
**Responsabilidade:** Lógica de negócio

```javascript
class EventoService {
  constructor() {
    this.eventoRepository = new EventoRepository();  // Dependency Injection
  }

  async criar(dados) {
    const evento = new Evento(...);           // Usa o modelo
    evento.validar();                         // Abstração da validação
    return await this.eventoRepository.create(evento);  // Usa Repository
  }
}
```

**Conceitos POO:**
- ✅ Abstração (oculta complexidade)
- ✅ Dependency Injection (recebe dependências)
- ✅ Separação de responsabilidades
- ✅ Reusabilidade

---

### Camada 4: ROTAS (Routes)
**Responsabilidade:** Interface HTTP

```javascript
router.post('/', async (req, res) => {
  const evento = await EventoService.criar(req.body);
  res.json(evento);
});
```

**Conceitos:**
- ✅ Abstração da comunicação HTTP
- ✅ Desacoplamento (não conhece detalhes do banco)

---

## 📦 Tecnologias e Justificativas

| Tecnologia | Justificativa | Alternativa |
|------------|---------------|-------------|
| **Node.js** | JavaScript full-stack, alta performance, ecossistema rico | Python + Flask |
| **Express** | Framework minimalista e flexível | Fastify, Koa |
| **Supabase** | PostgreSQL gerenciado, fácil configuração, SDK completo | MySQL + Sequelize |
| **HTML/CSS/JS** | Sem dependências, leve, requisito do projeto | React, Vue |
| **POO** | Código organizado, manutenível, escalável | Funcional, Estruturado |

---

## 🗂️ Estrutura de Arquivos

```
gestao-eventos/
│
├── 📄 README.md              # Documentação principal
├── 📄 GUIA-RAPIDO.md         # Início rápido
├── 📄 ANALISE-POO.md         # Análise técnica de POO
├── 📄 ARQUITETURA.md         # Este arquivo
├── 📄 database-setup.sql     # Scripts do banco
├── 📄 package.json           # Dependências
├── 📄 .env.example           # Exemplo de variáveis
├── 📄 .gitignore            # Arquivos ignorados
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── supabase.js      # Cliente Supabase
│   │
│   ├── 📁 models/           # 🎯 CAMADA 1: Estrutura de dados (POO)
│   │   ├── Evento.js        # Classe com encapsulamento
│   │   └── Participante.js  # Classe com encapsulamento
│   │
│   ├── 📁 repositories/     # 🎯 CAMADA 2: Acesso a dados (Repository Pattern) 🆕
│   │   ├── EventoRepository.js
│   │   ├── ParticipanteRepository.js
│   │   └── InscricaoRepository.js
│   │
│   ├── 📁 services/         # 🎯 CAMADA 3: Lógica de negócio (POO)
│   │   ├── EventoService.js
│   │   ├── ParticipanteService.js
│   │   └── InscricaoService.js
│   │
│   ├── 📁 routes/           # 🎯 CAMADA 4: Endpoints HTTP
│   │   ├── eventoRoutes.js
│   │   ├── participanteRoutes.js
│   │   └── inscricaoRoutes.js
│   │
│   └── server.js            # Servidor Express
│
└── 📁 frontend/
    ├── index.html           # Interface principal
    │
    ├── 📁 css/
    │   └── styles.css       # Estilos visuais
    │
    └── 📁 js/
        ├── app.js           # Lógica principal + inscrições
        ├── eventos.js       # CRUD de eventos
        └── participantes.js # CRUD de participantes
```

---

## 🔐 Segurança e Boas Práticas

### ✅ Implementadas

1. **Validação no Backend**
   - Dados validados antes de inserir no banco
   - Prevenção de SQL injection (Supabase SDK)

2. **Validação de Email Único**
   - Constraint no banco de dados
   - Verificação no service

3. **Encapsulamento de Dados**
   - Atributos privados nas classes
   - Acesso apenas por getters/setters

4. **Tratamento de Erros**
   - Try/catch em todas as operações
   - Mensagens amigáveis ao usuário

5. **Variáveis de Ambiente**
   - Credenciais fora do código
   - .env no .gitignore

### 🔜 Melhorias Futuras (Não implementadas no MVP)

- Autenticação de usuário admin
- Rate limiting na API
- Logs de auditoria
- Paginação nas listagens
- Cache de consultas
- Testes automatizados

---

## 📈 Escalabilidade

### Como Adicionar Novas Funcionalidades

#### Exemplo 1: Adicionar campo "capacidade máxima"
```javascript
// 1. Atualizar MODEL
class Evento {
  #capacidadeMaxima;

  getCapacidadeMaxima() { return this.#capacidadeMaxima; }
}

// 2. Atualizar SERVICE (se necessário)
// 3. Atualizar ROUTE (se necessário)
// 4. Atualizar FRONTEND
```

#### Exemplo 2: Adicionar nova entidade "Palestrante"
```javascript
// 1. Criar MODEL: Palestrante.js
// 2. Criar REPOSITORY: PalestranteRepository.js 🆕
// 3. Criar SERVICE: PalestranteService.js
// 4. Criar ROUTE: palestranteRoutes.js
// 5. Atualizar frontend com nova aba
```

---

## 🎓 Conceitos de Engenharia de Software Aplicados

| Conceito | Onde Foi Aplicado |
|----------|-------------------|
| **POO** | Classes Evento e Participante |
| **Encapsulamento** | Atributos privados (#) |
| **Abstração** | Separação em camadas (Models, Repositories, Services, Routes) |
| **Repository Pattern** | Classes EventoRepository, ParticipanteRepository, InscricaoRepository 🆕 |
| **Dependency Injection** | Constructor injection nos Services 🆕 |
| **Separação de Responsabilidades** | Cada camada com função específica |
| **Single Responsibility Principle** | Cada classe tem uma única responsabilidade |
| **DRY (Don't Repeat Yourself)** | Reutilização de classes e repositories |
| **API RESTful** | Endpoints seguem padrão REST |
| **MVC (adaptado)** | Model-Repository-Service-Controller |

---

**Sistema desenvolvido seguindo as melhores práticas de Engenharia de Software** ✅
