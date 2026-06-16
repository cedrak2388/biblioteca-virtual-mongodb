const usuario =
    JSON.parse(
        localStorage.getItem(
            "usuario"
        )
    );

if (
    !usuario ||
    usuario.perfil !== "leitor"
) {

    alert(
        "Acesso negado."
    );

    window.location.href =
        "login.html";

}