document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formUsuario");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const fotoInput = document.getElementById("foto");
  const fotoUpload = document.getElementById("fotoUpload");
  const temaSelect = document.getElementById("tema");

  // Carregar dados salvos
  const dadosSalvos = JSON.parse(localStorage.getItem("usuario"));
  if (dadosSalvos) {
    nomeInput.value = dadosSalvos.nome;
    emailInput.value = dadosSalvos.email;
    fotoInput.value = dadosSalvos.foto || "";
  }

  // Salvar no localStorage
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let fotoFinal = fotoInput.value;

    // Se o usuário escolher upload, usar FileReader
    if (fotoUpload.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        salvarUsuario(reader.result);
      };
      reader.readAsDataURL(fotoUpload.files[0]);
    } else {
      salvarUsuario(fotoFinal);
    }
  });

  function salvarUsuario(foto) {
    const usuario = {
      nome: nomeInput.value,
      email: emailInput.value,
      foto: foto,
      tema: temaSelect.value,
    };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("Dados salvos com sucesso!");
  }
});

  