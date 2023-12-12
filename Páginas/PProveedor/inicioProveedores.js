

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


function cerrarSesion() {
    fetch('datosproveedor.php?cerrar_sesion=true', {
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
        actualizarBtn.className = 'btn-actualizar'; 

        actualizarBtn.onclick = function() {
            var nuevoStock = prompt('Ingrese el nuevo stock:');
            if (nuevoStock !== null) {
                actualizarStock(producto.id_producto, nuevoStock); 
            }
        };

        var eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar Producto';
        eliminarBtn.className = 'btn-eliminarr'; 
        eliminarBtn.onclick = function() {

            var confirmarEliminar = confirm('¿Estás seguro que deseas eliminar este producto?');
            if (confirmarEliminar) {
                eliminarProducto(producto.id_producto); 
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
    console.log('ID del producto:', idProducto); 
    $.ajax({
        type: 'POST',
        url: 'actualizar_stock.php',
        data: {
            id_producto: idProducto,
            nuevo_stock: nuevoStock
        },
        success: function(response) {
            console.log('Producto actualizado:', response);
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
        url: 'eliminar_producto.php', 
        data: {
            id_producto: idProducto
        },
        success: function(response) {
            console.log('Producto eliminado:', response);
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
        url: 'datosproveedor.php', 
        method: 'GET',
        success: function(response) {
            var datosUsuario = JSON.parse(response);
            var datosUsuarioDiv = document.getElementById('datosUsuarioDiv');

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

    $.ajax({
        url: 'datosproveedor.php',
        method: 'GET',
        success: function(response) {
            const datosProveedor = JSON.parse(response);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.text('Informe de Productos', 105, 20, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.text(`Nombre de la Empresa: ${datosProveedor['Nombre Empresa']}`, 20, 40);
            doc.text(`RUT: ${datosProveedor['RUT']}`, 20, 50);
            doc.text(`Contacto: ${datosProveedor['Contacto']}`, 20, 60);
            doc.text(`Correo: ${datosProveedor['Correo']}`, 20, 70);

            const tabla = document.getElementById('tablaProductos');
            const tablaConfig = { startY: 90 };

            const columnasOcultas = tabla.querySelectorAll('.hiddenInPDF');
            columnasOcultas.forEach(columna => {
                columna.style.display = 'none';
            });

            const columnasParaPDF = [...tabla.querySelectorAll('thead th')].slice(0, 4);
            const filasParaPDF = [...tabla.querySelectorAll('tbody tr')].map(tr =>
                [...tr.querySelectorAll('td')].slice(0, 4)
            );

            doc.autoTable({
                head: [columnasParaPDF.map(col => col.textContent.trim())],
                body: filasParaPDF.map(row => row.map(cell => cell.textContent.trim())),
                ...tablaConfig
            });

            columnasOcultas.forEach(columna => {
                columna.style.display = ''; // Restaurar el estilo original
            });

            const fechaEmision = new Date().toLocaleDateString();
            doc.setFontSize(10);
            doc.text(`Fecha de Emisión: ${fechaEmision}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });

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
                const cabecera = tablaEntregas.createTHead();
                const filaCabecera = cabecera.insertRow();
                const titulos = ['Entrega realizadas'];

                titulos.forEach(titulo => {
                    const th = document.createElement('th');
                    th.textContent = titulo;
                    filaCabecera.appendChild(th);
                });

                const cuerpoTabla = tablaEntregas.createTBody();
                entregas.forEach(entrega => {
                    const fila = cuerpoTabla.insertRow();
                    const celda = fila.insertCell();
                    celda.textContent = entrega;
                });

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
                    const productoSolicitado = this.options[this.selectedIndex].textContent.split(' - ')[2];
                    const cantidad = parseInt(this.options[this.selectedIndex].textContent.split(' - ')[3].split(': ')[1]);
                    
                
                    console.log('ID de la orden seleccionada:', idOrdenSeleccionada);
                    console.log('Producto solicitado:', productoSolicitado);
                    console.log('Cantidad:', cantidad);
            
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




function obtenerProductoSolicitado() {
    const selectedOptionText = document.getElementById("jcomboOrdenes").options[document.getElementById("jcomboOrdenes").selectedIndex].textContent;
    const splitText = selectedOptionText.split(' - ');
    return splitText[2];
}

function obtenerCantidad() {
    const selectedOptionText = document.getElementById("jcomboOrdenes").options[document.getElementById("jcomboOrdenes").selectedIndex].textContent;
    const splitText = selectedOptionText.split(' - ');
    const cantidadText = splitText[3].split(': ')[1];
    return parseInt(cantidadText);
}





function confirmarEntrega() {
    const fechaRecepcion = obtenerFechaSistema();
    const idOrden = document.getElementById("jcomboOrdenes").value;
    const idEmpleado = document.getElementById("empleado").value;
    const productoSolicitado = obtenerProductoSolicitado();
    const cantidad = obtenerCantidad();

    // Imprimir los datos que se enviarán en la solicitud AJAX
    console.log("Fecha de recepción:", fechaRecepcion);
    console.log("ID de la orden:", idOrden);
    console.log("ID del empleado:", idEmpleado);
    console.log("Producto solicitado:", productoSolicitado);
    console.log("Cantidad:", cantidad);

    $.ajax({
        url: 'entrega.php',
        method: 'POST',
        data: {
            fecha_recep: fechaRecepcion,
            Orden_pedido_id_orden: idOrden,
            Orden_pedido_Empleado_id_empleado: idEmpleado,
            producto_recibido: productoSolicitado,
            cantidad: cantidad
        },
        success: function(response) {
            console.log(response);
            location.reload();
        },
        error: function() {
            console.log('Error al enviar la solicitud AJAX');
        }
    });
}



function obtenerFechaSistema() {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); 
    const anio = fechaActual.getFullYear();
    return `${anio}-${mes}-${dia}`;
}

document.addEventListener("DOMContentLoaded", function() {
    cargarOrdenesProveedor();
    cargarEmpleados();
    document.getElementById("fechaRecepcion").value = obtenerFechaSistema();
});


cargarEmpleados();

window.onload = function() {
    cargarEmpleadosProveedor();
};