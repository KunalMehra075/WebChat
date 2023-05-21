import { InsertSignupData, auth, createUserWithEmailAndPassword } from "./firebase.js";

let signupform = document.getElementById("signupform");
signupform?.addEventListener("submit", (e) => {
    e.preventDefault();
    let creds = {
        email: signupform.email.value,
        name: signupform.name.value,
        age: signupform.age.value,
        password: signupform.password.value,
    };

    console.log(creds);
    InsertSignupData(creds);

    createUserWithEmailAndPassword(auth, creds.email, creds.password)
        .then((creds) => {
            const user = creds.user;
            console.log(user);
            swal("Registration successfully!!", "", "success");
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            swal("Unsuccessful!!", errorMessage, "error");
        });
});


