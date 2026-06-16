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
                onclick="avaliarLivro('${livro._id}')"
            >
                Avaliar
            </button>
        `;
    });

}

async function reservarLivro(id) {

    const resposta =
        await fetch(
            `http://localhost:3000/livros/reservar/${id}`,
            {
                method: "PUT"
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
        prompt("Informe uma nota de 1 a 5:");

    if (!nota) {
        return;
    }

    const comentario =
        prompt("Digite um comentário:");

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
                    nota,
                    comentario
                })
            }
        );

    const dados =
        await resposta.json();

    alert(dados.mensagem);

}

carregarLivros();