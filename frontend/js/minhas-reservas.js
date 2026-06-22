async function carregarReservas() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            `http://localhost:3000/reservas/${usuario.email}`
        );

    const livros =
        await resposta.json();

    const div =
        document.getElementById(
            "reservas"
        );

    div.innerHTML = "";

    livros.forEach(
        livro => {

        const reserva =
            livro.reservas.find(
                r =>
                r.usuarioId ===
                usuario.email
            );

        div.innerHTML += `

            <hr>

            <h3>
                ${livro.titulo}
            </h3>

            <p>
                Reservado em:
                ${new Date(
                    reserva.dataReserva
                ).toLocaleDateString()}
            </p>

            <button
                onclick="
                cancelarReserva(
                    '${livro._id}'
                )"
            >

                Cancelar Reserva

            </button>

        `;

    });

}

async function cancelarReserva(
    livroId
) {

    if (
        !confirm(
            "Deseja cancelar esta reserva?"
        )
    ) {
        return;
    }

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );

    const resposta =
        await fetch(
            `http://localhost:3000/reservas/${livroId}/${usuario.email}`,
            {
                method: "DELETE"
            }
        );

    const dados =
        await resposta.json();

    alert(
    dados.mensagem
    );

    carregarReservas();

    if (
        typeof carregarDashboardLeitor
        === "function"
    ) {

        carregarDashboardLeitor();

    }

}

carregarReservas();