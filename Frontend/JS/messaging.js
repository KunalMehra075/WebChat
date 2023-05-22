import { auth, doc, db, setDoc, addDoc, collection, query, where, getDocs, onSnapshot } from "./firebase.js";


let spinner = document.getElementById("spinner")

CheckCurrFriend()

function CheckCurrFriend() {
    spinner.style.display = "block"//!SPINNER
    let CurrentFriend = localStorage.getItem("ActiveFriend")
    if (CurrentFriend) {
        CurrentFriend = JSON.parse(CurrentFriend);

        let rid = CurrentFriend.id
        let sid = localStorage.getItem("UserID")
        const collectionRef = collection(db, 'Messages');

        GetAllMessages(collectionRef, sid, rid)

        FriendName.innerHTML = CurrentFriend.name || ""
        FriendStatus.innerHTML = CurrentFriend ? "online" : "last seen recently"

        onSnapshot(collectionRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                GetAllMessages(collectionRef, sid, rid)
            });
        });
    }
    spinner.style.display = "none"//!SPINNER
}


let SendMessageForm = document.getElementById("SendMessageForm")
let msg = document.getElementById("msgInp")
SendMessageForm.addEventListener("submit", (e) => {
    spinner.style.display = "block"//!SPINNER

    let SecondPerson = localStorage.getItem("ActiveFriend")
    if (!SecondPerson) {
        swal("Please Select a chat before messaging", "", "info");
        return
    }
    e.preventDefault()

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateTime = `${day}/${month}/${year}T${hours}:${minutes}:${seconds}`;

    console.log(dateTime);
    console.log(new Date().toISOString());
    let message = {
        senderID: localStorage.getItem("UserID"),
        recieverID: JSON.parse(SecondPerson).id,
        text: msg.value,
        Time: dateTime,
    }
    // console.log(message);
    InsertMessageToDB(message)
    spinner.style.display = "none"//!SPINNER
    msg.value = ""
})

async function InsertMessageToDB(message) {
    const collectionRef = collection(db, 'Messages');
    await addDoc(collectionRef, message)
        .then((docRef) => {
            console.log("Message Sent from", message.senderID, "to", message.recieverID)
            GetAllMessages(collectionRef, message.senderID, message.recieverID)
        })
        .catch((error) => {
            console.error('Error adding document:', error);
        });
}

async function GetAllMessages(Collection, sid, rid) {


    const Q1 = query(Collection, where("senderID", '==', sid), where('recieverID', '==', rid));
    const Q2 = query(Collection, where('recieverID', '==', sid), where('senderID', '==', rid));

    let AllMsgs = []
    await getDocs(Q1)
        .then((msgs) => {
            let messages = []
            msgs.docs.forEach(doc => {
                messages.push({ ...doc.data(), id: doc.id })
            });
            AllMsgs = [...AllMsgs, ...messages]

        })
        .catch((error) => {
            console.log('Error getting documents:', error);
        });
    await getDocs(Q2)
        .then((msgs) => {
            let messages = []
            msgs.docs.forEach(doc => {
                messages.push({ ...doc.data(), id: doc.id })
            });
            AllMsgs = [...AllMsgs, ...messages]

        })
        .catch((error) => {
            console.log('Error getting documents:', error);
        });
    RenderMessages(AllMsgs)
}



function RenderMessages(Messages) {
    console.log(Messages);
    let uid = localStorage.getItem("UserID")
    Messages.sort((a, b) => a.Time.replace(/[^0-9]/g, '') - b.Time.replace(/[^0-9]/g, '')).slice(0, 20)
    Messages.sort((a, b) => a.Time - b.Time).slice(0, 20)
    Messages = Messages.map(item => {
        let firstUser = item.senderID == uid
        return `
        <div class="${firstUser ? "MsgLeft" : "MsgRight"} MsgInstance">
        <div>
          <img class="ChatSmolImgs" src="${firstUser ? "Images/chatlogo.png" : "Images/chatlogo.png"}" alt="" />
          <p style="position:relative;">${item.text} 

           <label class="showtime">${item.Time.split("T")[1]}</label>
          </p>
         
        </div>
      </div>
        `
    })

    let MessagesContainer = document.getElementById("MessagesContainer")
    MessagesContainer.innerHTML = Messages.join("")
    MessagesContainer.scrollTop = MessagesContainer.scrollHeight;
}


export { CheckCurrFriend }