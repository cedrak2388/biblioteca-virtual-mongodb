function carregarUsuarioLogado() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    if (!usuario) {
        return;
    }

    document.getElementById(
        "usuarioLogado"
    ).innerHTML = `

        Administrador:
        <strong>${usuario.nome}</strong>

    `;
}

carregarUsuarioLogado();