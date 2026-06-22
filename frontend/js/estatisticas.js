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

async function carregarIndicadoresGerais() {

    const respostaEmprestimos =
        await fetch(
            "http://localhost:3000/estatisticas/emprestimos"
        );

    const emprestimos =
        await respostaEmprestimos.json();

    document.getElementById(
        "totalEmprestimos"
    ).innerText =
        emprestimos[0]?.total || 0;

    const respostaDevolucoes =
        await fetch(
            "http://localhost:3000/estatisticas/devolucoes"
        );

    const devolucoes =
        await respostaDevolucoes.json();

    document.getElementById(
        "totalDevolucoes"
    ).innerText =
        devolucoes.total || 0;

    const respostaAvaliacoes =
        await fetch(
            "http://localhost:3000/estatisticas/total-avaliacoes"
        );

    const avaliacoes =
        await respostaAvaliacoes.json();

    document.getElementById(
        "totalAvaliacoes"
    ).innerText =
        avaliacoes[0]?.total || 0;

}

async function carregarRankingLivros() {

    const respostaEmp =
        await fetch(
            "http://localhost:3000/estatisticas/livro-mais-emprestado"
        );

    const maisEmprestado =
        await respostaEmp.json();

    document.getElementById(
        "maisEmprestado"
    ).innerHTML = maisEmprestado
        ? `${maisEmprestado.titulo} (${maisEmprestado.totalEmprestimos})`
        : "Nenhum dado";

    const respostaRes =
        await fetch(
            "http://localhost:3000/estatisticas/livro-mais-reservado"
        );

    const maisReservado =
        await respostaRes.json();

    document.getElementById(
        "maisReservado"
    ).innerHTML = maisReservado
        ? `${maisReservado.titulo} (${maisReservado.totalReservas})`
        : "Nenhum dado";
}

function voltar() {

    window.location.href =
        "admin.html";

}

carregarCategorias();
carregarAvaliacoes();
carregarUsuarios();
carregarReservas();
carregarIndicadoresGerais();
carregarRankingLivros();