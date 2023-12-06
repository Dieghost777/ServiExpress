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
    $('#formularioProducto').submit(function(event) {
        event.preventDefault();

        var nombreProducto = $('#nombreProducto').val();
        var precio = $('#precio').val();
        var stock = $('#stock').val();

        if (nombreProducto === '' || precio === '' || stock === '') {
            $('#mensajeError').text('Todos los campos son requeridos');
            return;
        }

        if (parseInt(stock) < 0) {
            $('#mensajeError').text('El stock no puede ser menor a 0');
            return;
        }

        var datosProducto = {
            nombre_producto: nombreProducto,
            precio: precio,
            stock: stock
        };

        console.log('Datos enviados:', datosProducto);

        $.ajax({
            type: 'POST',
            url: 'registroproducto.php',
            data: datosProducto,
            success: function(response) {
                console.log('Respuesta del servidor:', response);
                alert('Producto registrado exitosamente');
            },
            error: function(xhr, status, error) {
                console.error('Error al registrar producto:', error);
                if (xhr.status === 400) {
                    $('#mensajeError').text(JSON.parse(xhr.responseText).message);
                } else {
                    alert('Error al registrar producto. Revisa la consola para más detalles');
                }
            }
        });
    });
});





// Definir las funciones en un ámbito global
function obtenerProductosProveedor() {
    $.ajax({
        url: 'obtener_productos_proveedor.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('Datos obtenidos:', response);
            if (response.success) {
                mostrarProductos(response.productos);
            } else {
                $('#productos-container').text('No se encontraron productos');
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            $('#productos-container').text('Error al obtener productos');
        }
    });
}


function mostrarProductos(productos) {
    var contenidoProductos = document.getElementById('contenidoProductos');
    contenidoProductos.innerHTML = '';

    productos.forEach(function(producto) {
        var fila = document.createElement('tr');

        var nombreProducto = document.createElement('td');
        nombreProducto.textContent = producto.nombre_producto;

        var precio = document.createElement('td');
        precio.textContent = producto.precio;

        var stock = document.createElement('td');
        stock.textContent = producto.stock;

        var stockDisponible = document.createElement('td');
        stockDisponible.textContent = producto.StockDisponible;


        var porcentajeStock = (parseInt(producto.StockDisponible) / parseInt(producto.stock)) * 100;
        var color = 'black';
        var mensaje = '';

        if (porcentajeStock <= 20) {
            color = 'red';
            mensaje = 'Stock Crítico';
        } else if (porcentajeStock <= 60) {
            color = 'orange';
            mensaje = 'Stock Moderado';
        } else {
            color = 'green';
            mensaje = 'Stock OK';
        }

        stockDisponible.style.color = color;
        stockDisponible.innerHTML += ` <span style="font-size: 80%; margin-left: 5px; color: ${color};">${mensaje}</span>`;

        var acciones = document.createElement('td');

        var actualizarBtn = document.createElement('button');
        actualizarBtn.textContent = 'Actualizar Stock';
        actualizarBtn.className = 'btn-actualizar'; // Aplica la clase al botón

        actualizarBtn.onclick = function() {
            var nuevoStock = prompt('Ingrese el nuevo stock:');
            if (nuevoStock !== null) {
                actualizarStock(producto.id_producto, nuevoStock); // Corregir el nombre del campo de ID según tu estructura
            }
        };

        var eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar Producto';
        eliminarBtn.className = 'btn-eliminarr'; // Aplica la clase al botón

        eliminarBtn.onclick = function() {

            var confirmarEliminar = confirm('¿Estás seguro que deseas eliminar este producto?');
            if (confirmarEliminar) {
                eliminarProducto(producto.id_producto); // Corregir el nombre del campo de ID según tu estructura
            }
        };

        acciones.appendChild(actualizarBtn);
        acciones.appendChild(eliminarBtn);

        fila.appendChild(nombreProducto);
        fila.appendChild(precio);
        fila.appendChild(stock);
        fila.appendChild(stockDisponible);
        fila.appendChild(acciones);

        contenidoProductos.appendChild(fila);
    });
}




function actualizarStock(idProducto, nuevoStock) {
    console.log('ID del producto:', idProducto); // Imprimir la ID del producto
    $.ajax({
        type: 'POST',
        url: 'actualizar_stock.php', // Reemplaza con la ruta correcta
        data: {
            id_producto: idProducto,
            nuevo_stock: nuevoStock
        },
        success: function(response) {
            console.log('Producto actualizado:', response);
            // Vuelve a cargar los productos después de la actualización
            obtenerProductosProveedor();
        },
        error: function(xhr, status, error) {
            console.error('Error al actualizar producto:', error);
            alert('Error al actualizar producto. Revisa la consola para más detalles');
        }
    });
}






function eliminarProducto(idProducto) {
    $.ajax({
        type: 'POST',
        url: 'eliminar_producto.php', // Reemplaza con la ruta correcta
        data: {
            id_producto: idProducto
        },
        success: function(response) {
            console.log('Producto eliminado:', response);
            // Vuelve a cargar los productos después de la eliminación
            obtenerProductosProveedor();
        },
        error: function(xhr, status, error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar producto. Revisa la consola para más detalles');
        }
    });
}






