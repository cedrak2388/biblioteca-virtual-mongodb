const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    try {

        const resposta = await fetch(
            "http://localhost:3000/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            document.getElementById("mensagem").innerText =
                dados.mensagem;

            return;
        }

        if (dados.perfil === "admin") {

            localStorage.setItem(
                "usuario",
                JSON.stringify(dados)
            );
            
            window.location.href =
                "admin.html";

        } else {

            localStorage.setItem(
                "usuario",
                JSON.stringify(dados)
            );
            
            window.location.href =
                "leitor.html";
        }

    } catch (erro) {

        document.getElementById("mensagem").innerText =
            "Erro ao conectar com servidor";
    }

});