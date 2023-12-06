function mostrarError(mensaje) {
    $('#error-message').text(mensaje).show();
}

$(document).ready(function() {
    // Obtener los nombres y precios de los servicios y llenar el combo box
    $.ajax({
        url: 'obtener_servicios.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var servicioSelect = $('#servicio');
            servicioSelect.empty().append('<option value="">Selecciona un servicio</option>'); // Vaciar y agregar la opción por defecto

            // Llenar el combo box con los nombres y precios de los servicios obtenidos
            data.forEach(function(service) {
                servicioSelect.append('<option value="' + service.id_servicio + '" data-precio="' + service.Precio_serv + '">' + service.Desc_serv + ' - Precio: ' + service.Precio_serv + '</option>');
            });
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los servicios:', status, error);
        }
    });

    // Manejar el envío del formulario de reserva
$(document).ready(function() {
    $('#reservaForm').submit(function(event) {
        event.preventDefault(); // Evitar envío del formulario por defecto

        // Validar que todos los campos estén llenos
        if (validarCampos()) {
            // Obtener los datos del formulario
            var fecha = $('#fecha').val();
            var hora = $('#hora').val();
            var servicio = $('#servicio').val();
            var precioServicio = $('#servicio option:selected').data('precio');
            var formData = {
                fecha: fecha,
                hora: hora,
                servicio: servicio,
                precioServicio: precioServicio
            };

            console.log('Datos a enviar a ReservaHora.php:', formData);

            // Hacer la solicitud AJAX para realizar la reserva
            $.ajax({
                url: 'ReservaHora.php',
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        console.log('Reserva realizada con éxito');
                        var realizarOtraReserva = confirm('¿Deseas hacer otra reserva?');
                        if (realizarOtraReserva) {
                            $('#reservaForm')[0].reset();
                        } else {
                            // Si no quiere hacer otra reserva, redirigir a la página de inicio de clientes
                            window.location.href = '../InicioClientes.html';
                        }
                        $.ajax({
                            url: 'boleta.php',
                            type: 'POST',
                            data: formData,
                            dataType: 'json',
                            success: function(boletaResponse) {
                                if (boletaResponse.success) {
                                    console.log('Datos insertados en la tabla de boleta con éxito');
                                } else {
                                    console.error('Error al insertar datos en la tabla de boleta:', boletaResponse.message);
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('Error en la solicitud de inserción en la tabla de boleta:', status, error);
                                console.log('Respuesta del servidor:', xhr.responseText);
                            }
                        });
                    } else {
                        console.error('Error al realizar la reserva:', response.message);
                        mostrarError(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error en la solicitud de reserva:', status, error);
                    console.log('Respuesta del servidor:', xhr.responseText);
                }
            });
        } else {
            mostrarError('Por favor, completa todos los campos.');
        }
    });
});

function validarCampos() {
    var fecha = $('#fecha').val();
    var hora = $('#hora').val();
    var servicio = $('#servicio').val();

    // Verificar si algún campo está vacío
    if (fecha === '' || hora === '' || servicio === '') {
        return false;
    }
    return true;
}

});

