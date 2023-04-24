import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
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

export const getPost =()=>getDocs(collection(db, 'registros'))

export { app, db };