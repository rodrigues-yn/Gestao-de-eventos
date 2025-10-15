// Gerenciamento de Eventos - CRUD completo

// Carregar eventos ao iniciar
async function carregarEventos() {
    try {
        const response = await fetch(`${API_URL}/eventos`);
        const eventos = await response.json();

        const tbody = document.getElementById('eventos-tbody');

        if (eventos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Nenhum evento cadastrado</td></tr>';
            return;
        }

        tbody.innerHTML = eventos.map(evento => `
            <tr>
                <td>${evento.nome}</td>
                <td>${formatarData(evento.data)}</td>
                <td>${evento.local}</td>
                <td>${evento.numero_vagas}</td>
                <td>${evento.descricao || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-view" onclick="verParticipantesEvento('${evento.id}', '${evento.nome}')">
                            Ver Participantes
                        </button>
                        <button class="btn btn-edit" onclick="editarEvento('${evento.id}')">
                            Editar
                        </button>
                        <button class="btn btn-delete" onclick="excluirEvento('${evento.id}', '${evento.nome}')">
                            Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        mostrarAlerta('Erro ao carregar eventos', 'error');
    }
}

// Abrir modal para novo evento
function abrirModalEvento() {
    document.getElementById('modal-evento-title').textContent = 'Novo Evento';
    document.getElementById('form-evento').reset();
    document.getElementById('evento-id').value = '';
    document.getElementById('modal-evento').classList.add('active');
}

// Fechar modal de evento
function fecharModalEvento() {
    document.getElementById('modal-evento').classList.remove('active');
}

// Salvar evento (criar ou atualizar)
async function salvarEvento(event) {
    event.preventDefault();

    const id = document.getElementById('evento-id').value;
    const dados = {
        nome: document.getElementById('evento-nome').value,
        data: document.getElementById('evento-data').value,
        local: document.getElementById('evento-local').value,
        numero_vagas: parseInt(document.getElementById('evento-vagas').value),
        descricao: document.getElementById('evento-descricao').value
    };

    try {
        let response;
        if (id) {
            // Atualizar
            response = await fetch(`${API_URL}/eventos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            // Criar
            response = await fetch(`${API_URL}/eventos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao salvar evento');
        }

        mostrarAlerta(id ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!', 'success');
        fecharModalEvento();
        carregarEventos();
    } catch (error) {
        console.error('Erro ao salvar evento:', error);
        mostrarAlerta(error.message, 'error');
    }
}

// Editar evento
async function editarEvento(id) {
    try {
        const response = await fetch(`${API_URL}/eventos/${id}`);
        const evento = await response.json();

        document.getElementById('modal-evento-title').textContent = 'Editar Evento';
        document.getElementById('evento-id').value = evento.id;
        document.getElementById('evento-nome').value = evento.nome;
        document.getElementById('evento-data').value = evento.data;
        document.getElementById('evento-local').value = evento.local;
        document.getElementById('evento-vagas').value = evento.numero_vagas;
        document.getElementById('evento-descricao').value = evento.descricao || '';

        document.getElementById('modal-evento').classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar evento:', error);
        mostrarAlerta('Erro ao carregar dados do evento', 'error');
    }
}

// Excluir evento
async function excluirEvento(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o evento "${nome}"?\n\nEsta ação também removerá todas as inscrições relacionadas.`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/eventos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao excluir evento');
        }

        mostrarAlerta('Evento excluído com sucesso!', 'success');
        carregarEventos();
    } catch (error) {
        console.error('Erro ao excluir evento:', error);
        mostrarAlerta(error.message, 'error');
    }
}

// Ver participantes de um evento
async function verParticipantesEvento(eventoId, nomeEvento) {
    try {
        const response = await fetch(`${API_URL}/eventos/${eventoId}/participantes`);
        const participantes = await response.json();

        if (participantes.length === 0) {
            alert(`O evento "${nomeEvento}" ainda não tem participantes inscritos.`);
            return;
        }

        const lista = participantes.map(p =>
            `• ${p.nome} (${p.email}) - Inscrito em ${formatarDataHora(p.data_inscricao)}`
        ).join('\n');

        alert(`Participantes do evento "${nomeEvento}":\n\n${lista}`);
    } catch (error) {
        console.error('Erro ao carregar participantes:', error);
        mostrarAlerta('Erro ao carregar participantes do evento', 'error');
    }
}

// Função auxiliar para formatar data
function formatarData(data) {
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

// Função auxiliar para formatar data e hora
function formatarDataHora(dataHora) {
    const d = new Date(dataHora);
    return d.toLocaleString('pt-BR');
}
