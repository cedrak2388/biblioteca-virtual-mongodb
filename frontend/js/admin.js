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

        document.getElementById("emprestimosAtivos").innerText =
            dados.emprestimosAtivos;

        document.getElementById
        ("reservasAtivas").innerText =
            dados.reservasAtivas;

        document.getElementById("livrosDisponiveis").innerText =
            dados.livrosDisponiveis;

        const respostaAtivo =
            await fetch("http://localhost:3000/estatisticas/usuario-mais-ativo");

        const usuarioAtivo =
            await respostaAtivo.json();

        document.getElementById("usuarioAtivo").innerText =
            usuarioAtivo.nome
            ? `${usuarioAtivo.nome} (${usuarioAtivo.score})`
            : "Sem dados";

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