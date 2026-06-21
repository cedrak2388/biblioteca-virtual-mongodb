function logout() {

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "login.html";

}

async function solicitarExclusao() {

    const motivo =
        prompt(
            "Informe o motivo da exclusão da conta:"
        );

    if (!motivo) {
        return;
    }

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            `http://localhost:3000/usuarios/solicitar-exclusao/${usuario.email}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    motivo
                })
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
    );

}