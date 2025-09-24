let metas = [];
let proximoIdMeta = 1;

// Carregar metas
function loadMetas() {
  const stored = localStorage.getItem("metas");
  metas = stored ? JSON.parse(stored) : [];
  if (metas.length > 0) {
    proximoIdMeta = metas[metas.length - 1].id + 1;
  }
  renderMetas();
}

function saveMetas() {
  localStorage.setItem("metas", JSON.stringify(metas));
}

function renderMetas() {
  const tbody = document.getElementById("metas-body");
  if (metas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhuma meta cadastrada.</td></tr>';
    return;
  }

  tbody.innerHTML = metas.map(m => {
    // Botões comuns (Editar e Excluir)
    let botoes = `
      <button class="btn btn-sm btn-warning" onclick="abrirEditar(${m.id})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="abrirExcluir(${m.id})">Excluir</button>
    `;

    // Só adiciona botão Transferir se NÃO for receita
    if (m.tipo !== "receita") {
      botoes = `
        <button class="btn btn-sm btn-success" onclick="abrirTransferir(${m.id})">Transferir</button>
        ${botoes}
      `;
    }

    return `
      <tr>
        <td>${m.id}</td>
        <td>${m.tipo}</td>
        <td>${m.titulo}</td>
        <td>R$ ${m.valorAlvo.toFixed(2).replace('.', ',')}</td>
        <td>R$ ${m.valorAtual.toFixed(2).replace('.', ',')}</td>
        <td>${m.prazo || "-"}</td>
        <td>${m.descricao || "-"}</td>
        <td>${botoes}</td>
      </tr>
    `;
  }).join("");
}

// Cadastro
document.getElementById("formMeta").addEventListener("submit", e => {
  e.preventDefault();
  const tipo = document.getElementById("tipoMeta").value;
  const titulo = document.getElementById("tituloMeta").value.trim();
  const valor = parseFloat(document.getElementById("valorMeta").value);
  const prazo = document.getElementById("prazoMeta").value;
  const descricao = document.getElementById("descricaoMeta").value.trim();

  if (!tipo || !titulo || isNaN(valor) || valor <= 0) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  metas.push({ id: proximoIdMeta++, tipo, titulo, valorAlvo: valor, valorAtual: 0, prazo, descricao });
  saveMetas();
  renderMetas();
  e.target.reset();
});

// Transferir
function abrirTransferir(id) {
  document.getElementById("transferirId").value = id;
  new bootstrap.Modal(document.getElementById("modalTransferir")).show();
}
document.getElementById("formTransferir").addEventListener("submit", e => {
  e.preventDefault();
  const id = parseInt(document.getElementById("transferirId").value);
  const valor = parseFloat(document.getElementById("valorTransferencia").value);
  const meta = metas.find(m => m.id === id);
  if (meta && valor > 0) {
    meta.valorAtual = Math.min(meta.valorAtual + valor, meta.valorAlvo);
    saveMetas();
    renderMetas();
    bootstrap.Modal.getInstance(document.getElementById("modalTransferir")).hide();
  }
});

// Editar
function abrirEditar(id) {
  const meta = metas.find(m => m.id === id);
  if (!meta) return;
  document.getElementById("editarId").value = id;
  document.getElementById("editarTitulo").value = meta.titulo;
  document.getElementById("editarValor").value = meta.valorAlvo;
  document.getElementById("editarPrazo").value = meta.prazo;
  document.getElementById("editarDescricao").value = meta.descricao;
  new bootstrap.Modal(document.getElementById("modalEditar")).show();
}
document.getElementById("formEditar").addEventListener("submit", e => {
  e.preventDefault();
  const id = parseInt(document.getElementById("editarId").value);
  const meta = metas.find(m => m.id === id);
  if (!meta) return;
  meta.titulo = document.getElementById("editarTitulo").value;
  meta.valorAlvo = parseFloat(document.getElementById("editarValor").value);
  meta.prazo = document.getElementById("editarPrazo").value;
  meta.descricao = document.getElementById("editarDescricao").value;
  saveMetas();
  renderMetas();
  bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
});

// Excluir
function abrirExcluir(id) {
  document.getElementById("excluirId").value = id;
  new bootstrap.Modal(document.getElementById("modalExcluir")).show();
}
document.getElementById("btnConfirmarExcluir").addEventListener("click", () => {
  const id = parseInt(document.getElementById("excluirId").value);
  metas = metas.filter(m => m.id !== id);
  saveMetas();
  renderMetas();
  bootstrap.Modal.getInstance(document.getElementById("modalExcluir")).hide();
});

document.addEventListener("DOMContentLoaded", loadMetas);
