document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    // Header (se existir na página)
    const userNome = document.getElementById("userNome");
    const userEmail = document.getElementById("userEmail");
    const userFoto = document.getElementById("userFoto");

    if (userNome) userNome.textContent = usuario.nome;
    if (userEmail) userEmail.textContent = usuario.email;
    if (userFoto && usuario.foto) userFoto.src = usuario.foto;

    // Sidebar (todas as páginas)
    const sidebarNome = document.getElementById("sidebarNome");
    const sidebarFoto = document.getElementById("sidebarFoto");

    if (sidebarNome) sidebarNome.textContent = usuario.nome.split(" ")[0];
    if (sidebarFoto && usuario.foto) sidebarFoto.src = usuario.foto;
  }

  // Mostrar data de hoje (se existir)
  const dataHojeEl = document.getElementById("dataHoje");
  if (dataHojeEl) {
    const dataHoje = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    dataHojeEl.textContent = dataHoje;
  }
});

