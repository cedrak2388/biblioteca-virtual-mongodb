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
            <hr>
            <p><strong>Ação:</strong> ${log.acao}</p>
            <p><strong>Usuário:</strong> ${log.usuario}</p>
            <p><strong>Detalhe:</strong> ${log.detalhe}</p>
            <p><strong>Data:</strong> ${new Date(log.data).toLocaleString()}</p>
        `;
    });

}

function voltar() {
    window.location.href = "admin.html";
}

carregarAuditoria();