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

// Función para cerrar la sesión

function cerrarSesion() {
    fetch('obtener_datos_empleado.php?cerrar_sesion=true', {
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
// Esta parte asegura que se muestre la primera sección al cargar la página
window.onload = function() {
    // Mostrar la primera sección por defecto
    mostrarSeccion('generarOrdenPedido');
};


let idGuardada = null;
let nombreProductoGuardado = null;

function obtenerProveedores() {
    $.ajax({
        url: 'obtener_proveedores.php',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                $('#proveedores').empty().append($('<option>', {
                    value: '',
                    text: 'Seleccione un proveedor'
                }));
                data.proveedores.forEach(function (proveedor) {
                    $('#proveedores').append($('<option>', {
                        value: proveedor.id,
                        text: proveedor.nombre
                    }));
                });
            } else {
                console.error(data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function obtenerProductos(idProveedor) {
    $.ajax({
        url: 'obtener_productos.php',
        type: 'GET',
        data: { idProveedor: idProveedor },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                $('#productos').empty().append($('<option>', {
                    value: '',
                    text: 'Seleccione un producto'
                    
                }));
                data.productos.forEach(function (producto) {
                    $('#productos').append($('<option>', {
                        value: producto.id,
                        text: producto.nombre
                    }));
                });
            } else {
                console.error(data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
function obtenerStock() {
    $.ajax({
        url: 'obtener_stock.php',
        type: 'GET',
        data: { idProveedor: idGuardada, nombreProducto: nombreProductoGuardado },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                console.log('Stock disponible:', data.stock);
                idProducto = data.idProducto; // Almacena la id del producto
                mostrarStock(data.stock);
            } else {
                console.error(data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function mostrarStock(stock) {
    $('#stock-disponible').text(stock);
}

function mostrarIds() {
    const proveedorSeleccionado = $('#proveedores').val();
    idGuardada = proveedorSeleccionado;
    console.log('ID del proveedor seleccionado:', proveedorSeleccionado);
    console.log('ID guardada:', idGuardada);
    obtenerProductos(proveedorSeleccionado);
}

function mostrarNombreProducto() {
    const productoSeleccionado = $('#productos').val();
    nombreProductoGuardado = $('#productos option:selected').text();
    idProductoGuardado = productoSeleccionado; // Guardar la ID del producto seleccionado
    console.log('Nombre del producto seleccionado:', nombreProductoGuardado);
    console.log('ID del producto seleccionado:', idProductoGuardado); // Mostrar la ID en la consola
    obtenerStock();
}

function crearOrdenPedido() {
    const productoSolicitado = idProductoGuardado; // Utilizar la ID del producto guardado
    const cantidadSolicitada = $('#cantidad-deseada').val();
    const fechaPedido = obtenerFechaActual();
    const idProveedor = $('#proveedores').val();
    const cantidadDeseada = parseInt(cantidadSolicitada);

    console.log('Producto solicitado:', productoSolicitado);
    console.log('Cantidad solicitada:', cantidadSolicitada);
    console.log('Fecha pedido:', fechaPedido);
    console.log('ID proveedor:', idProveedor);
    console.log('Cantidad:', cantidadDeseada);

    $.ajax({
        url: 'crear_orden_pedido.php',
        type: 'POST',
        data: {
            productoSolicitado: productoSolicitado,
            cantidadSolicitada: cantidadDeseada,
            fechaPedido: fechaPedido,
            idProveedor: idProveedor
        },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                console.log('Orden de pedido creada correctamente');
                mostrarMensajeExito('Orden de pedido creada correctamente');
                obtenerStock();
            } else {
                console.error(data.message);
                mostrarMensajeError(data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
            mostrarMensajeError('Error al procesar la solicitud');
        }
    });
}


function mostrarMensajeError(mensaje) {
    const mensajeError = $('#mensaje-error');
    mensajeError.text(mensaje);
    mensajeError.show();

    // Ocultar el mensaje después de unos segundos
    setTimeout(function () {
        mensajeError.hide();
    }, 5000); // Mostrar durante 5 segundos
}

function mostrarMensajeExito(mensaje) {
    const mensajeExito = $('#mensaje-exito');
    mensajeExito.text(mensaje);
    mensajeExito.show();

    // Ocultar el mensaje después de unos segundos
    setTimeout(function () {
        mensajeExito.hide();
    }, 5000); // Mostrar durante 5 segundos
}

// Ejemplo de función para obtener la fecha actual (puedes usar una librería como moment.js para esto)
function obtenerFechaActual() {
    const fecha = new Date();
    // Formatear la fecha según tu requerimiento
    const fechaFormateada = fecha.toISOString().slice(0, 10);
    return fechaFormateada;
}

// Evento al hacer clic en el botón de solicitar
$('#boton-solicitar').on('click', function () {
    crearOrdenPedido();
});

//BOLETTASSSSSSSSSSS

$(document).ready(function () {
    $('#nombreClienteBoletas').on('keyup', function () {
        buscarBoletas();
    });

    $('#verBoletas').hide(); // Ocultar la tabla al inicio

    function buscarBoletas() {
        const nombreCliente = $('#nombreClienteBoletas').val();

        $.ajax({
            url: 'buscar_boletas.php',
            type: 'GET',
            data: { nombreCliente: nombreCliente },
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    mostrarBoletas(data);
                } else {
                    $('#cuerpoTablaBoletas').empty().append('<tr><td colspan="7">No se encontraron boletas para este cliente.</td></tr>');
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    function mostrarBoletas(boletas) {
        const cuerpoTabla = $('#cuerpoTablaBoletas');
        cuerpoTabla.empty();

        boletas.forEach(function (boleta) {
            cuerpoTabla.append(`
                <tr>
                    <td>${boleta['ID Boleta']}</td>
                    <td>${boleta['Nombre Cliente']}</td>
                    <td>${boleta['Rut']}</td>
                    <td>${boleta['Fecha Emisión']}</td>
                    <td>${boleta['Descripción Servicio']}</td>
                    <td>${boleta['Monto']}</td>
                    <td><button onclick="cancelarBoleta(${boleta['ID Boleta']})">Cancelar</button></td>
                </tr>
            `);
        });

        $('#verBoletas').show();
    }

    function cancelarBoleta(idBoleta) {
        // Lógica para cancelar la boleta con el ID proporcionado
        // Puedes realizar una nueva petición AJAX al servidor para realizar la cancelación
        // Actualizar la tabla o mostrar un mensaje de confirmación
    }

    // Esta función carga los datos de los clientes al cargar la página
    
    function cargarClientes() {
        fetch('mostrar_clientes.php')
            .then(response => response.json())
            .then(data => {
                mostrarClientes(data);
                document.getElementById('inputBuscarCliente').addEventListener('input', function() {
                    filtrarClientes(data);
                });
            });
    }
    
    function mostrarClientes(clientes) {
        const cuerpoTabla = document.getElementById('cuerpoTablaClientes');
        cuerpoTabla.innerHTML = '';
    
        clientes.forEach(cliente => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cliente.NOMBRE}</td>
                <td>${cliente.RUT}</td>
                <td>${cliente.CORREO}</td>
                <td>${cliente.TELEFONO}</td>
                <td>${cliente.DIRECCION}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }
    
    function filtrarClientes(clientes) {
        const inputBuscar = document.getElementById('inputBuscarCliente').value.toLowerCase();
        const cuerpoTabla = document.getElementById('cuerpoTablaClientes');
        cuerpoTabla.innerHTML = '';
    
        clientes.forEach(cliente => {
            const nombreCompleto = cliente.NOMBRE.toLowerCase();
    
            if (nombreCompleto.includes(inputBuscar)) {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${cliente.NOMBRE}</td>
                    <td>${cliente.RUT}</td>
                    <td>${cliente.CORREO}</td>
                    <td>${cliente.TELEFONO}</td>
                    <td>${cliente.DIRECCION}</td>
                `;
                cuerpoTabla.appendChild(fila);
            }
        });
    }
    
    // Cargar todos los clientes al cargar la página
    window.onload = cargarClientes;



    

$(document).ready(function () {
    $('#filtroNombre').on('keyup', function () {
        buscarReservas();
    });

    // Función para buscar reservas
    function buscarReservas() {
        const nombreCliente = $('#filtroNombre').val();

        $.ajax({
            url: 'buscar_reservas.php',
            type: 'GET',
            data: { nombreCliente: nombreCliente },
            dataType: 'json',
            success: function (data) {
                mostrarReservas(data);
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    // Función para mostrar las reservas en la tabla
    function mostrarReservas(reservas) {
        const cuerpoTabla = $('#cuerpoTablaReservas');
        cuerpoTabla.empty();

        reservas.forEach(function (reserva) {
            cuerpoTabla.append(`
                <tr>
                    <td>${reserva['Nombre Cliente']}</td>
                    <td>${reserva['Servicio Solicitado']}</td>
                    <td>${reserva['Hora']}</td>
                </tr>
            `);
        });
    }

    // Cargar todas las reservas al cargar el documento
    buscarReservas();
});

$(document).ready(function () {
    function cargarDatosEmpleado() {
        $.ajax({
            url: 'obtener_datos_empleado.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                mostrarDatosEmpleado(data);
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    }

    function mostrarDatosEmpleado(empleado) {
        $('#nombre').text(empleado.Nombre);
        $('#apellidoPaterno').text(empleado['Apellido Paterno']);
        $('#apellidoMaterno').text(empleado['Apellido Materno']);
        $('#cargo').text(empleado.Cargo);
        $('#rut').text(empleado.RUT);
        $('#correo').text(empleado.Correo);
    }

    cargarDatosEmpleado();
});






$(document).ready(function () {
    obtenerProveedores();
    
    $('#proveedores').change(function () {
        mostrarIds();
    });

    $('#productos').change(function () {
        mostrarNombreProducto();
    });
});


})