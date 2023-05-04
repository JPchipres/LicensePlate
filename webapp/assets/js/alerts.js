import {setPlateResident, setNewException, getData} from './firebase.js' 

const table = document.getElementById('datos');

window.addEventListener('DOMContentLoaded', async () =>{

  const querySnapshot = await getData()
  let i = 1
  
  let html = ''

  querySnapshot.forEach(data => {
    const doc = data.data()
    const num = i++
    const timestamp = doc.admission
    const date = timestamp.toDate()
    const fechaEntrada = date.toLocaleString()
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
  table.innerHTML = html;
})

$('#nuevaPlacaResidente').click(function() {
  Swal.mixin({
    background:'#2c2c2c',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Siguiente',
    confirmButtonColor:'#198754',
    showCancelButton: true,
    cancelButtonColor:'#dc3545',
    // progressSteps: ['1', '2'],
    allowOutsideClick:false,
    allowEscapeKey:false
  }).queue([
    {
      input: 'text',
      title: 'Placa Residente',
      text: 'Escriba los dígitos de la nueva placa del residente',
      footer:'Aviso: La placa residente es por tiempo indefinido.',
      inputAttributes:{
        minlength: 9,
        maxlength: 9,
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <9){
          return 'Este campo está incompleto';
        }
      },
      footer: "El formato a seguir es: AAA-00-00"
    },
    {
      input:'text',
      title: 'ID del Residente',
      inputAttributes: {
        maxlength:10,
        minlength:10
      },
      text: 'Escriba el ID del residente al que se le asignará la placa',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <9){
          return 'Este campo está incompleto';
        }
      },
      footer:'El ID residente debe ser el numero de telefono registrado',
    }
  ]).then(data => {
    
    if(data.value) {
      const placa = data.value[0]
      const residentID = (data.value[1])
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la placa ${placa} al residente con ID ${residentID}?
        `,
        background:'#2c2c2c',
        confirmButtonColor:'#198754',
        confirmButtonText: 'Dar de alta',
        cancelButtonText:'Cancelar',
        showCancelButton:true,
        cancelButtonColor:'#dc3545',
        allowOutsideClick:false,
        allowEscapeKey:false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2000); // Simulación de una operación asincrónica
          });
        }
      }).then((data) => {
        if(data.isConfirmed){
          setPlateResident(placa,residentID)
        }
      })
    }
  })
});

$('#nuevaPlacaVisitante').click(function() {
  Swal.mixin({
    background:'#2c2c2c',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Siguiente',
    confirmButtonColor:'#198754',
    showCancelButton: true,
    cancelButtonColor:'#dc3545',
    // progressSteps: ['1', '2'],
    allowOutsideClick:false,
    allowEscapeKey:false
  }).queue([
    {
      input: 'text',
      title: 'Placa Visitante',
      text: 'Escriba los dígitos de la nueva placa del visitante',
      footer:'Aviso: La placa visitante solo será valida por 1 día.',
      inputAttributes:{
        minlength: 9,
        maxlength: 9
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <9){
          return 'Este campo está incompleto';
        }
      }
    },
    {
      input:'text',
      title: 'ID del Residente',
      text: 'Escriba el ID del Residente',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        } else if (value.toString().length > 8 || value.toString().length <8){
          return 'Este campo debe tener 8 digitos'
        }
      }
    }
  ]).then((result) => {
    if(result.value) {
      const placa = result.value[0]
      const residentID = result.value[1]
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la placa ${placa} a nombre de ${residentID} en modo visitante?
        `,
        background:'#2c2c2c',
        confirmButtonColor:'#198754',
        confirmButtonText: 'Dar de alta',
        cancelButtonText:'Cancelar',
        showCancelButton:true,
        cancelButtonColor:'#dc3545',
        allowOutsideClick:false,
        allowEscapeKey:false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2000); // Simulación de una operación asincrónica
          });
        }

      })
    }
  })
});

$('#nuevaExcepcion').click(function() {
  Swal.mixin({
    background:'#2c2c2c',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Siguiente',
    confirmButtonColor:'#198754',
    showCancelButton: true,
    cancelButtonColor:'#dc3545',
    allowOutsideClick:false,
    allowEscapeKey:false
  }).queue([
    {
      title: 'Tipo de Excepción',
      text: 'Seleccione el tipo de excepción a registrar',
      input: 'select',
      inputPlaceholder: 'Selecccione una opcion',
      inputOptions:{
        Paqueteria : "Paquetería.",
        Basura : "Basura.",
        Repartidor : "Repartidor.",
        Visita:"Visita Inesperada.",
        Distribuidor: "Distribuidor.",
        Otro: "Otro."
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
      }
    },
    {
      input:'text',
      title: 'Descripción',
      text: 'Escriba una descripción del vehículo y cantidad de personas que transporta:',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
      }
    },{
      input: 'text',
      title: 'Placa Excepción',
      text: 'Escriba los dígitos de la placa del vehiculo excepción:',
      inputAttributes:{
        minlength: 9,
        maxlength: 9
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <9){
          return 'Este campo está incompleto';
        }
      }
    }
  ]).then(data => {
    
    if(data.value) {
      const tipo = data.value[0]
      const descripcion = data.value[1]
      const placa = data.value[2]
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la excepción de tipo <small>${tipo}</small>, con la placa <small>${placa}</small>?
        `,
        background:'#2c2c2c',
        confirmButtonColor:'#198754',
        confirmButtonText: 'Dar de alta',
        cancelButtonText:'Cancelar',
        showCancelButton:true,
        cancelButtonColor:'#dc3545',
        allowOutsideClick:false,
        allowEscapeKey:false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2000); // Simulación de una operación asincrónica
          });
        }
      }).then((data) => {
        if(data.isConfirmed){
          setNewException(tipo, placa, descripcion)
        }
      })
    }
  })
});


$('#abrirPuerta').click(function() {
  let timerInterval
  Swal.fire({
    title: 'PUERTA ABIERTA',
    html: 'La puerta se cerrará en <b></b> <br>milisegundos',
    timer: 10000, 
    background:'#2c2c2c',
    allowOutsideClick:false,
    allowEscapeKey:false,
    // onOpen:, Esta funcion sirve para crear la función que abrá la puerta
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  })
});