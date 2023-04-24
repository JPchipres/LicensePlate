//import {getPost} from './firebase.js'

console.log("Hello world");
const residentSignin = document.querySelector('#formContainer'); //Login del residente

residentSignin.addEventListener('submit', (e) => {
    e.preventDefault();

    const signinIDR = document.querySelector('#inputIDR');
    const signinPasswd = document.querySelector('#inputPasswd');

    console.log(signinIDR, signinPasswd);
});