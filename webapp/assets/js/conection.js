import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs }from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB2yVMtVd9yw7pHiS4di60hpRavqmspixc",
    authDomain: "licensesplate.firebaseapp.com",
    databaseURL: "https://licensesplate-default-rtdb.firebaseio.com",
    projectId: "licensesplate",
    storageBucket: "licensesplate.appspot.com",
    messagingSenderId: "807762520034",
    appId: "1:807762520034:web:7b468b96cf6d3e20df3bbb",
    measurementId: "G-8M23H2P4Z6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
//const analytics = getAnalytics(app);

//export const getPost = ()=>getDocs(collection(db, 'residentes'));
export { initializeApp }
export { app, db, auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
export { getFirestore, collection, addDoc, getDocs };