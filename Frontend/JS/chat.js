import {
    auth, onAuthStateChanged, signOut, doc,
    db, collection, getDocs, updateDoc
} from "./firebase.js";
import { CheckCurrFriend } from "./messaging.js";

let spinner = document.getElementById("spinner")

let FriendName = document.getElementById("FriendName")
let FriendStatus = document.getElementById("FriendStatus")

CheckUserSignedInOrNot()

function CheckUserSignedInOrNot() {
    spinner.style.display = "block"//!SPINNER
    onAuthStateChanged(auth, (userdata) => {
        if (userdata) {
            let UserEmail = userdata.email
            let user = {}
            GetAllUsers()
            let AllUsers = JSON.parse(localStorage.getItem("AllUsers"))
            for (let i = 0; i < AllUsers.length; i++) {
                if (AllUsers[i].email == UserEmail) {
                    user = AllUsers[i]
                    break
                }
            }

            console.log(user);
            let ActiveUser = user.displayName || user.email.split("@")[0].replace(/[0-9]/g, '');
            let UserID = user.id
            let UserIMG = user.image || "Images/avatar.jpg"
            let friends = user.friends
            let CurrentUser = { ActiveUser, UserEmail, UserID, UserIMG, friends }
            CheckCurrFriend()
            localStorage.setItem("CurrentUser", JSON.stringify(CurrentUser))
            RenderUserDataOnPage(ActiveUser, UserEmail, UserID, UserIMG, friends)
            spinner.style.display = "none"//!SPINNER
        } else {
            spinner.style.display = "none"//!SPINNER
            swal("No User Signed In", "Redirecting to Home Page", "info");
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1000);
        }
    });
}

function RenderUserDataOnPage(name, email, id, UserIMG, friends) {
    document.getElementById("NavUserImg").setAttribute("src", UserIMG)
    document.getElementById("NavUserName").innerHTML = name
    document.getElementById("NavUserEmail").innerHTML = email
    localStorage.setItem("UserID", id)
    RenderContacts(friends)
    localStorage.setItem("UserFriends", JSON.stringify(friends))
}

async function GetAllUsers() {
    let userCol = collection(db, "Users")
    getDocs(userCol)
        .then((snap) => {
            let users = []
            snap.docs.forEach(doc => {
                users.push({ ...doc.data(), id: doc.id })
            });
            localStorage.setItem("AllUsers", JSON.stringify(users))
            console.log(users);
            RenderUsersOnSearchBar(users)

        })
        .catch((err) => console.log(err));
}

function RenderUsersOnSearchBar(users) {


    let uid = localStorage.getItem("UserID")
    let friends = JSON.parse(localStorage.getItem("CurrentUser")).friends
    let Users = users.map(item => {
        if (item.id == uid || friends.includes(item.id)) return ""
        return `
        <div class="SearchCard">
        <div>
          <img class="contactImage" src="${item.image || "Images/chatlogo.png"}" alt="" />
        </div>
        <div>
          <p class="contactName">${item.name}</p>
          <p class="contactEmail">${item.email}</p>
          <button data-id=${item.id} class="AddFriend">Add Friend +</button>
          <button data-id=${item.id} class="FollowFriend">Follow +</button>
        </div>
      </div>
        `

    })
    let SearchCardContainer = document.getElementById("SearchCardContainer")
    SearchCardContainer.innerHTML = Users.join("")

    let AddFriends = document.getElementsByClassName("AddFriend");
    for (let i = 0; i < AddFriends.length; i++) {
        AddFriends[i].addEventListener("click", (e) => {

            let target = e.target.dataset.id

            let AllUsers = JSON.parse(localStorage.getItem("AllUsers"))
            let newFriend;
            for (let i = 0; i < AllUsers.length; i++) {
                if (AllUsers[i].id == target) {
                    newFriend = AllUsers[i]
                    AddFriendFunction(newFriend);

                    break;
                }
            }

        })
    }

}

function RenderContacts(FriendsArray) {
    let AllUsers = JSON.parse(localStorage.getItem("AllUsers"))
    let Friends = []

    for (let i = 0; i < AllUsers.length; i++) {
        if (FriendsArray.includes(AllUsers[i].id)) {
            Friends.push(AllUsers[i])
        }
    }
    Friends = Friends.map(item => {
        return `
        <div data-id=${item.id} class="Contact">
        <div data-id=${item.id}>
          <img data-id=${item.id} class="contactImage" src=${item.image || "Images/chatlogo.png"} alt="" />
        </div>
        <div data-friendId=${item.id}>
          <p data-id=${item.id} class="contactName">${item.name}</p>
          <p data-id=${item.id} class="contactEmail">${item.status || "Click on contact to start chat"}</p>
        </div>
      </div>
        `

    })
    let ContactContainer = document.getElementById("ContactContainer")
    ContactContainer.innerHTML = Friends.join("")

    let Contacts = document.getElementsByClassName("Contact");
    for (let i = 0; i < Contacts.length; i++) {
        Contacts[i].addEventListener("click", (e) => {
            PutFriendOrGroupActive(e.target.dataset.id);;
        })
    }
}

//? <!----------------------------------------------- < Put Friend Or Group Active> ----------------------------------------------->

function PutFriendOrGroupActive(id) {
    let AllUsers = JSON.parse(localStorage.getItem("AllUsers"))
    let ActiveFriend = {}
    for (let i = 0; i < AllUsers.length; i++) {
        if (AllUsers[i].id == id) {
            ActiveFriend = AllUsers[i]
            localStorage.setItem("ActiveFriend", JSON.stringify(AllUsers[i]))
            RenderActiveChat(ActiveFriend)
            break;
        }
    }
}

function RenderActiveChat(data) {
    FriendName.innerHTML = data.name
    FriendStatus.innerHTML = "online"
    CheckCurrFriend()
}
//? <!----------------------------------------------- < Adding a Friend> ----------------------------------------------->

async function AddFriendFunction(newFriend) {
    let uid = localStorage.getItem("UserID")
    let rid = newFriend.id
    let payload = JSON.parse(localStorage.getItem("UserFriends"))

    if (payload.includes(rid)) {
        swal(`${newFriend.name} is already in your contacts`, "", "info")
        return
    }
    payload.push(rid)
    await updateDoc(doc(db, "Users", uid), { friends: payload })
        .then((res) => {
            swal(`${newFriend.name} is now your Friend!`, "", "success")
        })
        .catch((err) => {
            swal(`${newFriend.name} is now your Friend!`, "", "success")
            console.log(err)
        })
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
                swal("Logout successful", "Redirecting to home Page", "success");
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
