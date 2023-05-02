// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs,getDoc, onSnapshot, doc, runTransaction} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// funcion que trae los datos de la bd
export const getData = () =>  getDocs(collection(db, 'placas'))

export const setPlateResident = (placa, residentID) => {
const residentesRef = collection(db, "residentes");
const residenteRef = doc(residentesRef, residentID);

// Verificar si el documento existe antes de agregar un nuevo vehículo
getDoc(residenteRef).then((docSnapshot) => { 
  if (docSnapshot.exists()) {
    const vehiculosRef = collection(residenteRef, "vehiculos");
    
    const nuevoVehiculo = {
      placa: placa,
    };
    // Agrega un nuevo documento a la subcolección "vehiculos", con la opción {merge: false} para evitar la creación de un nuevo documento si el ID no existe
    addDoc(vehiculosRef, nuevoVehiculo,{merge: false})
      .then((docRef) => {
        Swal.fire({
          icon: 'success',
          title:'¡Actualización Exitosa!',
          text: `La placa: ${nuevoVehiculo.placa} se almacenó correctamente al residente con el ID: ${docRef.id}`,
          showConfirmButton: false,
          background:'#2c2c2c',
          timer: 2000,
        })
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Ops...',
          text: 'Algo salió mal, por favor intentelo de nuevo',
          footer: `${error}`,
          timer: 2000,
        })
      });
  } else {
    Swal.fire({
      icon: 'error',
      title: '¡Inconsistencia!',
      text: `El documento con ID ${residentID} no existe en la colección 'residentes'. No se ha agregado el vehículo.`,
      timer:2000
    })
  }
  }).catch((error) => {
    console.log(`Error al verificar la existencia del documento ${residentID}: ${error}`);
  });

};




