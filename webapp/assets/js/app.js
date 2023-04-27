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
      input:'number',
      title: 'ID del Residente',
      text: 'Escriba el ID del residente al que se le asignará la placa',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        } else if (value.toString().length > 8 || value.toString().length <8){
          return 'Este campo debe tener 8 dígitos'
        }
      },
      footer:'El ID residente debe tener 8 dígitos númericos.',

    }
  ]).then((result) => {
    if(result.value) {
      let placa = JSON.stringify(result.value[0])
      let nombreResidente = JSON.stringify(result.value[1])
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la placa ${placa} a nombre de ${nombreResidente} en modo visitante?
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
      input:'number',
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
      let placa = JSON.stringify(result.value[0])
      let nombreResidente = JSON.stringify(result.value[1])
      Swal.fire({
        icon:'info',
        title: 'Confirmación',
        html: `
            ¿Desea dar de alta la placa ${placa} a nombre de ${nombreResidente} en modo visitante?
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
  Swal.fire({
    title:'Nueva Excepción',
    // footer:'xxx',
    width:'70%',
    focusConfirm:false,
    background:'#2c2c2c',
    showConfirmButton:true,
    confirmButtonText:'Crear Excepción.',
    cancelButtonText:'Cancelar.',
    showCancelButton:true,
    confirmButtonColor:'#198754',
    cancelButtonColor:'#dc3545',
    returnInputValueOnDeny: true,
    html: `
            <div class="formExeption">
              <section>
                <label for="opciones">Seleccione el tipo de excepción:</label> <br>
                  <select id="opciones" name="opciones">
                    <option value="opcion0" selected disabled>Ver opciones...</option>
                    <option value="opcion1">Paquetería.</option>
                    <option value="opcion2">Basurero.</option>
                    <option value="opcion3">Distribuidor.</option>
                    <option value="opcion4">Visita Inesperada.</option>
                    <option value="opcion5">Otro.</option>
                    </select>
              </section>
              <section>
                <label for="nPlaca">Numero de la Placa:</label> <br>  
                <input type="text" id="nPlaca" name="nPlaca" placeholder="Ingrese los dígitos de la placa">
              </section>
              <section class="section3">
                <label for="descripcion">Descripción:</label> <br>
                <input type="text" id="descripcion" name="descripcion" placeholder="Ingrese una descripción"><br>
              </section>
            </div>
    `,
  })
});
$('#formulario').submit(function (event) {
  event.preventDefault(); // evita el envío automático del formulario
  var response = grecaptcha.getResponse(); // obtén la respuesta del reCAPTCHA
  if (response.length === 0) { // si la respuesta está vacía, muestra un error
    alert('Por favor, verifica que eres humano.');
    return false;
  } else {
    // si la respuesta es válida, envía el formulario
    this.submit();
  }
});
