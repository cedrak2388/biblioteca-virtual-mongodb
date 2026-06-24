async function carregarAuditoria() {

    const resposta =
        await fetch("http://localhost:3000/auditoria");

    const logs =
        await resposta.json();

    const div =
        document.getElementById("logs");

    div.innerHTML = "";

    logs.forEach(log => {

        div.innerHTML += `

        <div class="audit-card">

            <div class="audit-header">

                <h3>${log.acao}</h3>

                <span>
                    ${new Date(log.data).toLocaleString()}
                </span>

            </div>

            <p>
                <strong>Usuário:</strong>
                ${log.usuario}
            </p>

            <p>
                <strong>Detalhe:</strong>
                ${log.detalhe}
            </p>

        </div>

        `;
    });

}

function voltar() {
    window.location.href = "admin.html";
}

carregarAuditoria();