function loadTransactions() {
  const storedTransactions = localStorage.getItem("transacoes");
  return storedTransactions ? JSON.parse(storedTransactions) : [];
}

function loadMetasFromStorage() {
  const stored = localStorage.getItem("metas");
  return stored ? JSON.parse(stored) : [];
}

function calcularTotais(transacoes) {
  const totais = {
    receitas: 0,
    despesas: 0,
    investimentos: 0,
    saldoTotal: 0,
    saldosPorBanco: {},
    despesasMensais: {
      Jan: 0, Fev: 0, Mar: 0, Abr: 0, Mai: 0, Jun: 0,
      Jul: 0, Ago: 0, Set: 0, Out: 0, Nov: 0, Dez: 0
    }
  };

  transacoes.forEach((t) => {
    const valor = parseFloat(t.valor) || 0;
    if (t.movimento === "receita") {
      totais.receitas += valor;
    } else if (t.movimento === "despesa") {
      totais.despesas += valor;
      const mes = new Date(t.data).getMonth();
      const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      totais.despesasMensais[meses[mes]] += valor;
    } else if (t.movimento === "investimento") {
      totais.investimentos += valor;
    }

    if (!totais.saldosPorBanco[t.banco]) {
      totais.saldosPorBanco[t.banco] = 0;
    }
    if (t.movimento === "receita") {
      totais.saldosPorBanco[t.banco] += valor;
    } else {
      totais.saldosPorBanco[t.banco] -= valor;
    }
  });

  totais.saldoTotal = totais.receitas - totais.despesas + totais.investimentos;
  return totais;
}


function atualizarDashboard() {
  const transacoes = loadTransactions();
  const metas = loadMetasFromStorage();
  const totais = calcularTotais(transacoes);

  // Cards 
  const fmt = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;
  document.getElementById("saldoTotal").textContent = fmt(totais.saldoTotal);
  document.getElementById("totalReceitas").textContent = fmt(totais.receitas);
  document.getElementById("totalDespesas").textContent = fmt(totais.despesas);

  // Gráfico de barras
  const ctxBarras = document.getElementById("graficoBarras");
  if (ctxBarras) {
    if (window.myBarChart) window.myBarChart.destroy();
    window.myBarChart = new Chart(ctxBarras, {
      type: "bar",
      data: {
        labels: Object.keys(totais.despesasMensais),
        datasets: [{ label: "Despesas (R$)", data: Object.values(totais.despesasMensais), backgroundColor: "#0f3652" }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // Gráfico de pizza
  const ctxPizza = document.getElementById("graficoPizza");
  if (ctxPizza) {
    if (window.myDoughnutChart) window.myDoughnutChart.destroy();
    const labels = Object.keys(totais.saldosPorBanco);
    const values = Object.values(totais.saldosPorBanco);
    window.myDoughnutChart = new Chart(ctxPizza, {
      type: "doughnut",
      data: {
        labels: labels.length ? labels : ["Sem dados"],
        datasets: [{
          data: values.length ? values : [1],
          backgroundColor: labels.length ? ["#2990d9","#0f3652","#8fb1c9","#48cb10","#ab0707"] : ["#e0e0e0"]
        }]
      },
      options: { responsive: true }
    });
  }

  // Metas
  const selectMetas = document.getElementById("selectMetas");
  const qtdMetas = document.getElementById("quantidadeMetas");
  const qtdConcluidas = document.getElementById("metasQtd");

  if (selectMetas) {
    selectMetas.innerHTML = '<option disabled selected>-- Escolha uma meta --</option>';
    let concluidas = 0;

    metas.forEach(meta => {
      let valorAtual = meta.tipo === "receita" ? totais.receitas : meta.valorAtual;
      const progresso = Math.min((valorAtual / meta.valorAlvo) * 100, 100);
      if (progresso >= 100) concluidas++;

      const opt = document.createElement("option");
      opt.value = meta.id;
      opt.textContent = meta.titulo;
      selectMetas.appendChild(opt);
    });

    qtdMetas.textContent = `Quantidade de metas: ${metas.length} cadastradas`;
    qtdConcluidas.textContent = concluidas;

    selectMetas.onchange = function(e) {
      const id = parseInt(e.target.value);
      const meta = metas.find(m => m.id === id);
      if (!meta) return;
      let valorAtual = meta.tipo === "receita" ? totais.receitas : meta.valorAtual;
      const progresso = Math.min((valorAtual / meta.valorAlvo) * 100, 100);
      document.getElementById("progressBar").style.width = `${progresso}%`;
      document.getElementById("progressBar").textContent = `${Math.round(progresso)}%`;
      document.getElementById("progressContainer").style.display = "block";
    };
  }
}

// Data
document.addEventListener("DOMContentLoaded", () => {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  document.getElementById("dataHoje").textContent = `${dia}/${mes}/${ano}`;
  atualizarDashboard();
});
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    // Header
    document.getElementById("userNome").textContent = usuario.nome;
    document.getElementById("userEmail").textContent = usuario.email;
    if (usuario.foto) {
      document.getElementById("userFoto").src = usuario.foto;
    }

    // Sidebar
    document.getElementById("sidebarNome").textContent = usuario.nome.split(" ")[0]; // só o primeiro nome
    if (usuario.foto) {
      document.getElementById("sidebarFoto").src = usuario.foto;
    }
  }

  // Mostrar data de hoje
  const dataHoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  document.getElementById("dataHoje").textContent = dataHoje;
});
