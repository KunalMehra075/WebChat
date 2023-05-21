
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getDatabase, get, set,
    remove, update, ref
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";


//? <!----------------------------------------------- < Firebase Configuragtion> ----------------------------------------------->

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
let auth = getAuth(app)


const Database = getDatabase(app)
const db = getFirestore(app);



//? <!----------------------------------------------- < Set Users In database> ----------------------------------------------->

async function InsertSignupData(data, location) {
    await set(ref(Database, "Users/" + data.name.trim()), data)
        .then((res) => {
            console.log("Data Inserted")
            setTimeout(() => {
                window.location.href = location
            }, 1000);
        })
        .catch((err) => console.log(err));
}



//? <!----------------------------------------------- < Signup With> ----------------------------------------------->
const Provider = new GoogleAuthProvider()
const signInWithGoogle = () => {
    signInWithPopup(auth, Provider)
        .then((res) => {
            let name = res.user.displayName
            let email = res.user.email
            let image = res.user.photoURL
            console.log(name, email, image);
            InsertSignupData({ name, email, image, age: 23, password: email }, "chat.html")
        })
        .catch((err) => console.log(err));
}

export {
    InsertSignupData,
    createUserWithEmailAndPassword,
    auth, signOut, get, remove, update, ref,
    signInWithEmailAndPassword,
    signInWithGoogle,
    onAuthStateChanged, Database, db, getDocs, collection
}
