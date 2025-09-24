// Array de transações
let transacoes = [];
let proximoId = 1;

// Exibir alertas
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-message`;
  alertDiv.setAttribute("role", "alert");
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alertDiv);
    bsAlert.close();
  }, 3000);
}

// Render listagem
function renderListagemTransacoes() {
  document.getElementById("cadastro-form").style.display = "none";
  document.getElementById("listagem-transacoes").style.display = "block";

  const tabelaBody = document.getElementById("transacoes-body");
  if (transacoes.length === 0) {
    tabelaBody.innerHTML =
      '<tr><td colspan="8" class="text-center">Nenhuma transação cadastrada.</td></tr>';
  } else {
    tabelaBody.innerHTML = transacoes
      .map(
        (t) => `
            <tr>
                <td>${t.id}</td>
                <td>${t.titulo}</td>
                <td>${t.data}</td>
                <td>${t.banco}</td>
                <td>${t.movimento}</td>
                <td>R$ ${t.valor.toFixed(2).replace(".", ",")}</td>
                <td>${t.categoria}</td>
                <td>${t.descricao}</td>
            </tr>
        `
      )
      .join("");
  }
}

// Render cadastro
function renderCadastroForm() {
  document.getElementById("listagem-transacoes").style.display = "none";
  document.getElementById("cadastro-form").style.display = "block";
}

// Carregar do localStorage
function loadTransactions() {
  const storedTransactions = localStorage.getItem("transacoes");
  if (storedTransactions) {
    transacoes = JSON.parse(storedTransactions);
    if (transacoes.length > 0) {
      proximoId = transacoes[transacoes.length - 1].id + 1;
    }
  }
}
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const titulo = form.titulo.value;
  const data = form.data.value;
  const banco = form.banco.value;
  const movimento = form.querySelector(
    'input[name="movimento"]:checked'
  )?.value;

  // Pega o valor, remove o "R$", os pontos e troca a vírgula por ponto
  const valorString = form.valor.value
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const valor = parseFloat(valorString);

  const categoria = form.categoria.value;
  const descricao = form.descricao.value;

  if (
    !titulo ||
    !data ||
    !banco ||
    !movimento ||
    isNaN(valor) ||
    valor <= 0 ||
    !categoria
  ) {
    showAlert(
      "Preencha todos os campos obrigatórios e insira um valor válido.",
      "danger"
    );
    return;
  }

  const novaTransacao = {
    id: proximoId++,
    titulo,
    data,
    banco,
    movimento,
    valor,
    categoria,
    descricao,
  };

  transacoes.push(novaTransacao);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));

  form.reset();
  showAlert("Transação cadastrada com sucesso!");
}

// Eventos
document
  .getElementById("link-cadastrar")
  .addEventListener("click", renderCadastroForm);
document
  .getElementById("link-listar")
  .addEventListener("click", renderListagemTransacoes);
document
  .getElementById("formTransacao")
  .addEventListener("submit", handleFormSubmit);

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
  renderCadastroForm();
});

// Exemplo de como a função poderia ser
function formatarValorParaMoeda(inputElement) {
  inputElement.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, "");
    if (valor.length === 0) {
      this.value = "";
      return;
    }

    valor = (parseInt(valor) / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    this.value = "R$ " + valor;
  });
}

// Chame a função para o seu input
// Certifique-se de que o input já existe na página
document.addEventListener("DOMContentLoaded", function () {
  const inputValor = document.getElementById("valor");
  if (inputValor) {
    formatarValorParaMoeda(inputValor);
  }
});
