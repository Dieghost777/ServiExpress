function verificarExistenciaUsuario() {
    var nombreUsuario = $('#nombreUsuarioadmin').val();
    var contrasena = $('#contrasenaadmin').val();

    $.ajax({
        type: 'POST',
        url: 'verificar_admin.php',
        data: {
            nombreUsuario: nombreUsuario,
            contrasena: contrasena
        },
        success: function(response) {
            try {
                var jsonResponse = JSON.parse(response);
                console.log(jsonResponse);

                if (jsonResponse.success) {
                    window.location.href = '../Padministrador/Administracion/Administracion.html';
                } else {
                    console.error('Usuario no encontrado');
                }
            } catch (error) {
                console.error('Error al analizar la respuesta JSON: ' + error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud AJAX: ' + status);
        }
    });
}
