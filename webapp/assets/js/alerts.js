import {setPlateResident, setNewException, getData, newResident,setPlateVisit} from './firebase.js' 

$('#nuevoResidente').click(function() {
  Swal.mixin({
    background:'#2c2c2c',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Siguiente',
    confirmButtonColor:'#198754',
    showCancelButton: true,
    cancelButtonColor:'#dc3545',
    allowOutsideClick:false,
    allowEscapeKey:false,
  }).queue([
    {
      input: 'text',
      title: 'Nombre Residente',
      text: 'Ingrese el nombre completo del nuevo residente.',
      inputAttributes:{
        minlength: 10,
        maxlength: 100,
      },
      customClass:{
        input:'capitalize'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <10){
          return 'Este campo está incompleto';
        }
      },
      // footer: "El formato a seguir es: AAA-00-00"
    }, //NOMBRE RESIDENTE
    {
      input:'text',
      title: 'Casa Residente',
      inputAttributes: {
        maxlength:5,
        minlength:2
      },
      text: 'Escriba el numero de casa del residente a registrar.',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <2){
          return 'Este campo está incompleto';
        }
      },
      customClass:{
        input:'uppercase'
      },
    }, //CASA RESIDENTE
    {
      input:'email',
      title: 'Email Residente',
      text: 'Escriba el email del residente a registrar',
      // inputValidator: (value) => {
      //   if (!value) {
      //     return 'Este campo es requerido';
      //   }else if(value.length <10){
      //     return 'Este campo está incompleto';
      //   }
      // }
    }, //EMAIL RESIDENTE
    {
      input:'number',
      title: 'Teléfono Residente',
      inputAttributes: {
        maxlength:10,
        max:9999999999
      },
      text: 'Escriba el numero de teléfono del residente a registrar.',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <10){
          return 'Este campo está incompleto';
        }else if(value.length >10){
          return 'Maximo dígitos superado'
        }
      }
    } //TELEFONO RESIDENTE
  ]).then(data => {
    
    if(data.value) {
      const nombre = data.value[0].toUpperCase()
      const casa = data.value[1].toUpperCase()
      const email = data.value[2].toUpperCase()
      const telefono = data.value[3]
      // console.log(nombre,casa,email,telefono)
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta al cliente: <small>${nombre}</small>, número de casa: <small>${casa}</small>,
            email: <small>${email}</small> y  teléfono: <small>${telefono}</small>?
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
          newResident(nombre,casa,email,telefono)
        }
      })
    }
  })
});

$('#nuevaPlacaResidente').click(function() {
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
      input: 'text',
      title: 'Placa Residente',
      text: 'Escriba los dígitos de la nueva placa del residente',
      footer:'Aviso: La placa residente es por tiempo indefinido.',
      inputAttributes:{
        minlength: 9,
        maxlength: 9,
      },
      customClass: {
        input: 'uppercase'
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
      input:'number',
      title: 'ID del Residente',
      inputAttributes: {
        maxlength:10,
        max:999999999
      },
      text: 'Escriba el ID del residente al que se le asignará la placa',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <9){
          return 'Este campo está incompleto';
        }else if(value.length >10){
          return 'Maximo dígitos superado'
        }
      },
      footer:'El ID residente debe ser el numero de telefono registrado',
    }
  ]).then(data => {
    
    if(data.value) {
      const placa = data.value[0].toUpperCase()
      const residentID = data.value[1]
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la placa <small>${placa}</small> al residente con ID <small>${residentID}</small>?
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
    allowOutsideClick:false,
    allowEscapeKey:false
  }).queue([
    {
      input: 'text',
      title: 'Placa Visitante',
      text: 'Escriba los dígitos de la nueva placa con privilegios de visitante',
      footer:'Aviso: La placa residente solo permite acceder una vez',
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
      input:'number',
      title: 'ID del Residente',
      inputAttributes: {
        maxlength:10,
        minlength:9999999999
      },
      text: 'Escriba el ID del residente al que se le asignará la placa',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }else if(value.length <9){
          return 'Este campo está incompleto';
        }else if(value.length >10){
          return 'Maximo dígitos superado'
        }
      },
      footer:'El ID residente debe ser el numero de telefono registrado',
    }
  ]).then(data => {
    
    if(data.value) {
      const placa = data.value[0].toUpperCase()
      const residentID = data.value[1]
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la placa <small>${placa}</small> con privilegios de visitante a nombre del residente con ID <small>${residentID}</small>?
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
          setPlateVisit(placa,residentID)
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
      text: 'Escriba una descripción del vehículo',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
      }
    },
    {
      input: 'text',
      title: 'Placa Excepción',
      text: 'Escriba los dígitos de la placa del vehiculo excepción:',
      inputAttributes:{
        minlength: 9,
        maxlength: 9
      },
      customClass : {
        input: 'uppercase'
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
      const tipo = data.value[0].toUpperCase()
      const descripcion = data.value[1].toUpperCase()
      const placa = data.value[2].toUpperCase()
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
    html: 'La puerta se cerrará en <small></small> <br>milisegundos',
    timer: 10000, 
    background:'#2c2c2c',
    allowOutsideClick:false,
    allowEscapeKey:false,
    // onOpen:, Esta funcion sirve para crear la función que abrá la puerta
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('small')
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