import { auth, signInWithEmailAndPassword, signInWithGoogle } from "./firebase.js";

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
            console.log(creds);
            const user = creds.user;
            swal("Login Successful!", "Redirecting to Chat Page...", "success")
            setTimeout(() => {
                window.location.href = "chat.html"
            }, 1000);
        })
        .catch((error) => {
            const errorMessage = error.message;
            swal("User Not Found, Please Login!", errorMessage, "error")
            console.log(errorMessage);

        });
});
let GoogleSignup = document.getElementById("GoogleSignup")
GoogleSignup.addEventListener("click", signInWithGoogle)