async function carregarUsuarios() {

    const resposta =
        await fetch(
            "http://localhost:3000/usuarios"
        );

    const usuarios =
        await resposta.json();

    const tabela =
        document.getElementById(
            "tabelaUsuarios"
        );

    tabela.innerHTML = "";

    usuarios.forEach(usuario => {

        tabela.innerHTML += `
            <tr>

                <td>${usuario.nome}</td>

                <td>${usuario.email}</td>

                <td>${usuario.perfil}</td>

                <td>${usuario.status}</td>

                <td>

                    <button
                        onclick="suspenderUsuario('${usuario._id}')"
                    >
                        Suspender
                    </button>

                    <button
                        onclick="banirUsuario('${usuario._id}')"
                    >
                        Banir
                    </button>

                    <button
                        onclick="excluirUsuario('${usuario._id}')"
                    >
                        Excluir
                    </button>

                </td>

            </tr>
        `;
    });

}

async function suspenderUsuario(id) {

    await fetch(
        `http://localhost:3000/usuarios/suspender/${id}`,
        {
            method: "PUT"
        }
    );

    carregarUsuarios();

}

async function banirUsuario(id) {

    await fetch(
        `http://localhost:3000/usuarios/banir/${id}`,
        {
            method: "PUT"
        }
    );

    carregarUsuarios();

}

async function excluirUsuario(id) {

    if (!confirm(
        "Deseja excluir?"
    )) {
        return;
    }

    await fetch(
        `http://localhost:3000/usuarios/${id}`,
        {
            method: "DELETE"
        }
    );

    carregarUsuarios();

}

function voltar() {

    window.location.href =
        "admin.html";

}

carregarUsuarios();