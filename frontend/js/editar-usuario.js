const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");

async function carregarUsuario() {

    const resposta =
        await fetch(
            `http://localhost:3000/usuarios/${id}`
        );

    const usuario =
        await resposta.json();

    document.getElementById(
        "nome"
    ).value = usuario.nome;

    document.getElementById(
        "email"
    ).value = usuario.email;

    document.getElementById(
        "telefone"
    ).value = usuario.telefone || "";

    document.getElementById(
        "endereco"
    ).value = usuario.endereco || "";

    document.getElementById(
        "perfil"
    ).value = usuario.perfil;

    document.getElementById(
        "status"
    ).value = usuario.status;

}

document
.getElementById(
    "formEditar"
)
.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const usuario = {

            nome:
                document.getElementById(
                    "nome"
                ).value,

            email:
                document.getElementById(
                    "email"
                ).value,

            telefone:
                document.getElementById(
                    "telefone"
                ).value,

            endereco:
                document.getElementById(
                    "endereco"
                ).value,

            perfil:
                document.getElementById(
                    "perfil"
                ).value,

            status:
                document.getElementById(
                    "status"
                ).value

        };

        const resposta =
            await fetch(
                `http://localhost:3000/usuarios/${id}`,
                {
                    method: "PUT",

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

        window.location.href =
            "usuarios.html";

    }
);

carregarUsuario();