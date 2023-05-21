import { signInWithEmailAndPassword } from "./firebase";

let loginform = document.getElementById("loginform")
loginform.addEventListener("submit", (e) => {
    e.preventDefault()
    let creds = {
        email: loginform.email.value,
        password: loginform.pass.value
    }
    console.log(creds);

    // ! LOGGING IN
    signInWithEmailAndPassword(auth, creds.email, creds.password)
        .then((creds) => {

            const user = creds.user;
            console.log(user);
            swal("Login Successful!", "Redirecting to Chat Page...", "success")
            alert(user.email + " Login successfully!!!");

        })
        .catch((error) => {
            const errorMessage = error.message;
            swal("Login Successful!", errorMessage, "error")
            console.log(errorMessage);

        });
});
