function logout() {

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "login.html";

}