async function carregarLivros() {

    const resposta =
        await fetch(
            "http://localhost:3000/livros"
        );

    const livros =
        await resposta.json();

    const tabela =
        document.getElementById(
            "tabelaLivros"
        );

    preencherTabela(livros);

}

function preencherTabela(livros) {

    const tabela =
        document.getElementById(
            "tabelaLivros"
        );

    tabela.innerHTML = "";

    livros.forEach(livro => {

        tabela.innerHTML += `
            <tr>

                <td>
                    ${livro.titulo}
                </td>

                <td>
                    ${livro.autor.nome}
                </td>

                <td>
                    ${livro.isbn}
                </td>

                <td>
                    ${livro.categorias.join(", ")}
                </td>

                <td>
                    ${livro.disponiveis}
                </td>

                <td>
                    ${livro.estoque}
                </td>

                <td>
                    ${
                        livro.estatisticas
                        ?.mediaNotas || 0
                    }
                </td>

                <td>

                    <button
                        onclick="editarLivro('${livro._id}')"
                    >
                        Editar
                    </button>

                    <button
                        onclick="excluirLivro('${livro._id}')"
                    >
                        Excluir
                    </button>

                </td>

            </tr>
        `;

    });

}

async function buscarPorTag() {

    const tag =
        document.getElementById(
            "campoTag"
        ).value;

    if (!tag.trim()) {

        carregarLivros();

        return;
    }

    const resposta =
        await fetch(
            `http://localhost:3000/livros/tag/${tag}`
        );

    const livros =
        await resposta.json();

    preencherTabela(livros);

}

function voltar() {

    window.location.href =
        "admin.html";

}

function abrirFormulario() {

    window.location.href =
        "novo-livro.html";

}

function editarLivro(id) {

    alert(
        "Editar livro: " + id
    );

}

function editarLivro(id) {

    window.location.href =
        `editar-livro.html?id=${id}`;

}

async function excluirLivro(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este livro?"
    );

    if (!confirmar) {
        return;
    }

    const resposta =
        await fetch(
            `http://localhost:3000/livros/${id}`,
            {
                method: "DELETE"
            }
        );

    const dados =
        await resposta.json();

    alert(dados.mensagem);

    carregarLivros();

}

async function buscarLivros() {

    const texto =
        document.getElementById(
            "campoBusca"
        ).value;

    if (!texto.trim()) {

        carregarLivros();

        return;
    }

    const resposta =
        await fetch(
            `http://localhost:3000/livros/busca/${texto}`
        );

    const livros =
        await resposta.json();

    preencherTabela(livros);

}

carregarLivros();