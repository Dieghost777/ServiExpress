function verificarExistenciaUsuario() {
    var nombreUsuario = $('#nombreUsuarioadmin').val();
    var contrasena = $('#contrasenaadmin').val();


    $.ajax({
        type: 'POST',
        url: 'verificar_admin.php',
        data: {
            nombreUsuario: nombreUsuario,
            contrasena: contrasena,
         
        },
        success: function(response) {
            var jsonResponse = JSON.parse(response);
            console.log(jsonResponse);

            if (jsonResponse.success) {
                        window.location.href = '../Páginas/PCliente/InicioClientes.html';
             
                
            } else {
                console.error('Usuario no encontrado');
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX: ' + error.status);
        }
    });
}