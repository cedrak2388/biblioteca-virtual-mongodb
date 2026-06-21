async function carregarSolicitacoes() {

    const resposta =
        await fetch(
            "http://localhost:3000/solicitacoes-exclusao"
        );

    const usuarios =
        await resposta.json();

    const div =
        document.getElementById(
            "listaSolicitacoes"
        );

    div.innerHTML = "";

    usuarios.forEach(
        usuario => {

        div.innerHTML += `

            <hr>

            <h3>
                ${usuario.nome}
            </h3>

            <p>
                ${usuario.email}
            </p>

            <p>
                Motivo:
                ${usuario.solicitacaoExclusao.motivo}
            </p>

            <button
            onclick="
            aprovarExclusao(
            '${usuario._id}'
            )">
            Aprovar Exclusão
            </button>

            <button
            onclick="
            rejeitarExclusao(
            '${usuario._id}'
            )">
            Rejeitar
            </button>

        `;

    });

}

async function aprovarExclusao(id) {

    if (
        !confirm(
        "Excluir usuário?"
        )
    ) {
        return;
    }

    await fetch(
        `http://localhost:3000/usuarios/aprovar-exclusao/${id}`,
        {
            method: "DELETE"
        }
    );

    carregarSolicitacoes();

}

async function rejeitarExclusao(id) {

    if (
        !confirm(
        "Rejeitar solicitação?"
        )
    ) {
        return;
    }

    const resposta =
        await fetch(
            `http://localhost:3000/usuarios/rejeitar-exclusao/${id}`,
            {
                method: "PUT"
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
    );

    carregarSolicitacoes();

}

carregarSolicitacoes();