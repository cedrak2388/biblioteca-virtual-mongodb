async function carregarDashboard() {

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/dashboard"
            );

        const dados =
            await resposta.json();

        document.getElementById("usuarios").innerText =
            dados.totalUsuarios;

        document.getElementById("livros").innerText =
            dados.totalLivros;

        document.getElementById("auditorias").innerText =
            dados.totalAuditorias;

        document.getElementById("suspensos").innerText =
            dados.usuariosSuspensos;

        document.getElementById("banidos").innerText =
            dados.usuariosBanidos;

    } catch (erro) {

        console.error(erro);

    }

}

function carregarUsuarioLogado() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    document.getElementById(
        "usuarioLogado"
    ).innerHTML = `

        <strong>
            Bem-vindo,
            ${usuario.nome}
        </strong>

        <br>

        Perfil:
        ${usuario.perfil}

    `;

}

function logout() {

    window.location.href =
        "login.html";

}

carregarUsuarioLogado();
carregarDashboard();