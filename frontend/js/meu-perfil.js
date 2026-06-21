async function carregarPerfil() {

    const usuarioLogado =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            `http://localhost:3000/usuarios/email/${usuarioLogado.email}`
        );

    const usuario =
        await resposta.json();

    document.getElementById(
        "nome"
    ).value =
        usuario.nome || "";

    document.getElementById(
        "email"
    ).value =
        usuario.email || "";

    document.getElementById(
        "telefone"
    ).value =
        usuario.telefone || "";

    document.getElementById(
        "endereco"
    ).value =
        usuario.endereco || "";

    window.usuarioAtual =
        usuario;

}

document
.getElementById(
    "formPerfil"
)
.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const resposta =
            await fetch(
                `http://localhost:3000/usuarios/${window.usuarioAtual._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nome:
                        document
                        .getElementById(
                            "nome"
                        ).value,

                        email:
                        window.usuarioAtual.email,

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
                        window.usuarioAtual.perfil,

                        status:
                        window.usuarioAtual.status

                    })

                }
            );

        const dados =
            await resposta.json();

        alert(
            dados.mensagem
        );

        const usuarioLocal =
            JSON.parse(
                localStorage.getItem(
                    "usuario"
                )
            );

        usuarioLocal.nome =
            document.getElementById(
                "nome"
            ).value;

        localStorage.setItem(
            "usuario",
            JSON.stringify(
                usuarioLocal
            )
        );

    }
);

carregarPerfil();