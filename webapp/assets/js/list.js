import { getAuth, auth, onAuthStateChanged } from "./firebase.js";
import { getFirestore, collection, addDoc, getDocs } from "./firebase.js";

const db = getFirestore();
const placas = collection(db, "placas");
const postList = document.querySelector('.tableContainer');
let num = 0; //solo es una visualización en la bitacora para el id
const setupData = () => {
    getDocs(placas).then((querySnapshot) => {
        if(querySnapshot.size > 0){
            let html = '';
            querySnapshot.forEach((plate) => {
                const placa = plate.data().placa;
                const entrada = plate.data().admission;
                const salida = plate.data().departure;
                const clase = plate.data().clase;
                console.log(`${placa}`);
                num = num+1;
                const tr = `
                    <tr>
                        <td>${num}</td>
                        <td>${placa}</td>
                        <td>${entrada.toDate().toLocaleDateString()}, ${entrada.toDate().getHours()}:${entrada.toDate().getMinutes()}</td>
                        <td>${salida.toDate().toLocaleDateString()}, ${salida.toDate().getHours()}:${salida.toDate().getMinutes()}</td>
                        <td>${clase}</td>
                    </tr>`;
                html += tr;
            });
            postList.innerHTML = 
            `<div class="tableContainer">
                <table>
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
        }else{
            postList.innerHTML = '<h1 class="text-center">No hay placas en registro</h1>'
        };
    });//snapchot muestra los datos que estan actualmente en la colección
    
};

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