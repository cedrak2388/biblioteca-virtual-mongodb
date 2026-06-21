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

        Leitor:
        <strong>${usuario.nome}</strong>

    `;
}

carregarUsuarioLogado();