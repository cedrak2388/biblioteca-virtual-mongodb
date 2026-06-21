document
.getElementById(
    "formUsuario"
)
.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const usuario = {

            nome:
                document
                .getElementById(
                    "nome"
                ).value,

            email:
                document
                .getElementById(
                    "email"
                ).value,

            senhaHash:
                document
                .getElementById(
                    "senha"
                ).value,

            telefone:
                document
                .getElementById(
                    "telefone"
                ).value,

            endereco:
                document
                .getElementById(
                    "endereco"
                ).value,

            perfil:
                document
                .getElementById(
                    "perfil"
                ).value,

            status:
                "ativo",

            dataCadastro:
                new Date()

        };

        const resposta =
            await fetch(
                "http://localhost:3000/admin/usuarios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(
                        usuario
                    )
                }
            );

        const dados =
            await resposta.json();

        alert(
            dados.mensagem
        );

        if (
            resposta.ok
        ) {

            window.location.href =
                "usuarios.html";

        }

    }
);