document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formularioProveedor').addEventListener('submit', function(event) {
      event.preventDefault();
  
      var nombreEmpresa = document.getElementById('nombreEmpresa').value;
      var correo = document.getElementById('correo').value;
      var contacto = document.getElementById('contacto').value;
      var rubro = document.getElementById('rubro').value;
      var contrasena = document.getElementById('contrasena').value;
      var nombreUsuario = document.getElementById('nombreUsuario').value;
      var rut = document.getElementById('rut').value;
  
      var datosProveedor = {
        nombreEmpresa: nombreEmpresa,
        correo: correo,
        contacto: contacto,
        rubro: rubro,
        contrasena: contrasena,
        nombreUsuario: nombreUsuario,
        rut: rut
      };
  
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'registro_proveedor.php', true);
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
  
      xhr.send(JSON.stringify(datosProveedor));
    });
  });
  