import {getPost} from './firebase.js'
const tablaGeneral = document.getElementById('datos')
window.addEventListener('DOMContentLoaded', async ()=>{
    const querySnapshot = await getPost()
    console.log(querySnapshot)
    let html = ''
    querySnapshot.forEach(doc =>{
        const datos = doc.data()
        html += ` 
        <tr>
            <td>1</td>
            <td>${datos.placa}</td>
            <td>${datos.fe_ingreso.toDate().toLocaleDateString()}, ${datos.fe_ingreso.toDate().getHours()}:${datos.fe_ingreso.toDate().getMinutes()}</td>
            <td>${datos.fe_salida.toDate().toLocaleDateString()}, ${datos.fe_ingreso.toDate().getHours()}:${datos.fe_ingreso.toDate().getMinutes()}</td>
            <td>${datos.clase}</td>
        </tr>  
        `
    })
    tablaGeneral.innerHTML = html
})

