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
                        onclick="editarUsuario('${usuario._id}')"
                    >

                        Editar

                    </button>
                
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
                        onclick="reativarUsuario('${usuario._id}')"
                    >
                        Reativar
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

function editarUsuario(id) {

    window.location.href =
        `editar-usuario.html?id=${id}`;

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

async function reativarUsuario(id) {

    const resposta =
        await fetch(
            `http://localhost:3000/usuarios/reativar/${id}`,
            {
                method: "PUT"
            }
        );

    const dados =
        await resposta.json();

    alert(
        dados.mensagem
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