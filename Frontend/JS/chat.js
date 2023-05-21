import { auth, onAuthStateChanged, signOut, get, ref, Database, db, collection, getDocs } from "./firebase.js";



CheckUserSignedInOrNot()

function CheckUserSignedInOrNot() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);
            let ActiveUser = user.displayName || user.email.split("@")[0].replace(/[0-9]/g, '');
            let UserEmail = user.email
            let UserID = user.uid
            let UserIMG = user.image || "Images/avatar.jpg"
            RenderUserDataOnPage(ActiveUser, UserEmail, UserID, UserIMG)
            GetAllUsers()
        } else {
            swal("No User Signed In", "Redirecting to Home Page", "info");
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1000);
        }
    });
}

function RenderUserDataOnPage(name, email, id, UserIMG) {
    document.getElementById("mainphoto").setAttribute("src") = UserIMG
    document.getElementById("NavUserName").innerHTML = name
    document.getElementById("NavUserEmail").innerHTML = email
    localStorage.setItem("UserID", id)
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


let SendMessageForm = document.getElementById("SendMessageForm")
let msg = document.getElementById("msgInp")
SendMessageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let message = {
        senderID: "",
        recieverID: "",
        text: msg.value
    }
    console.log(message);
})













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
