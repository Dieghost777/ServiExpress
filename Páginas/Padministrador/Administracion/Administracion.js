function mostrarSeccion(idSeccion) {
    var secciones = document.querySelectorAll('.main > div');
    for (var i = 0; i < secciones.length; i++) {
        secciones[i].style.display = 'none';
    }
    var seccionMostrada = document.getElementById(idSeccion);
    if (seccionMostrada) {
        seccionMostrada.style.display = 'block';
    }
}


$(document).ready(function() {
    // Función para mostrar secciones


    // Llenar la tabla con los datos de las boletas desde el servidor
    $.ajax({
        url: 'verboletas.php',
        type: 'GET',
        success: function(data) {
            $('#tablaBoletas tbody').html(data);
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los datos: ' + error);
        }
    });

    // Manejar el clic en "Editar" en una fila de la tabla
    $('#tablaBoletas').on('click', '.editar-btn', function(event) {
        const fila = $(this).closest('tr');
        const idBoleta = fila.find('.id-boleta').text();
        const nombreCliente = fila.find('.nombre-cliente').text();
        const fechaEmision = fila.find('.fecha-emision').text();
        const monto = fila.find('.monto').text();

        // Llenar el formulario de edición con los datos de la fila
        $('#idBoleta').val(idBoleta);
        $('#nombreCliente').val(nombreCliente);
        $('#fechaEmision').val(fechaEmision);
        $('#monto').val(monto);

        // Mostrar el formulario de edición y ocultar la tabla
        $('#tablaBoletas').hide();
        $('#formularioEdicion').show();

        $('.card').show(); // Mostrar la tarjeta
    });

    // Manejar el envío del formulario de edición
    $('#guardarCambios').click(function() {
        var idBoleta = $('#idBoleta').val();
        var fechaEmision = $('#fechaEmision').val();
        var monto = $('#monto').val();
        
        $.ajax({
            url: 'actualizarBoleta.php',
            type: 'POST',
            data: {
                idBoleta: idBoleta,
                fechaEmision: fechaEmision,
                monto: monto
            },
            success: function(response) {
                console.log(response); // Manejar la respuesta del servidor
                // Aquí podrías actualizar la interfaz de usuario si la actualización fue exitosa
            },
            error: function(xhr, status, error) {
                console.error('Error al actualizar los datos: ' + error);
                // Manejar el error en la actualización si es necesario
            }
        });
    });

    // Manejar el clic en el botón "Volver"
    $('#volverBtn').click(function() {
        $('#formularioEdicion').hide();
        $('#tablaBoletas').show();
        $('.card').hide(); // Mostrar la tarjeta

    });
});
