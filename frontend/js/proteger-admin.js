const usuario =
    JSON.parse(
        localStorage.getItem(
            "usuario"
        )
    );

if (
    !usuario ||
    usuario.perfil !== "admin"
) {

    alert(
        "Acesso negado."
    );

    window.location.href =
        "login.html";

}