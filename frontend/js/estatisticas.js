async function carregarCategorias() {

    const resposta =
        await fetch(
            "http://localhost:3000/estatisticas/categorias"
        );

    const dados =
        await resposta.json();

    let html = "";

    dados.forEach(item => {

        html += `
            <p>
                ${item._id}: ${item.quantidade}
            </p>
        `;

    });

    document.getElementById("categorias")
        .innerHTML = html;

}

async function carregarAvaliacoes() {

    const resposta =
        await fetch(
            "http://localhost:3000/estatisticas/avaliacoes"
        );

    const dados =
        await resposta.json();

    let html = "";

    dados.forEach(livro => {

        html += `
            <p>
                ${livro.titulo}
                (${livro.estatisticas.mediaNotas})
            </p>
        `;

    });

    document.getElementById("avaliacoes")
        .innerHTML = html;

}

async function carregarUsuarios() {

    const resposta =
        await fetch(
            "http://localhost:3000/estatisticas/usuarios"
        );

    const dados =
        await resposta.json();

    let html = "";

    dados.forEach(item => {

        html += `
            <p>
                ${item._id}: ${item.quantidade}
            </p>
        `;

    });

    document.getElementById("usuariosStatus")
        .innerHTML = html;

}

async function carregarReservas() {

    const resposta =
        await fetch(
            "http://localhost:3000/estatisticas/reservas"
        );

    const dados =
        await resposta.json();

    document.getElementById("reservas")
        .innerHTML =
        `<p>${dados[0]?.total || 0}</p>`;

}

function voltar() {

    window.location.href =
        "admin.html";

}

carregarCategorias();
carregarAvaliacoes();
carregarUsuarios();
carregarReservas();