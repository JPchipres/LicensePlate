//import {getPost} from './firebase.js'

import { initializeApp } from "./firebase.js";
import { getFirestore, collection, addDoc, getDocs } from "./firebase.js";
import { app, db, auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase.js';

//import { auth } from './conection2.js';
console.log("Hello world");
//const auth = getAuth();
//const residentSignin = document.querySelector('#mainContainer'); //Login del residente
const residentSignin = document.querySelector("#mainContainer");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
//const platesList = document.querySelector(".residentes");
//const token = await grecaptcha.execute('6LfgzrwlAAAAAIW0bmnopyrCIp-tTHl7TrQqjv3l', {action: 'submit'});


//LOGIN
if(residentSignin){
    residentSignin.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('inputIDR').value;
        const password = document.getElementById('inputPasswd').value;

        //console.log(signinIDR, signinPasswd);

        /*if (!token) {
            // Si no hay token, el usuario no pasó la validación
            console.error('Debes completar el reCAPTCHA');
        }*/

        /*new function login(auth, email, password) {

            createUserWithEmailAndPassword() //se reciben los valores para el auth y se registra
            .then((userCredential) => {
                console.log('sign up');
            })
            .catch((error)=> {
                console.log(error.code, error.message);
            });   
        }*/

        signInWithEmailAndPassword(auth, email, password) //se reciben los valores para el auth y se registra
        .then((userCredential) => {
            window.location.href = "https://webapp.local.com/webapp/LicensePlate/webapp/main.html"; //Modifiquen este link a sus necesidades :)
            console.log('sign up');
        })
        .catch((error)=> {
            console.log(error.code, error.message);
        });
    });
};


//LOGOUT
if(logoutBtn){
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            window.location.href = "http://licenseplate.local.com/webapp/LicensePlate/webapp/"; //Modifiquen este link a sus necesidades x2
        }).catch((error) => {
            console.log(error.code, error.message);
        });
    });
};

