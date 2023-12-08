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
    // Tu lógica para cerrar sesión aquí
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






$(document).ready(function () {
    obtenerProveedores();
    
    $('#proveedores').change(function () {
        mostrarIds();
    });

    $('#productos').change(function () {
        mostrarNombreProducto();
    });
});


