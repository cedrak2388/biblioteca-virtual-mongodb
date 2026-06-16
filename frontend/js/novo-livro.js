const form =
document.getElementById("livroForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const livro = {

        titulo:
            document.getElementById("titulo").value,

        autorNome:
            document.getElementById("autorNome").value,

        autorPais:
            document.getElementById("autorPais").value,

        isbn:
            document.getElementById("isbn").value,

        categorias:
            document.getElementById("categorias").value,

        tags:
            document.getElementById("tags").value,

        descricao:
            document.getElementById("descricao").value,

        anoPublicacao:
            document.getElementById("anoPublicacao").value,

        editora:
            document.getElementById("editora").value,

        idioma:
            document.getElementById("idioma").value,

        paginas:
            document.getElementById("paginas").value,

        estoque:
            document.getElementById("estoque").value
    };

    const resposta =
        await fetch(
            "http://localhost:3000/livros",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify(livro)
            }
        );

    const dados =
        await resposta.json();

    document.getElementById("mensagem")
        .innerText = dados.mensagem;

});

function voltar() {

    window.location.href =
        "livros.html";

}