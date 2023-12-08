$(document).ready(function () {
    $("#loginButton").on("click", function () {
        verificarExistenciaUsuario();
    });
});

function cambiarTipoUsuario() {
    var tipoUsuario = document.getElementById("tipoUsuario").value;
    var idTipoUsuario = document.getElementById("idTipoUsuario");

    switch (tipoUsuario) {
        case 'cliente':
            idTipoUsuario.value = '1';
            break;
        case 'proveedor':
            idTipoUsuario.value = '2';
            break;
        case 'empleado':
            idTipoUsuario.value = '3';
            break;
        default:
            idTipoUsuario.value = '';
    }
}

function verificarExistenciaUsuario() {
    var nombreUsuario = $('#nombreUsuarioLogin').val();
    var contrasena = $('#contrasenaLogin').val();
    var idTipoUsuario = $('#idTipoUsuario').val();

    $.ajax({
        type: 'POST',
        url: 'verificar_usuario.php',
        data: {
            nombreUsuario: nombreUsuario,
            contrasena: contrasena,
            idTipoUsuario: idTipoUsuario
        },
        success: function(response) {
            console.log('Respuesta del servidor:', response); // Revisa la respuesta del servidor
            response = JSON.parse(response); // Parsea la respuesta a objeto JSON
            console.log('Mensaje devuelto:', response.message); // Muestra el mensaje devuelto por el servidor
            console.log('Tipo de idTipoUsuario:', typeof idTipoUsuario); // Verifica el tipo de idTipoUsuario

            if (response.success) {
                if (idTipoUsuario === '1') {
                    window.location.href = '../Páginas/PCliente/InicioClientes.html';
                } else if (idTipoUsuario === '2') {
                    window.location.href = '../Páginas/PProveedor/InicioProveedores.html';
                } else if (idTipoUsuario === '3') {
                    window.location.href = '../Páginas/PEmpleado/InicioEmpleados.html';
                }
            } else {
                console.error('Usuario no encontrado');
                // Manejar el error según sea necesario
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX: ' + error.status);
        }
    });
}