function cargarDatosUsuario() {
    $.ajax({
        url: 'datosproveedor.php', // Reemplaza 'ruta_al_script_php.php' con la ubicación de tu script PHP
        method: 'GET',
        success: function(response) {
            var datosUsuario = JSON.parse(response);
            var datosUsuarioDiv = document.getElementById('datosUsuarioDiv');

            // Creamos una lista con los datos del usuario y la agregamos al div
            var listaDatos = '<ul>';
            for (var clave in datosUsuario) {
                listaDatos += '<li><strong>' + clave + ':</strong> ' + datosUsuario[clave] + '</li>';
            }
            listaDatos += '</ul>';

            datosUsuarioDiv.innerHTML = listaDatos;
        },
        error: function() {
            console.log('Error al obtener los datos del usuario.');
        }
    });
}





function generarInformePDF() {
    const doc = new jsPDF();

    // Obtener datos de la empresa logeada a través de AJAX
    $.ajax({
        url: 'datosproveedor.php', // Ruta hacia el script PHP que obtiene los datos del proveedor
        method: 'GET',
        success: function(response) {
            const datosProveedor = JSON.parse(response);

            // Agregar los datos al documento PDF
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.text('Informe de Productos', 105, 20, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.text(`Nombre de la Empresa: ${datosProveedor['Nombre Empresa']}`, 20, 40);
            doc.text(`RUT: ${datosProveedor['RUT']}`, 20, 50);
            doc.text(`Contacto: ${datosProveedor['Contacto']}`, 20, 60);
            doc.text(`Correo: ${datosProveedor['Correo']}`, 20, 70);

            // Obtener la tabla de productos y su contenido
            const tabla = document.getElementById('tablaProductos');
            const tablaConfig = { startY: 90 };

            // Ocultar las columnas que tienen la clase 'hiddenInPDF' antes de generar el PDF
            const columnasOcultas = tabla.querySelectorAll('.hiddenInPDF');
            columnasOcultas.forEach(columna => {
                columna.style.display = 'none';
            });

            // Obtener solo las primeras cuatro columnas para generar el PDF
            const columnasParaPDF = [...tabla.querySelectorAll('thead th')].slice(0, 4);
            const filasParaPDF = [...tabla.querySelectorAll('tbody tr')].map(tr =>
                [...tr.querySelectorAll('td')].slice(0, 4)
            );

            // Generar el PDF con las primeras cuatro columnas de la tabla
            doc.autoTable({
                head: [columnasParaPDF.map(col => col.textContent.trim())],
                body: filasParaPDF.map(row => row.map(cell => cell.textContent.trim())),
                ...tablaConfig
            });

            // Mostrar nuevamente las columnas ocultas después de generar el PDF
            columnasOcultas.forEach(columna => {
                columna.style.display = ''; // Restaurar el estilo original
            });

            // Agregar la fecha de emisión al pie del documento
            const fechaEmision = new Date().toLocaleDateString();
            doc.setFontSize(10);
            doc.text(`Fecha de Emisión: ${fechaEmision}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });

            // Guardar el archivo PDF con un nombre específico
            doc.save('informe_productos.pdf');
        },
        error: function() {
            console.log('Error al obtener los datos del proveedor.');
        }
    });
}


let contadorMensajes = 0;

function mostrarMensaje(mensaje) {
    if (contadorMensajes < 2) {
        const mensajeElement = document.createElement('p');
        mensajeElement.textContent = mensaje;
        mensajeElement.style.color = 'red';

        const contenedor = document.getElementById('tablaEntregasRealizadas');
        contenedor.appendChild(mensajeElement);

        contadorMensajes++;
    }
}







function mostrarEntregasRealizadas(fechaInicio, fechaFin) {
    let url = 'entregas_realizadas.php';

    if (fechaInicio && fechaFin) {
        url += `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    }

    $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            const entregas = JSON.parse(response);
            const tablaEntregas = document.createElement('table');
            tablaEntregas.className = 'table';

            if (entregas.length > 0) {
                // Crea la cabecera de la tabla
                const cabecera = tablaEntregas.createTHead();
                const filaCabecera = cabecera.insertRow();
                const titulos = ['Entrega realizadas'];

                titulos.forEach(titulo => {
                    const th = document.createElement('th');
                    th.textContent = titulo;
                    filaCabecera.appendChild(th);
                });

                // Crea el cuerpo de la tabla con los datos de las entregas
                const cuerpoTabla = tablaEntregas.createTBody();
                entregas.forEach(entrega => {
                    const fila = cuerpoTabla.insertRow();
                    const celda = fila.insertCell();
                    celda.textContent = entrega;
                });

                // Limpiar el contenido actual antes de agregar las nuevas entregas
                const contenedorTabla = document.getElementById('tablaEntregasRealizadas');
                while (contenedorTabla.firstChild) {
                    contenedorTabla.removeChild(contenedorTabla.firstChild);
                }
            } else {
                const mensaje = document.createElement('p');
                mensaje.textContent = 'No hay entregas realizadas dentro de esas fechas.';
                document.getElementById('tablaEntregasRealizadas').appendChild(mensaje);
                return;
            }

            // Agrega la tabla al div 'tablaEntregasRealizadas'
            document.getElementById('tablaEntregasRealizadas').appendChild(tablaEntregas);
        },
        error: function() {
            console.log('Error al obtener las entregas realizadas.');
        }
    });
}

function cargarOrdenesProveedor() {
    const jCombo = document.getElementById("jcomboOrdenes");
    const contenidoOrdenes = document.getElementById('contenidoOrdenesPedido');

    $.ajax({
        url: 'ordenes_proveedor.php',
        method: 'GET',
        success: function(response) {
            const ordenes = JSON.parse(response);
            if (ordenes.length > 0) {
                ordenes.forEach(orden => {
                    const option = document.createElement("option");
                    option.value = orden.ID;
                    option.textContent = `${orden.NombreEmpleado} - ${orden.FechaSolicitud} - ${orden.ProductoSolicitado} - Cantidad: ${orden['Cantidad solicitada']}`;
                    option.setAttribute('data-id-orden', orden.ID);
                    jCombo.appendChild(option);

                    const fila = document.createElement('tr');
                    const nombreEmpleado = document.createElement('td');
                    nombreEmpleado.textContent = orden.NombreEmpleado;

                    const fechaPedido = document.createElement('td');
                    fechaPedido.textContent = orden.FechaSolicitud;

                    const productoSolicitado = document.createElement('td');
                    productoSolicitado.textContent = orden.ProductoSolicitado;

                    const estadoOrden = document.createElement('td');
                    estadoOrden.textContent = orden.Estado;

                    fila.appendChild(nombreEmpleado);
                    fila.appendChild(fechaPedido);
                    fila.appendChild(productoSolicitado);
                    fila.appendChild(estadoOrden);

                    contenidoOrdenes.appendChild(fila);
                });

                jCombo.addEventListener('change', function() {
                    const idOrdenSeleccionada = this.options[this.selectedIndex].getAttribute('data-id-orden');
                    console.log('ID de la orden seleccionada:', idOrdenSeleccionada);
                });
            } else {
                const option = document.createElement("option");
                option.value = '';
                option.textContent = 'No hay órdenes pendientes';
                jCombo.appendChild(option);
            }
        },
        error: function() {
            console.log('Error al cargar las órdenes del proveedor');
        }
    });
}

function cargarEmpleados() {
    const jComboEmpleados = document.getElementById("empleado");

    $.ajax({
        url: 'datos_empleados.php',
        method: 'GET',
        success: function(response) {
            try {
                const empleados = JSON.parse(response);
                if (empleados.length > 0) {
                    empleados.forEach(empleado => {
                        const option = document.createElement("option");
                        option.value = empleado.id_empleado;
                        option.textContent = empleado.nombre;
                        jComboEmpleados.appendChild(option);
                    });

                    jComboEmpleados.addEventListener('change', function() {
                        const idEmpleadoSeleccionado = this.value;
                        console.log('ID del empleado seleccionado:', idEmpleadoSeleccionado);
                    });
                } else {
                    const option = document.createElement("option");
                    option.value = '';
                    option.textContent = 'No hay empleados disponibles';
                    jComboEmpleados.appendChild(option);
                }
            } catch (error) {
                console.error('Error al procesar la respuesta JSON:', error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });
}


function confirmarEntrega() {
    const fechaRecepcion = obtenerFechaSistema();
    const idOrden = document.getElementById("jcomboOrdenes").value;
    const idEmpleado = document.getElementById("empleado").value;

    // Imprimir los datos que se enviarán en la solicitud AJAX
    console.log("Fecha de recepción:", fechaRecepcion);
    console.log("ID de la orden:", idOrden);
    console.log("ID del empleado:", idEmpleado);

    $.ajax({
        url: 'entrega.php',
        method: 'POST',
        data: {
            fecha_recep: fechaRecepcion,
            Orden_pedido_id_orden: idOrden,
            Orden_pedido_Empleado_id_empleado: idEmpleado
        },
        success: function(response) {
            console.log(response); // Manejar la respuesta del servidor aquí
            location.reload(); // O actualiza solo la sección relevante con nuevos datos

        },
        error: function() {
            console.log('Error al enviar la solicitud AJAX');
        }
    });
}


function obtenerFechaSistema() {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Sumar 1 porque enero es 0
    const anio = fechaActual.getFullYear();
    return `${anio}-${mes}-${dia}`;
}

document.addEventListener("DOMContentLoaded", function() {
    // Llenar los combos y establecer la fecha al cargar el DOM
    cargarOrdenesProveedor();
    cargarEmpleados();
    document.getElementById("fechaRecepcion").value = obtenerFechaSistema();
});


// Llamar a la función para cargar empleados cuando se cargue la página
cargarEmpleados();





window.onload = function() {

    cargarEmpleadosProveedor();
};