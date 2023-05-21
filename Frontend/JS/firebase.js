
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, get, set, remove, update, ref } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBWvrts_WXipbJTX6Af8gPbX7y0ZP8sQE",
    authDomain: "webchat-863e7.firebaseapp.com",
    databaseURL: "https://webchat-863e7-default-rtdb.firebaseio.com",
    projectId: "webchat-863e7",
    storageBucket: "webchat-863e7.appspot.com",
    messagingSenderId: "558453563785",
    appId: "1:558453563785:web:6d6810b730af4248424158"
};
const app = initializeApp(firebaseConfig);
const Database = getDatabase()
let auth = getAuth(app)

async function InsertSignupData(data) {
    set(ref(Database, "Users/" + data.name.trim()), data).then((res) => console.log("data inserted"))
        .catch((err) => console.log(err));
}

const Provider = new GoogleAuthProvider()

const signInWithGoogle = () => {
    signInWithPopup(auth, Provider)
        .then((res) => {
            console.log(res)
            let name = res.user.diplayName
            let email = res.user.email
            let image = res.user.photoURL
            console.log(name, email, image);
            InsertSignupData({ name, email, image, age: null })
        })
        .catch((err) => console.log(err));

}

export {
    InsertSignupData,
    createUserWithEmailAndPassword,
    auth, signOut, get,
    signInWithEmailAndPassword,
    signInWithGoogle
}
