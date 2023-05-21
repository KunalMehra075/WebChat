import { auth, signOut } from "./firebase";

let logout = document.getElementById("logout")
logout.addEventListener("click", () => {

    swal({
        title: "Are you sure you want to logout?",
        text: "You will be logged out of the session",
        icon: "info",
        buttons: true,
        dangerMode: true,
    }).then((logout) => {
        if (logout) {
            signOut(auth).then(() => {
                swal("'Sign-out successful.'", "Redirecting to home Page", "success");
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 2000);
            }).catch((error) => {
                swal("Error In Signing Out", error, "error");
                console.log(error)
            });
        }
    });
});
