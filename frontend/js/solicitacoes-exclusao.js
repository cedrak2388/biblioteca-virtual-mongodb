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
        <div class="sys-card">

            <h3>${usuario.nome}</h3>

            <p class="sys-meta">${usuario.email}</p>

            <p class="sys-meta">
                ${usuario.solicitacaoExclusao.motivo}
            </p>

            <div class="sys-actions">

                <button class="sys-btn sys-btn-primary"
                    onclick="aprovarExclusao('${usuario._id}')">
                    Aprovar
                </button>

                <button class="sys-btn sys-btn-danger"
                    onclick="rejeitarExclusao('${usuario._id}')">
                    Rejeitar
                </button>

            </div>

        </div>
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