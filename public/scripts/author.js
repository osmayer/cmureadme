const swalAlertColor = {
    iconColor: '#FFFFFF',
    backgroundColor: '#321a47',
    color: '#FFFFFF'
};  

const loginForm = document.getElementById("loginForm");
const btnLogOut = document.getElementById("btnLogOut");

window.onload = async function() {
    let author_token = localStorage.getItem("author_token") || sessionStorage.getItem("author_token");

    if (author_token === null) {
        document.getElementById("displayIfNotLoggedIn").style.display = "block";
    } else {
        document.getElementById("displayIfLoggedIn").style.display = "block";
    }
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let response = await fetch('/login', {
        method: "POST",
        body: new FormData(loginForm)
    });

    let result = await response.json();

    if (result.error) {
        swalError(result.error.title, result.error.message);
    } else if (result.success) {
        Swal.fire({
            title: result.success.title,
            html: result.success.message,
            icon: "success",
            iconColor: swalAlertColor.iconColor,
            background: swalAlertColor.backgroundColor,
            color: swalAlertColor.color,
            didClose: () => {
                if (rememberMe.checked) {
                    localStorage.setItem("author_token", result.success.token);
                } else {
                    sessionStorage.setItem("author_token", result.success.token);
                }

                loginForm.reset();
                location.reload();
            }
        });
    }
});

btnLogOut.addEventListener("click", () => {
    localStorage.removeItem("author_token");
    sessionStorage.removeItem("author_token");
    location.reload();
});

function swalError(errorTitle, errorMessage) {
    Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        iconColor: swalAlertColor.iconColor,
        background: swalAlertColor.backgroundColor,
        color: swalAlertColor.color
    });
}

function swalSuccess(successTitle, successMessage) {
    Swal.fire({
        title: successTitle,
        text: successMessage,
        icon: "success",
        iconColor: swalAlertColor.iconColor,
        background: swalAlertColor.backgroundColor,
        color: swalAlertColor.color
    });
}