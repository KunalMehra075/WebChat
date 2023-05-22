import { auth, doc, db, setDoc, addDoc, collection, query, where, getDocs } from "./firebase.js";


CheckCurrFriend()

function CheckCurrFriend() {
    let CurrentFriend = localStorage.getItem("ActiveFriend")
    if (CurrentFriend) {
        FriendName.innerHTML = JSON.parse(CurrentFriend).name || ""
        FriendStatus.innerHTML = CurrentFriend ? "online" : "last seen recently"
        const collectionRef = collection(db, 'Messages');
        CurrentFriend = JSON.parse(CurrentFriend);
        let rid = CurrentFriend.id
        let sid = localStorage.getItem("UserID")
        console.log(rid, sid);
        GetAllMessages(collectionRef, sid, rid)
    }
}


let SendMessageForm = document.getElementById("SendMessageForm")
let msg = document.getElementById("msgInp")
SendMessageForm.addEventListener("submit", (e) => {
    let SecondPerson = localStorage.getItem("ActiveFriend")
    if (!SecondPerson) {
        swal("Please Select a chat before messaging", "", "info");
        return
    }
    e.preventDefault()
    let message = {
        senderID: localStorage.getItem("UserID"),
        recieverID: JSON.parse(SecondPerson).id,
        text: msg.value,
        Time: new Date().toLocaleString(),
    }
    // console.log(message);
    InsertMessageToDB(message)
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

    console.log(AllMsgs);
    RenderMessages(AllMsgs)

}


function RenderMessages(Messages) {
    let uid = localStorage.getItem("UserID")
    Messages.sort((a, b) => a.Time.replace(/[^0-9]/g, '') - b.Time.replace(/[^0-9]/g, ''))
    Messages = Messages.map(item => {
        let firstUser = item.senderID == uid
        return `
        <div class="${firstUser ? "MsgLeft" : "MsgRight"} MsgInstance">
        <div>
          <img class="ChatSmolImgs" src="${firstUser ? "Images/chatlogo.png" : "Images/chatlogo.png"}" alt="" />
          <p style="position:relative;">${item.text} 
          <label class="showtime">${item.Time.split(",")[1]}</label>
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