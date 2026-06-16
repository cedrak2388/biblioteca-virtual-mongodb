const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");

async function carregarLivro() {

    const resposta =
        await fetch(
            `http://localhost:3000/livros/${id}`
        );

    const livro =
        await resposta.json();

    document.getElementById("titulo")
        .value =
        livro.titulo;

    document.getElementById("categorias")
        .value =
        livro.categorias.join(",");

    document.getElementById("tags")
        .value =
        livro.tags.join(",");

    document.getElementById("estoque")
        .value =
        livro.estoque;

    document.getElementById("descricao")
        .value =
        livro.descricao;

}

document
.getElementById("formLivro")
.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const resposta =
            await fetch(
                `http://localhost:3000/livros/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        titulo:
                            document.getElementById("titulo").value,

                        categorias:
                            document.getElementById("categorias").value,

                        tags:
                            document.getElementById("tags").value,

                        estoque:
                            document.getElementById("estoque").value,

                        descricao:
                            document.getElementById("descricao").value

                    })

                }
            );

        const dados =
            await resposta.json();

        alert(
            dados.mensagem
        );

        window.location.href =
            "livros.html";

    }
);

function voltar() {

    window.location.href =
        "livros.html";

}

carregarLivro();