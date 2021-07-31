import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDVyAuYyG-ndWA7_mIky-0cBDFVrZf2SFA",
  authDomain: "instagram-clone-react-fde1e.firebaseapp.com",
  databaseURL:
    "https://instagram-clone-react-fde1e-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-fde1e",
  storageBucket: "instagram-clone-react-fde1e.appspot.com",
  messagingSenderId: "633170787066",
  appId: "1:633170787066:web:319c8024c62ff8930a6743",
  measurementId: "G-4FGWXJPMB1",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
