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
const postList = document.querySelector('.tableContainer');
window.addEventListener('DOMContentLoaded', async () => {
  const itemsPerPage = 5; // Número de elementos por página
  let currentPage = 1; // Página actual
  let totalItems = 0;
  let totalPages = 0;
  let currentItems = [];

  // Obtén una referencia a la colección "tuColeccion" en Firestore
  const tuColeccion = collection(db, 'registro');
  const q = query(tuColeccion);

  // Agrega un listener que se ejecutará cada vez que se agregue, modifique o elimine un documento en la colección
  onSnapshot(q, (snapshot) => {
    totalItems = snapshot.size;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    let i = 1;
    let html = '';

    if (snapshot.empty) {
      html = '<tr><td colspan="5">No hay entradas aún</td></tr>';
      table.innerHTML = html;
    }
    // Recorre los documentos de la colección y actualiza la tabla con los datos actualizados
    currentItems = [];
    snapshot.forEach(data => {
      const placa = data.data().placa;
      const num = i++;
      const fechaHora = data.data().fecha_hora;
      const estado = data.data().estado;
      const clase = data.data().clase;
      currentItems.push(`
        <tr class="data"> 
          <td>${num}</td>
          <td>${placa}</td>
          <td>${fechaHora.toDate().toLocaleDateString()}, ${fechaHora.toDate().getHours()}:${fechaHora.toDate().getMinutes()}</td>
          <td>${estado}</td>
          <td>${clase}</td>
        </tr>
      `);
  });
  updateTable();
  updatePagination();
});
function updateTable() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = currentItems.slice(startIndex, endIndex);
  table.innerHTML = itemsToShow.join('');
}

function updatePagination() {
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const currentPageSpan = document.getElementById('currentPage');
  const paginationContainer = document.getElementById('paginationContainer');
  currentPageSpan.innerText = currentPage.toString();

  while (paginationContainer.firstChild) {
    paginationContainer.firstChild.remove();
  }
  const paginationList = document.createElement('ul');
  paginationList.classList.add('pagination');

  const prevItem = createPaginationItem('Anterior', currentPage > 1, () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });
  paginationList.appendChild(prevItem);

  for (let page = 1; page <= totalPages; page++) {
    const pageItem = createPaginationItem(page.toString(), page !== currentPage, () => {
      if (page !== currentPage) {
        goToPage(page);
      }
    });
    paginationList.appendChild(pageItem);
  }
  const nextItem = createPaginationItem('Siguiente', currentPage < totalPages, () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });
  paginationList.appendChild(nextItem);
  paginationContainer.appendChild(paginationList);

  function createPaginationItem(text, enabled, onClick) {
    const listItem = document.createElement('li');
    listItem.classList.add('page-item');
    const link = document.createElement('a');
    link.classList.add('page-link');
    link.href = '#';
    link.innerText = text;
    link.addEventListener('click', onClick);
    listItem.appendChild(link);
    return listItem;
  }
}
function setActivePage(pageNumber) {
  const paginationContainer = document.getElementById('paginationContainer');
  const pages = paginationContainer.querySelectorAll('.page-item');

  pages.forEach((page) => {
    page.classList.remove('active');
    const pageLink = page.querySelector('.page-link');
    if (pageLink.innerText === pageNumber.toString()) {
      page.classList.add('active');
    }
  });
}

function goToPage(page) {
  currentPage = page;
  setActivePage(page);
  updateTable();
  updatePagination();
}

document.getElementById('nextButton').addEventListener('click', () => {
  if (currentPage < totalPages) {
  goToPage(currentPage + 1);
  }
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
          permiso : 1
        };
        const nuevoRegistro = {
          admission : new Date().toISOString(),
          clase : "RESIDENTE",
          descripcion : "",
          estado : "Ingreso",
          hora_salida : new Date().toISOString(),
          placa : placa,
          permiso : 1
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
              timer: 4000,
            });
            setDoc(doc(db,"placas",placa), nuevoRegistro)
            .then(() => {
            Swal.fire({
              icon: "success",
              title: "¡Registrado Exitosamente!",
              text: `La placa: ${nuevoVehiculo.placa} se almacenó correctamente en placas con el ID: ${residentID}`,
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
    clase : tipo,
    descripcion : descripcion,
    estado : estado,
    hora_salida : fechaHoraActual,
    placa : placa,
    permiso : 1
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
          placa : placa,
          permiso : 1,
        };
        const nuevoRegistro = {
          admission : new Date().toISOString(),
          clase : "VISITANTE",
          descripcion : "",
          estado : "Ingreso",
          hora_salida : new Date().toISOString(),
          placa : placa,
          permiso : 1
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
            setDoc(doc(db,"placas",placa), nuevoRegistro)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "¡Actualización Exitosa!",
                text: `La placa: ${nuevaVisita.placa} se almacenó correctamente en placas`,
                showConfirmButton: false,
                background: "#2c2c2c",
                timer: 2000,
              });
          }).catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Ops...",
              text: "Algo salió mal, por favor intentelo de nuevo",
              footer: `${error}`,
              background: "#2c2c2c",
            });
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


