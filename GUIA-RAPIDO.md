# 🚀 Guia Rápido de Configuração

## Passo a Passo para Rodar o Projeto

### 1️⃣ Configurar Supabase (5 minutos)

1. Acesse https://supabase.com
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name:** gestao-eventos
   - **Database Password:** Escolha uma senha forte
   - **Region:** Escolha a mais próxima
5. Aguarde a criação do projeto (1-2 minutos)

### 2️⃣ Criar Tabelas no Banco (2 minutos)

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie **TODO** o conteúdo do arquivo `database-setup.sql`
4. Cole no editor e clique em **Run**
5. Você verá mensagens de sucesso confirmando a criação das tabelas

### 3️⃣ Copiar Credenciais (1 minuto)

1. No Supabase, vá em **Settings** (ícone de engrenagem) > **API**
2. Copie dois valores:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon/public key** (uma chave longa começando com "eyJ...")

### 4️⃣ Configurar Variáveis de Ambiente (1 minuto)

1. Abra o arquivo `.env.example`
2. Copie o conteúdo para um novo arquivo chamado `.env`
3. Cole suas credenciais:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

### 5️⃣ Instalar e Executar (2 minutos)

Abra o terminal no diretório do projeto:

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3000
📚 API disponível em http://localhost:3000/api
```

### 6️⃣ Acessar Aplicação

Abra o navegador e acesse:
```
http://localhost:3000
```

Pronto! 🎉

---

## 🧪 Testando a Aplicação

### Criar um Evento
1. Clique em "Novo Evento"
2. Preencha:
   - Nome: Workshop de Node.js
   - Data: Escolha uma data futura
   - Local: Sala A
   - Vagas: 30
   - Descrição: Aprenda Node.js na prática
3. Clique em "Salvar"

### Criar um Participante
1. Clique na aba "Participantes"
2. Clique em "Novo Participante"
3. Preencha:
   - Nome: Seu nome
   - Email: seu@email.com
4. Clique em "Salvar"

### Fazer uma Inscrição
1. Clique na aba "Inscrições"
2. Clique em "Nova Inscrição"
3. Selecione o evento e o participante
4. Observe o contador de vagas
5. Clique em "Inscrever"

---

## 🐛 Problemas Comuns

### "Erro ao conectar com Supabase"
- ✅ Verifique se o arquivo `.env` existe (não é `.env.example`)
- ✅ Confirme se as credenciais estão corretas
- ✅ Certifique-se de não ter espaços extras nas variáveis

### "Tabela não existe"
- ✅ Execute o script `database-setup.sql` no SQL Editor do Supabase
- ✅ Verifique se as tabelas foram criadas em **Database** > **Tables**

### "Email já cadastrado"
- ✅ Isso é normal! O sistema impede emails duplicados
- ✅ Use outro email ou edite o participante existente

### Porta 3000 em uso
- ✅ Mude a porta no arquivo `.env`: `PORT=3001`
- ✅ Acesse http://localhost:3001

---

## 📱 Verificar Dados no Supabase

Para ver os dados diretamente no banco:

1. Acesse o Supabase
2. Vá em **Table Editor**
3. Selecione a tabela: `eventos`, `participantes` ou `evento_participante`
4. Você verá todos os registros criados

---

## 🎓 Para a Apresentação (Etapa 3)

### Trechos de Código para Análise de POO

**Melhor exemplo de Encapsulamento:**
- Arquivo: `backend/models/Evento.js`
- Linhas: 9-17 (atributos privados #)
- Linhas: 45-51 (setter com validação)

**Melhor exemplo de Repository Pattern:** 🆕
- Arquivo: `backend/repositories/EventoRepository.js`
- Linhas: 13-42 (abstração completa do banco de dados)

**Melhor exemplo de Dependency Injection:** 🆕
- Arquivo: `backend/services/EventoService.js`
- Linhas: 14-18 (constructor com injeção de dependências)

**Melhor exemplo de Abstração:**
- Arquivo: `backend/services/EventoService.js`
- Linhas: 21-36 (método criar delegando ao Repository)

**Comparação com Estruturado:**
- Documento completo: `ANALISE-POO.md`

---

## 📚 Estrutura de Apresentação Sugerida

1. **Introdução (2 min)**
   - Apresentar o problema: Gestão de eventos é complexa
   - Solução: Sistema web completo

2. **Demonstração (3 min)**
   - Mostrar CRUD de eventos
   - Mostrar CRUD de participantes
   - Fazer uma inscrição ao vivo

3. **Arquitetura (2 min)**
   - Explicar camadas: Frontend, Backend, Banco
   - Mostrar diagrama do modelo de dados

4. **Análise POO (3 min)** ⭐ **MAIS IMPORTANTE**
   - Mostrar classe Evento com encapsulamento (atributos privados #)
   - Explicar Repository Pattern (abstração total do banco)
   - Explicar Dependency Injection (Services recebem Repositories)
   - Mostrar separação em 4 camadas: Models → Repositories → Services → Routes
   - Comparar com código estruturado
   - Destacar vantagens: manutenibilidade, testabilidade, escalabilidade

5. **Conclusão (1 min)**
   - Resumir tecnologias usadas
   - Destacar conceitos de POO aplicados

---

## ✅ Checklist Antes da Apresentação

- [ ] Banco de dados configurado e funcionando
- [ ] Aplicação rodando sem erros
- [ ] Pelo menos 2 eventos cadastrados
- [ ] Pelo menos 3 participantes cadastrados
- [ ] Algumas inscrições criadas
- [ ] Preparar explicação dos conceitos de POO:
  - [ ] Encapsulamento (atributos privados)
  - [ ] Repository Pattern (abstração do banco) 🆕
  - [ ] Dependency Injection (injeção de dependências) 🆕
  - [ ] Abstração em 4 camadas
- [ ] Ter o arquivo `ANALISE-POO.md` aberto
- [ ] Ter o código da classe `Evento.js` aberto
- [ ] Ter o código do `EventoRepository.js` aberto 🆕

---

**Boa sorte na apresentação! 🚀**
