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

    document.getElementById("autorNome")
        .value =
        livro.autor.nome;

    document.getElementById("autorPais")
        .value =
        livro.autor.pais;

    document.getElementById("isbn")
        .value =
        livro.isbn;

    document.getElementById("anoPublicacao")
        .value =
        livro.anoPublicacao;

    document.getElementById("editora")
        .value =
        livro.editora;

    document.getElementById("idioma")
        .value =
        livro.idioma;

    document.getElementById("paginas")
        .value =
        livro.paginas;
    
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
                            document.getElementById(
                                "titulo"
                            ).value,

                        autorNome:
                            document.getElementById(
                                "autorNome"
                            ).value,

                        autorPais:
                            document.getElementById(
                                "autorPais"
                            ).value,

                        isbn:
                            document.getElementById(
                                "isbn"
                            ).value,

                        categorias:
                            document.getElementById(
                                "categorias"
                            ).value,

                        tags:
                            document.getElementById(
                                "tags"
                            ).value,

                        descricao:
                            document.getElementById(
                                "descricao"
                            ).value,

                        anoPublicacao:
                            document.getElementById(
                                "anoPublicacao"
                            ).value,

                        editora:
                            document.getElementById(
                                "editora"
                            ).value,

                        idioma:
                            document.getElementById(
                                "idioma"
                            ).value,

                        paginas:
                            document.getElementById(
                                "paginas"
                            ).value,

                        estoque:
                            document.getElementById(
                                "estoque"
                            ).value

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