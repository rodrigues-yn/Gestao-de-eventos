// Configuração da API
const API_BASE_URL = "https://gestao-de-eventos-api.onrender.com/api";
const API_URL = `${API_BASE_URL}`;



// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    inicializarAbas();
    carregarEventos();
    carregarParticipantes();
    carregarInscricoes();
});

// Sistema de abas
function inicializarAbas() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Adiciona classe active no botão clicado
            button.classList.add('active');

            // Mostra o conteúdo correspondente
            const tabName = button.dataset.tab;
            document.getElementById(`${tabName}-section`).classList.add('active');

            // Recarrega dados da aba ativa
            if (tabName === 'eventos') {
                carregarEventos();
            } else if (tabName === 'participantes') {
                carregarParticipantes();
            } else if (tabName === 'inscricoes') {
                carregarInscricoes();
            }
        });
    });
}

// Sistema de alertas
function mostrarAlerta(mensagem, tipo = 'info') {
    // Cria elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `info-box ${tipo}`;
    alerta.style.position = 'fixed';
    alerta.style.top = '20px';
    alerta.style.right = '20px';
    alerta.style.zIndex = '10000';
    alerta.style.minWidth = '300px';
    alerta.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

    alerta.innerHTML = `<p>${mensagem}</p>`;

    document.body.appendChild(alerta);

    // Remove após 4 segundos
    setTimeout(() => {
        alerta.style.opacity = '0';
        alerta.style.transition = 'opacity 0.3s ease';
        setTimeout(() => alerta.remove(), 300);
    }, 4000);
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
};

// ===== GERENCIAMENTO DE INSCRIÇÕES =====

// Carregar inscrições
async function carregarInscricoes() {
    try {
        const response = await fetch(`${API_URL}/inscricoes`);
        const inscricoes = await response.json();

        const tbody = document.getElementById('inscricoes-tbody');

        if (inscricoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Nenhuma inscrição registrada</td></tr>';
            return;
        }

        tbody.innerHTML = inscricoes.map(inscricao => `
            <tr>
                <td>${inscricao.eventos.nome}</td>
                <td>${inscricao.participantes.nome}</td>
                <td>${inscricao.participantes.email}</td>
                <td>${formatarDataHora(inscricao.data_inscricao)}</td>
                <td>
                    <button class="btn btn-delete" onclick="cancelarInscricao('${inscricao.id}', '${inscricao.eventos.nome}', '${inscricao.participantes.nome}')">
                        Cancelar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
        mostrarAlerta('Erro ao carregar inscrições', 'error');
    }
}

// Abrir modal de inscrição
async function abrirModalInscricao() {
    try {
        // Carregar eventos para o select
        const responseEventos = await fetch(`${API_URL}/eventos`);
        const eventos = await responseEventos.json();

        const selectEvento = document.getElementById('inscricao-evento');
        selectEvento.innerHTML = '<option value="">Selecione um evento</option>' +
            eventos.map(e => `<option value="${e.id}">${e.nome} - ${formatarData(e.data)}</option>`).join('');

        // Carregar participantes para o select
        const responseParticipantes = await fetch(`${API_URL}/participantes`);
        const participantes = await responseParticipantes.json();

        const selectParticipante = document.getElementById('inscricao-participante');
        selectParticipante.innerHTML = '<option value="">Selecione um participante</option>' +
            participantes.map(p => `<option value="${p.id}">${p.nome} (${p.email})</option>`).join('');

        // Adicionar listener para verificar vagas quando evento for selecionado
        selectEvento.addEventListener('change', verificarVagasEvento);

        document.getElementById('form-inscricao').reset();
        document.getElementById('vagas-info').style.display = 'none';
        document.getElementById('modal-inscricao').classList.add('active');
    } catch (error) {
        console.error('Erro ao abrir modal de inscrição:', error);
        mostrarAlerta('Erro ao carregar dados para inscrição', 'error');
    }
}

// Fechar modal de inscrição
function fecharModalInscricao() {
    document.getElementById('modal-inscricao').classList.remove('active');
}

// Verificar vagas disponíveis do evento selecionado
async function verificarVagasEvento() {
    const eventoId = document.getElementById('inscricao-evento').value;
    const vagasInfo = document.getElementById('vagas-info');
    const btnInscrever = document.getElementById('btn-inscrever');

    if (!eventoId) {
        vagasInfo.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/eventos/${eventoId}/vagas`);
        const vagas = await response.json();

        vagasInfo.style.display = 'block';

        if (vagas.tem_vagas) {
            vagasInfo.className = 'info-box success';
            vagasInfo.innerHTML = `<p>Vagas disponíveis: ${vagas.vagas_disponiveis} de ${vagas.total_vagas}</p>`;
            btnInscrever.disabled = false;
        } else {
            vagasInfo.className = 'info-box error';
            vagasInfo.innerHTML = `<p>⚠️ Evento lotado! Não há vagas disponíveis.</p>`;
            btnInscrever.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao verificar vagas:', error);
    }
}

// Salvar inscrição
async function salvarInscricao(event) {
    event.preventDefault();

    const dados = {
        evento_id: document.getElementById('inscricao-evento').value,
        participante_id: document.getElementById('inscricao-participante').value
    };

    try {
        const response = await fetch(`${API_URL}/inscricoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao realizar inscrição');
        }

        mostrarAlerta('Inscrição realizada com sucesso!', 'success');
        fecharModalInscricao();
        carregarInscricoes();
    } catch (error) {
        console.error('Erro ao salvar inscrição:', error);
        mostrarAlerta(error.message, 'error');
    }
}

// Cancelar inscrição
async function cancelarInscricao(inscricaoId, nomeEvento, nomeParticipante) {
    if (!confirm(`Tem certeza que deseja cancelar a inscrição de "${nomeParticipante}" no evento "${nomeEvento}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/inscricoes/${inscricaoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao cancelar inscrição');
        }

        mostrarAlerta('Inscrição cancelada com sucesso!', 'success');
        carregarInscricoes();
    } catch (error) {
        console.error('Erro ao cancelar inscrição:', error);
        mostrarAlerta(error.message, 'error');
    }
}
