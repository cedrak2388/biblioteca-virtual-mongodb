async function carregarEmprestimos() {

    const usuario =
        JSON.parse(
        localStorage.getItem(
            "usuario"
        )
    );

    const resposta =
        await fetch(
        `http://localhost:3000/emprestimos/${usuario.email}`
    );;

    const livros =
        await resposta.json();

    const div =
        document.getElementById(
            "emprestimos"
        );

    div.innerHTML = "";

    livros.forEach(livro => {

        const emprestimo =
            livro.emprestimos.find(
                e =>
                e.status === "ativo"
            );

        div.innerHTML += `

            <hr>

            <h3>
                ${livro.titulo}
            </h3>

            <p>
                Empréstimo:
                ${new Date(
                    emprestimo.dataEmprestimo
                ).toLocaleDateString()}
            </p>

            <p>
                Devolver até:
                ${new Date(
                    emprestimo.dataPrevistaDevolucao
                ).toLocaleDateString()}
            </p>

            <button
            onclick="
            devolverLivro(
            '${livro._id}'
            )">

            Devolver

            </button>

        `;

    });

}

async function devolverLivro(id) {

    const resposta =
        await fetch(
            `http://localhost:3000/livros/devolver/${id}`,
            {
                method: "PUT"
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
    );

    carregarEmprestimos();

}

carregarEmprestimos();