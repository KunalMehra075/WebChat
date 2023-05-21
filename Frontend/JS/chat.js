import { auth, onAuthStateChanged, signOut, get, ref, Database, db, collection, getDocs } from "./firebase.js";



CheckUserSignedInOrNot()
function CheckUserSignedInOrNot() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(user);
            GetAllUsers()
        } else {
            swal("No User Signed In", "Redirecting to Home Page", "info");
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1000);
        }
    });
}



async function GetAllUsers() {
    let userCol = collection(db, "Users")
    getDocs(userCol)
        .then((snap) => {
            let users = []
            snap.docs.forEach(doc => {
                users.push({ ...doc.data(), id: doc.id })
            });
            console.log(users);
        })
        .catch((err) => console.log(err));
}
















//? <!----------------------------------------------- < Logout> ----------------------------------------------->

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
                swal("Sign-out successful", "Redirecting to home Page", "success");
                setTimeout(() => {
                    window.location.href = "index.html"
                }, 3000);
            }).catch((error) => {
                swal("Error In Signing Out", error, "error");
                console.log(error)
            });
        }
    });
});
