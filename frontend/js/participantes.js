// Gerenciamento de Participantes - CRUD completo

// Carregar participantes ao iniciar
async function carregarParticipantes() {
    try {
        const response = await fetch(`${API_URL}/participantes`);
        const participantes = await response.json();

        const tbody = document.getElementById('participantes-tbody');

        if (participantes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="loading">Nenhum participante cadastrado</td></tr>';
            return;
        }

        tbody.innerHTML = participantes.map(participante => `
            <tr>
                <td>${participante.nome}</td>
                <td>${participante.email}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-view" onclick="verEventosParticipante('${participante.id}', '${participante.nome}')">
                            Ver Eventos
                        </button>
                        <button class="btn btn-edit" onclick="editarParticipante('${participante.id}')">
                            Editar
                        </button>
                        <button class="btn btn-delete" onclick="excluirParticipante('${participante.id}', '${participante.nome}')">
                            Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar participantes:', error);
        mostrarAlerta('Erro ao carregar participantes', 'error');
    }
}

// Abrir modal para novo participante
function abrirModalParticipante() {
    document.getElementById('modal-participante-title').textContent = 'Novo Participante';
    document.getElementById('form-participante').reset();
    document.getElementById('participante-id').value = '';
    document.getElementById('modal-participante').classList.add('active');
}

// Fechar modal de participante
function fecharModalParticipante() {
    document.getElementById('modal-participante').classList.remove('active');
}

// Salvar participante (criar ou atualizar)
async function salvarParticipante(event) {
    event.preventDefault();

    const id = document.getElementById('participante-id').value;
    const dados = {
        nome: document.getElementById('participante-nome').value,
        email: document.getElementById('participante-email').value
    };

    try {
        let response;
        if (id) {
            // Atualizar
            response = await fetch(`${API_URL}/participantes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            // Criar
            response = await fetch(`${API_URL}/participantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao salvar participante');
        }

        mostrarAlerta(id ? 'Participante atualizado com sucesso!' : 'Participante criado com sucesso!', 'success');
        fecharModalParticipante();
        carregarParticipantes();
    } catch (error) {
        console.error('Erro ao salvar participante:', error);
        mostrarAlerta(error.message, 'error');
    }
}

// Editar participante
async function editarParticipante(id) {
    try {
        const response = await fetch(`${API_URL}/participantes/${id}`);
        const participante = await response.json();

        document.getElementById('modal-participante-title').textContent = 'Editar Participante';
        document.getElementById('participante-id').value = participante.id;
        document.getElementById('participante-nome').value = participante.nome;
        document.getElementById('participante-email').value = participante.email;

        document.getElementById('modal-participante').classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar participante:', error);
        mostrarAlerta('Erro ao carregar dados do participante', 'error');
    }
}

// Excluir participante
async function excluirParticipante(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o participante "${nome}"?\n\nEsta ação também removerá todas as inscrições relacionadas.`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/participantes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao excluir participante');
        }

        mostrarAlerta('Participante excluído com sucesso!', 'success');
        carregarParticipantes();
    } catch (error) {
        console.error('Erro ao excluir participante:', error);
        mostrarAlerta(error.message, 'error');
    }
}

// Ver eventos de um participante
async function verEventosParticipante(participanteId, nomeParticipante) {
    try {
        const response = await fetch(`${API_URL}/participantes/${participanteId}/eventos`);
        const eventos = await response.json();

        if (eventos.length === 0) {
            alert(`${nomeParticipante} ainda não está inscrito(a) em nenhum evento.`);
            return;
        }

        const lista = eventos.map(e =>
            `• ${e.nome} - ${formatarData(e.data)} - ${e.local}\n  Inscrito em ${formatarDataHora(e.data_inscricao)}`
        ).join('\n\n');

        alert(`Eventos de ${nomeParticipante}:\n\n${lista}`);
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        mostrarAlerta('Erro ao carregar eventos do participante', 'error');
    }
}
