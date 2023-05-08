// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getFirestore, collection, getDocs,query, setDoc,getDoc, doc, onSnapshot} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js"
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
}
const table = document.getElementById('datos');
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

window.addEventListener('DOMContentLoaded', async () => {

  // Obtén una referencia a la colección "tuColeccion" en Firestore
  const tuColeccion = collection(db, 'placas');
  const q = query(tuColeccion);

  // Agrega un listener que se ejecutará cada vez que se agregue, modifique o elimine un documento en la colección
  onSnapshot(q, (snapshot) => {

    let i = 1;
    let html = '';

    if(snapshot.empty){
      html = '<tr><td colspan="5">No hay entradas aún</td></tr>'
      table.innerHTML = html;
    }


    // Recorre los documentos de la colección y actualiza la tabla con los datos actualizados
    snapshot.forEach(data => {
      const doc = data.data();
      const num = i++;
      const timestamp = doc.admission;
      const date = timestamp.toDate();
      const fechaEntrada = date.toLocaleString();
      html += `
        <tr> 
          <td>${num}</td>
          <td>${doc.placa}</td>
          <td>${fechaEntrada}</td>
          <td>${doc.estado}</td>
          <td>${doc.clase}</td>
        </tr>
      `
      
    });

    // Actualiza la tabla con los datos actualizados
    table.innerHTML = html;
  });
});


// Funcion que trae los datos de la bd
export const getData = () =>  getDocs(collection(db, 'placas'))

// Función que el crea una placa nueva a un residente existente
export const setPlateResident = (placa, residentID) => {
  const residentesRef = collection(db, "residentes");
  const residenteRef = doc(residentesRef, residentID);

  // Verificar si el documento existe antes de agregar un nuevo vehículo
  getDoc(residenteRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const vehiculosRef = collection(residenteRef, "vehiculos");

        const nuevoVehiculo = {
          placa : placa,
          estado : 1,
        };
 
        // Establece un documento con el ID personalizado vehiculoID en la subcolección "vehiculos"
        setDoc(doc(vehiculosRef, placa), nuevoVehiculo)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "¡Actualización Exitosa!",
              text: `La placa: ${nuevoVehiculo.placa} se almacenó correctamente al residente con el ID: ${residentID}`,
              showConfirmButton: false,
              background: "#2c2c2c",
              timer: 2000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Ops...",
              text: "Algo salió mal, por favor intentelo de nuevo",
              footer: `${error}`,
              background: "#2c2c2c",
            });
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Inconsistencia!",
          text: `El documento con ID ${residentID} no existe en la colección 'residentes'. No se ha agregado el vehículo.`,
          background: "#2c2c2c",
          timer:2000,
          showConfirmButton: false
        });
      }
    })
    .catch((error) => {
      // console.log(`Error al verificar la existencia del documento ${residentID}: ${error}`);
      Swal.fire({
        icon: "error",
        title: "Ops...",
        text: `Error al verificar la existencia del documento ${residentID}`,
        footer: `${error}`,
        background: "#2c2c2c",
      });
    });
}

// Funcion que almacena una nueva entrada de excepcion dentro de la base de datos
export const setNewException = (tipo, placa, descripcion) => {
  const placasRef = collection(db,'placas')
  const estado = "Ingreso"
  const fechaHoraActual = new Date();

  const nuevaExcepcion = {
    admission : fechaHoraActual,
    descripcion : descripcion,
    placa : placa,
    clase : tipo,
    estado : estado
  }
  setDoc(doc(placasRef,placa),nuevaExcepcion)
  .then(() => {
    let timerInterval
    // Swal.fire({
    //   icon:'success',
    //   title: 'PUERTA ABIERTA',
    //   html: 'La puerta se cerrará en <small></small> <br>milisegundos',
    //   timer: 10000, 
    //   background:'#2c2c2c',
    //   allowOutsideClick:false,
    //   allowEscapeKey:false,
      // onOpen:, Esta funcion sirve para crear la función que abrá la puerta
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading()
    //     const b = Swal.getHtmlContainer().querySelector('small')
    //     timerInterval = setInterval(() => {
    //       b.textContent = Swal.getTimerLeft()
    //     }, 100)
    //   },
    //   willClose: () => {
    //     clearInterval(timerInterval)
    //   },
    // }).then((result) => {
    //   /* Read more about handling dismissals below */
    //   if (result.dismiss === Swal.DismissReason.timer) {
    //     console.log('I was closed by the timer')
    //   }
    // })
  }).catch(e => console.error(e))
}

// Funcion que almacena un nuevo residente dentro de la base de datos
export const newResident = (nombre,casa,email,telefono) => {
  
  const residentesRef = collection(db, "residentes");
  const docRef = doc(residentesRef,telefono)
  
  const nuevoResidente = {
    phone : telefono,
    name : nombre,
    home : casa,
    email : email
  }
  getDoc(docRef).then((document) => {
    if (document.exists()) {
      Swal.fire({
        icon: "error",
        title: "Ops...",
        text: `Algo salió mal, el residente con numero de teléfono <small>${nuevoResidente.phone}</small> ya se encuentra registrado`,
        background: "#2c2c2c",
      });
    } else {
      setDoc(docRef,nuevoResidente).then(() => {
        Swal.fire({
          icon: "success",
          title: "¡Actualización Exitosa!",
          text: `El residente: ${nuevoResidente.name} se registró correctamente `,
          showConfirmButton: false,
          background: "#2c2c2c",
          timer: 2000,
        });
      }).catch(error => {
        Swal.fire({
          icon: "error",
          title: "Ops...",
          text: "Algo salió mal, por favor intentelo de nuevo",
          footer: `${error}`,
          background: "#2c2c2c",
        });
      });
    }
  }).catch((error) => {
    console.log("Error al comprobar el documento:", error);
  }); 
  
  
  
  

  
}

//Función que el crea una placa con privilegios de visitante nueva a un residente existente
export const setPlateVisit = (placa, residentID) => {
  const residentesRef = collection(db, "residentes");
  const residenteRef = doc(residentesRef, residentID);

  // Verificar si el documento existe antes de agregar un nuevo vehículo
  getDoc(residenteRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const vehiculosRef = collection(residenteRef, "visitantes");

        const nuevaVisita = {
          placa: placa,
          status: 1,
        };
 
        // Establece un documento con el ID personalizado vehiculoID en la subcolección "vehiculos"
        setDoc(doc(vehiculosRef, placa), nuevaVisita)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "¡Actualización Exitosa!",
              text: `La placa: ${nuevaVisita.placa} se almacenó correctamente al residente con el ID: ${residentID}`,
              showConfirmButton: false,
              background: "#2c2c2c",
              timer: 2000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Ops...",
              text: "Algo salió mal, por favor intentelo de nuevo",
              footer: `${error}`,
              background: "#2c2c2c",
            });
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Inconsistencia!",
          text: `El documento con ID ${residentID} no existe en la colección 'residentes'. No se ha agregado el vehículo.`,
          background: "#2c2c2c",
          timer:2000,
          showConfirmButton: false
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Ops...",
        text: `Error al verificar la existencia del documento ${residentID}`,
        footer: `${error}`,
        background: "#2c2c2c",
      });
    });
}


