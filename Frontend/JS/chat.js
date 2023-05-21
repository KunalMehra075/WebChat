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
            let friends = user.friends
            RenderUserDataOnPage(ActiveUser, UserEmail, UserID, UserIMG, friends)
            GetAllUsers()
        } else {
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
    let Users = users.map(item => {
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
            console.log(target);
            let AllUsers = JSON.parse(localStorage.getItem("AllUsers"))
            let newFriend;
            for (let i = 0; i < AllUsers.length; i++) {
                console.log(AllUsers[i].id, target);
                if (AllUsers[i].id == target) {
                    newFriend = AllUsers[i]
                    AddFriendFunction(newFriend);
                    break;
                }
            }

        })
    }

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




let SendMessageForm = document.getElementById("SendMessageForm")
let msg = document.getElementById("msgInp")
SendMessageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let message = {
        senderID: localStorage.getItem("UserID"),
        recieverID: localStorage.getItem("FriendID"),
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
