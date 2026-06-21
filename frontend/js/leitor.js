async function carregarLivros() {

    const resposta =
        await fetch(
            "http://localhost:3000/livros"
        );

    const livros =
        await resposta.json();

    const div =
        document.getElementById(
            "livros"
        );

    div.innerHTML = "";

    livros.forEach(livro => {

        div.innerHTML += `
            <hr>

            <h3>${livro.titulo}</h3>

            <p>
                Disponíveis:
                ${livro.disponiveis}
            </p>

            <button
            onclick="reservarLivro('${livro._id}')"
            >
                Reservar
            </button>

            <button
            onclick="emprestarLivro('${livro._id}')"
            >
                Emprestar
            </button>

            <button
            onclick="avaliarLivro('${livro._id}')"
            >
                Avaliar
            </button>
        `;
    });

}

async function reservarLivro(id) {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            `http://localhost:3000/livros/reservar/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    usuario
                })
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
    );

    carregarLivros();

}

async function emprestarLivro(id) {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            `http://localhost:3000/livros/emprestar/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    usuario
                })
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
    );

    carregarLivros();

}

async function avaliarLivro(id) {

    const nota =
        prompt(
            "Informe uma nota inteira de 1 a 5:"
        );

    if (!nota) {
        return;
    }

    const notaNumero =
        Number(nota);

    if (
        isNaN(notaNumero) ||
        notaNumero < 1 ||
        notaNumero > 5 ||
        !Number.isInteger(
            notaNumero
        )
    ) {

        alert(
            "A nota deve ser um número inteiro entre 1 e 5."
        );

        return;

    }

    const comentario =
        prompt(
            "Digite um comentário:"
        );

    const resposta =
        await fetch(
            `http://localhost:3000/livros/avaliar/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    nota:
                        notaNumero,
                    comentario
                })
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
    );

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

async function carregarDashboardLeitor() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            "http://localhost:3000/usuarios"
        );

    const usuarios =
        await resposta.json();

    const usuarioAtual =
        usuarios.find(
            u =>
            u.email ===
            usuario.email
        );

    if (!usuarioAtual) {
        return;
    }

    document.getElementById(
        "totalEmprestimos"
    ).innerText =

        usuarioAtual
        .emprestimosAtivos
        ?.length || 0;

    const respostaLivros =
        await fetch(
            "http://localhost:3000/livros"
        );

    const livros =
        await respostaLivros.json();

    let totalReservas = 0;

    livros.forEach(
        livro => {

            const possuiReserva =
                livro.reservas?.some(
                    r =>
                    r.usuarioId ===
                    usuario.email
                );

            if (
                possuiReserva
            ) {
                totalReservas++;
            }

        }
    );

    document.getElementById(
        "totalReservas"
    ).innerText =
        totalReservas;

}

carregarUsuarioLogado();

carregarDashboardLeitor();

carregarLivros();