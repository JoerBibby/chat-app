import React, { useState, useRef } from "react";
import './App.css';


import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";



import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore";

// configure project with firebase 
var firebaseConfig = {
  apiKey: "AIzaSyBV5uiOLLTUMGD-DUkoA5YP7qRUx3udiZo",
  authDomain: "chat-app-9f5e9.firebaseapp.com",
  projectId: "chat-app-9f5e9",
  storageBucket: "chat-app-9f5e9.appspot.com",
  messagingSenderId: "345168607643",
  appId: "1:345168607643:web:317969d0ab0c3d5347c93e"
};

firebase.initializeApp(firebaseConfig);
// create objects in order to access the auth and firestore databse methods
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  
  const [user] = useAuthState(auth);

  return (
    //render chatroom if user is signed in, render sign in interface if not
    <div className="App">
      <header>
        {user ? <Signout /> : <div></div> }
      </header>    
      <section>
        {user ?
          <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}



function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}



function Signout() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}



function ChatRoom() {

  const dummy = useRef()
  // get messages in order of creation, useCollectionData listens for updates also, and chatRoom renders again when 
  // data changes because this is a stateful value. Thus messages show in real time
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  // take input from user, store it here to write to database
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {

    e.preventDefault();
    // get user info to attach to the document
    const { uid, photoURL } = auth.currentUser;
    // write document representing sent message
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    // clear the input box when the user has sent the message
    setFormValue("");
    // this causes the messages to scroll to the bottom, always showing the most recently sent one
    dummy.current.scrollIntoView({ behaviour: "smooth" });
  }

  return (
    <div>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div className="dummy" ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => { setFormValue(e.target.value) }} />
        <button type="submit">send</button>
      </form>
    </div>


  )
}


// render the message
function ChatMessage(props) {

  const { text, uid, photoURL } = props.message;
  // check userID attached to message against userID of currently logged in user, display message on the left or right accordingly.
  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
