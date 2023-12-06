function cerrarSesion() {
    fetch('inicioClientes.php?cerrar_sesion=true', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.replace('/ServiExpress/Páginas/index.html');
        } else {
            console.error(data.message);
        }
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    });
}


$(document).ready(function() {
    mostrarDatosUsuario();
    obtenerServicios();
});

function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('.main > div');
    secciones.forEach(elemento => {
        elemento.style.display = 'none';
    });

    const seccionMostrar = document.getElementById(seccion);
    seccionMostrar.style.display = 'block';
}







function obtenerServicios() {
    fetch('servicios.php?obtener_servicios=true')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const contenidoTabla = document.getElementById('contenidoTabla');
            contenidoTabla.innerHTML = '';

            if (data.length > 0) {
                data.forEach(servicio => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${servicio.id_servicio}</td>
                        <td>${servicio.Desc_serv}</td>
                        <td>${servicio.Precio_serv}</td>
                        <td>${servicio.Tiempo_estimado}</td>
                    `;
                    contenidoTabla.appendChild(fila);
                });
            } else {
                console.log('No hay datos disponibles.');
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}

window.onload = function () {
    obtenerServicios();
};



$(document).ready(function() {
    mostrarDatosUsuario();
    obtenerReservas();

    var idUsuario = idUsuario; // Reemplaza con el ID del usuario logueado

    $.ajax({
        url: 'verReservas.php',
        type: 'POST',
        dataType: 'json',
        data: { idUsuario: idUsuario },
        success: function(reservas) {
            if (reservas.length > 0) {
                reservas.forEach(function(reserva) {
                    var fila = '<tr>' +
                        '<td>' + reserva.nombreServicio + '</td>' +
                        '<td>' + reserva.fecha + '</td>' +
                        '<td>' + reserva.hora + '</td>' +
                        '<td><button class="cancelar-reserva btn btn-danger" data-idreserva="' + reserva.id_reserva + '">Cancelar Reserva</button></td>' +
                        '</tr>';
                    $('#tablaReservas').append(fila);
                });
                $('#verReservas').show();
            } else {
                $('#verReservas').html('<p>No hay reservas a tu nombre.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener las reservas:', status, error);
        }
    });

    $('#tablaReservas').on('click', '.cancelar-reserva', function() {
        var idReserva = $(this).data('idreserva');
        if (confirm('¿Estás seguro de cancelar la reserva?')) {
            console.log('Cancelar reserva con ID:', idReserva);
            $.ajax({
                url: 'verReservas.php',
                type: 'POST',
                dataType: 'json',
                data: { eliminarReserva: true, idReserva: idReserva },
                success: function(response) {
                    if (response.success) {
                        location.reload();
                        console.log(response.message);
                        obtenerReservas();
                    } else {
                        console.error(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error al cancelar la reserva:', status, error);
                }
            });
        }
    });
});


function obtenerReservas() {
    fetch('servicios.php?obtener_servicios=true')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const contenidoTabla = document.getElementById('contenidoTabla');
            contenidoTabla.innerHTML = '';

            if (data.length > 0) {
                data.forEach(servicio => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${servicio.id_servicio}</td>
                        <td>${servicio.Desc_serv}</td>
                        <td>${servicio.Precio_serv}</td>
                        <td>${servicio.Tiempo_estimado}</td>
                    `;
                    contenidoTabla.appendChild(fila);
                });
            } else {
                console.log('No hay datos disponibles.');
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}


function obtenerBoletas() {
    fetch('verBoletas.php') // Reemplaza 'ruta_para_obtener_boletas.php' con la URL correcta
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const tablaBoletas = document.getElementById('tablaBoletas');
            tablaBoletas.innerHTML = '';

            if (data.length > 0) {
                data.forEach(boleta => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${boleta.nombre}</td>
                        <td>${boleta.fecha}</td>
                        <td>${boleta.Monto_Pagado}</td>
                        <td>${boleta.Servicio_Pagado}</td>
                    `;
                    tablaBoletas.appendChild(fila);
                });
            } else {
                console.log('No hay datos de boletas disponibles a tu nombre.');
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}


$(document).ready(function() {
    // Al cargar la página, se cargan los datos del usuario
    mostrarDatosUsuario();
    
    // Escucha el evento de envío del formulario
    $('#formDatosUsuario').submit(function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional
        actualizarDatosUsuario();
    });
});
function actualizarDatosUsuario() {
    var nombre = document.getElementById('nombre').value.trim();
    var apellidoPaterno = document.getElementById('apellidoPaterno').value.trim();
    var apellidoMaterno = document.getElementById('apellidoMaterno').value.trim();
    var direccion = document.getElementById('direccion').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var correo = document.getElementById('correo').value.trim();
    var rut = document.getElementById('rut').value.trim();

    // Verificar que los campos no estén vacíos y tengan al menos 4 caracteres
    if (
        nombre.length >= 4 &&
        apellidoPaterno.length >= 4 &&
        apellidoMaterno.length >= 4 &&
        direccion.length >= 4 &&
        telefono.length >= 9 &&
        correo.length >= 4 &&
        rut.length >= 12
    ) {
        var formData = new FormData(document.getElementById('formDatosUsuario'));

        fetch('actualizarDatos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos actualizados:', data);
            alert('Cambios realizados');
            location.reload();
        })
        .catch(error => {
            console.error('Error al actualizar los datos del usuario:', error);
        });
    } else {
        alert('Todos los campos deben tener al menos 4 caracteres de ancho (Rut 12, Telefono 9)');
    }
}

function mostrarDatosUsuario() {
    fetch('VerDatos.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.hasOwnProperty('nombre_cli')) {
            document.getElementById('nombre').value = data.nombre_cli || '';
            document.getElementById('apellidoPaterno').value = data.appaterno_cli || '';
            document.getElementById('apellidoMaterno').value = data.apmaterno_cli || '';
            document.getElementById('direccion').value = data.direccion_cli || '';
            document.getElementById('telefono').value = data.fono_cli || '';
            document.getElementById('correo').value = data.correo_cl || '';
            document.getElementById('rut').value = data.rut || '';

            if (data.foto_perfil) {
                const imagenPerfil = document.getElementById('imagenPerfil');
                imagenPerfil.src = `data:image/jpeg;base64,${data.foto_perfil}`;
                imagenPerfil.style.display = 'block';
            }
        } else {
            console.error('No se encontraron datos del usuario');
        }
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    });
}

mostrarDatosUsuario();
