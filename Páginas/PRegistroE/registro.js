document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formularioEmpleado').addEventListener('submit', function(event) {
      event.preventDefault();
  
      var nombre = document.getElementById('nombre').value;
      var apellidoPaterno = document.getElementById('apellidoPaterno').value;
      var apellidoMaterno = document.getElementById('apellidoMaterno').value;
      var cargo = document.getElementById('cargo').value;
      var rut = document.getElementById('rut').value;
      var correo = document.getElementById('correo').value;
      var nombreUsuario = document.getElementById('nombreUsuario').value;
      var contrasena = document.getElementById('contrasena').value;
  
      // Crear objeto con los datos a enviar al servidor
      var datosEmpleado = {
        nombre: nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        cargo: cargo,
        rut: rut,
        correo: correo,
        nombreUsuario: nombreUsuario,
        contrasena: contrasena
      };
  
      // Enviar datos al servidor mediante AJAX
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'registroempleado.php', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
  
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            document.getElementById('mensaje').innerHTML = respuesta.mensaje;
          } else {
            console.error('Hubo un problema con la solicitud.');
          }
        }
      };
  
      xhr.send(JSON.stringify(datosEmpleado));
    });
  });
  