// Array para armazenar as transações
let transacoes = [];

// Carrega as transações do localStorage
function loadTransactions() {
    const storedTransactions = localStorage.getItem('transacoes');
    if (storedTransactions) {
        transacoes = JSON.parse(storedTransactions);
    }
}

// Renderiza a tabela com os dados fornecidos
function renderizarTabela(dados) {
    const tabelaBody = document.getElementById('transacoes-body');
    if (!tabelaBody) {
        return;
    }

    if (dados.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhuma transação encontrada.</td></tr>';
    } else {
        tabelaBody.innerHTML = dados.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>${t.titulo}</td>
                <td>${t.data}</td>
                <td>${t.banco}</td>
                <td>${t.movimento}</td>
                <td>R$ ${t.valor.toFixed(2).replace('.', ',')}</td>
                <td>${t.categoria}</td>
                <td>${t.descricao}</td>
            </tr>
        `).join('');
    }
}

// Função para filtrar as transações
function filtrarTransacoes() {
    const titulo = document.getElementById('filtro-titulo').value.toLowerCase();
    const banco = document.getElementById('filtro-banco').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value.toLowerCase();
    const mes = document.getElementById('filtro-mes').value;
    const ano = document.getElementById('filtro-ano').value;

    const inputDataInicio = document.getElementById('filtro-data-inicio').value;
    const inputDataFim = document.getElementById('filtro-data-fim').value;

    let dataInicio = null;
    if (inputDataInicio) {
        const d = new Date(inputDataInicio + 'T00:00:00');
        if (!isNaN(d.getTime())) {
            dataInicio = d;
        }
    }

    let dataFim = null;
    if (inputDataFim) {
        const d = new Date(inputDataFim + 'T00:00:00');
        if (!isNaN(d.getTime())) {
            dataFim = d;
        }
    }

    const dadosFiltrados = transacoes.filter(transacao => {
        const dataTransacao = new Date(transacao.data + 'T00:00:00');
        const transacaoMes = dataTransacao.getMonth() + 1;
        const transacaoAno = dataTransacao.getFullYear();

        const filtroTitulo = !titulo || transacao.titulo.toLowerCase().includes(titulo);
        const filtroBanco = !banco || transacao.banco.toLowerCase() === banco;
        const filtroCategoria = !categoria || transacao.categoria.toLowerCase() === categoria;
        const filtroMes = !mes || transacaoMes == mes;
        const filtroAno = !ano || transacaoAno == ano;
        const filtroDataInicio = !dataInicio || dataTransacao >= dataInicio;
        const filtroDataFim = !dataFim || dataTransacao <= dataFim;

        return filtroTitulo && filtroBanco && filtroCategoria && filtroMes && filtroAno && filtroDataInicio && filtroDataFim;
    });

    renderizarTabela(dadosFiltrados);
}

// Event listeners para os campos de filtro
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    renderizarTabela(transacoes); // Renderiza a tabela completa ao carregar a página

    document.getElementById('filtro-titulo').addEventListener('input', filtrarTransacoes);
    document.getElementById('filtro-banco').addEventListener('change', filtrarTransacoes);
    document.getElementById('filtro-categoria').addEventListener('change', filtrarTransacoes);
    document.getElementById('filtro-mes').addEventListener('change', filtrarTransacoes);
    document.getElementById('filtro-ano').addEventListener('input', filtrarTransacoes);
    document.getElementById('filtro-data-inicio').addEventListener('change', filtrarTransacoes);
    document.getElementById('filtro-data-fim').addEventListener('change', filtrarTransacoes);
});