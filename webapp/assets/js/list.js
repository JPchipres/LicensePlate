import { getAuth, auth, onAuthStateChanged } from "./firebase.js";
import { getFirestore, collection, addDoc, getDocs } from "./firebase.js";

const db = getFirestore();
const placas = collection(db, "registro");
const postList = document.querySelector('.tableContainer');
let num = 0; //solo es una visualización en la bitacora para el id
const setupData = () => {
    getDocs(placas).then((querySnapshot) => {
        if(querySnapshot.size > 0){
            let html = '';
            querySnapshot.forEach((register) => {
                const placa = register.data().placa;
                const hora_salida= register.data().fecha_hora;
                const estado = register.data().estado;
                const clase = register.data().clase;
                console.log(`${placa}`);
                num = num+1;
                const tr = `
                    <tr class="data">
                        <td>${num}</td>
                        <td>${placa}</td>
                        <td>${hora_salida.toDate().toLocaleDateString()}, ${hora_salida.toDate().getHours()}:${hora_salida.toDate().getMinutes()}</td>
                        <td>${estado}</td>
                        <td>${clase}</td>
                    </tr>`;
                html += tr;
            });
            postList.innerHTML = 
            `<div class="tableContainer">
                <table id="table" class="table">
                   <thead>
                     <tr>
                       <th width="5%">ID</th>
                       <th width="15%">Placa</th>
                       <th width="25%">Fecha y Hora de Entrada</th>
                       <th width="25%">Fecha y Hora de Salida</th>
                       <th width="30%">Clase</th>
                     </tr>
                   </thead>
                   <tbody>
                        ${html}
                   </tbody>
                </table>
            </div> `;


            //DATATABLE
            /*$(document).ready(function() {
              const dataTable = $('.table').DataTable({
                paging: false,
                info: false,
                filter: false,
                "language": {
                  "url": "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json"
                }
              });

              const searcher = document.querySelector('.searchContainer input');
                searcher.addEventListener('keyup', function(){
                  dataTable.search($(this).val()).draw();
              });
            });*/

            /**const dataTable = $('.table').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json"
                },
                "table": {
                  "width": "90%",
                  "margin": "0 auto",
                  "font-family": "'Roboto',sans-serif",
                  "font-size": "2.2 rem"
                }
            })**/

        }else{
            postList.innerHTML = '<h1 class="text-center">No hay placas en registro</h1>'
        };
    });//snapchot muestra los datos que estan actualmente en la colección
    
};

//BUSCADOR
document.addEventListener("keyup", e=>{
  if(e.target.matches(".buscador")){

    if(e.key === 27)e.target.value = ""

    document.querySelectorAll(".data").forEach(register =>{
      register.textContent.toLowerCase().includes(e.target.value.toLowerCase())
      ?register.classList.remove("filter")
      :register.classList.add("filter")
    });
  
  };

});

if(onAuthStateChanged){
    auth.onAuthStateChanged( user =>{ //me fallo un poco la logica aqui, no tengo idea de porque
        if(!user){ 
            console.log('En sesión');
            setupData();
        }else{
            console.log('Fuera de sesión');
        };
    });
};



  