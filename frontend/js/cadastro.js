const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const mensagem = document.getElementById("mensagem");

    if (senha !== confirmarSenha) {

        mensagem.innerText =
            "As senhas não coincidem.";

        return;
    }

    try {

        const resposta = await fetch(
            "http://localhost:3000/cadastro",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            }
        );

        const dados = await resposta.json();

        mensagem.innerText =
            dados.mensagem;

        if (resposta.ok) {

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);

        }

    } catch (erro) {

        mensagem.innerText =
            "Erro ao conectar com servidor.";

    }

});