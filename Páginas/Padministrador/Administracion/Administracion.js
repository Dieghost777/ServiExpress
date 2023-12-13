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
mostrarSeccion('modificarBoleta');


function cerrarSesion() {
    fetch('cerrarsesion.php?cerrar_sesion=true', {
        method: 'GET'
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

    $('#tablaBoletas').on('click', '.editar-btn', function(event) {
        const fila = $(this).closest('tr');
        const idBoleta = fila.find('.id-boleta').text();
        const nombreCliente = fila.find('.nombre-cliente').text();
        const fechaEmision = fila.find('.fecha-emision').text();
        const monto = fila.find('.monto').text();
        $('#idBoleta').val(idBoleta);
        $('#nombreCliente').val(nombreCliente);
        $('#fechaEmision').val(fechaEmision);
        $('#monto').val(monto);

        $('#tablaBoletas').hide();
        $('#formularioEdicion').show();

        $('.card').show();
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
                window.alert("Actualizacion de Boleta exitosa");
                console.log(response); 
                location.reload();

            },
            error: function(xhr, status, error) {
                console.error('Error al actualizar los datos: ' + error);
            }
        });
    });

    $('#volverBtn').click(function() {
        $('#formularioEdicion').hide();
        $('#tablaBoletas').show();
        $('.card').hide();
    });
});





document.addEventListener("DOMContentLoaded", function() {
    const editarBotones = document.querySelectorAll(".editar-btn-servicio");
    const eliminarBotones = document.querySelectorAll(".eliminar-servicio-btn");
    const formularioEdicion = document.getElementById("formularioEdicionServicio");
    const idServicioEdit = document.getElementById("idServicioEdit");
    const descripcionEdit = document.getElementById("descripcionEdit");
    const precioEdit = document.getElementById("precioEdit");
    const tiempoEstimadoEdit = document.getElementById("tiempoEstimadoEdit");
    const guardarCambiosBtn = document.getElementById("guardarCambiosEdit");
    const volverBtnEdit = document.getElementById("volverBtnEdit");
    const tablaServicios = document.getElementById("tablaServicios");

    // Función para obtener y mostrar los servicios
    function mostrarServicios() {
        fetch("verservicios.php") 
        .then(response => response.text())
        .then(data => {
            tablaServicios.innerHTML = data;
            asignarEventosEditar();
            asignarEventosEliminar();
         })
        .catch(error => {
            console.error("Error al obtener servicios:", error);
        });
    }

    function eliminarServicio(idServicio) {
        const formData = new FormData();
        formData.append('idServicio', idServicio);
        formData.append('eliminarServicio', true); // Parámetro para identificar la acción de eliminar

        fetch("actualizarservicio.php", {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Muestra la respuesta del servidor en la consola (para verificar)
            window.alert("Servicio eliminado correctamente");
            mostrarServicios(); // Vuelve a cargar la lista de servicios después de eliminar
        })
        .catch(error => {
            console.error("Error al eliminar servicio:", error);
        });
    }

    function asignarEventosEliminar() {
        eliminarBotones.forEach(function(btn) {
            btn.addEventListener("click", function(e) {
                const idServicio = e.target.getAttribute("data-id");
                console.log("Botón de eliminación clickeado para el servicio con ID:", idServicio);
                eliminarServicio(idServicio);
            });
        });
    }

    $('#tablaServicios').on('click', '.editar-btn-servicio', function(event) {
        const fila = $(this).closest('tr');
        const idServicio = fila.find('.id-servicio').text();
        const descripcion = fila.find('.descripcion-servicio').text();
        const precio = fila.find('.precio-servicio').text();
        const tiempoEstimado = fila.find('.tiempo-estimado').text();

        // Llenar el formulario de edición con los datos de la fila
        $('#idServicioEdit').val(idServicio);
        $('#descripcionEdit').val(descripcion);
        $('#precioEdit').val(precio);
        $('#tiempoEstimadoEdit').val(tiempoEstimado);

        // Mostrar el formulario de edición y ocultar la tabla
        $('#tablaServicios').hide();
        $('#formularioEdicionServicio').show();
    });

    function asignarEventosEditar() {
        editarBotones.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
        const idServicio = e.target.getAttribute("data-id");
        console.log("Botón de edición clickeado para el servicio con ID:", idServicio);

        idServicioEdit.value = idServicio;
        formularioEdicion.style.display = "block";
            });
        });
    }



    function asignarEventosEliminar() {
        const eliminarBotones = document.querySelectorAll(".eliminar-servicio-btn");
    
        eliminarBotones.forEach(function(btn) {
            btn.addEventListener("click", function(e) {
                const idServicio = e.target.getAttribute("data-id");
                console.log("Botón de eliminación clickeado para el servicio con ID:", idServicio);
                eliminarServicio(idServicio);
            });
        });
    }
    asignarEventosEliminar();


    // Función para guardar los cambios en un servicio
    function guardarCambiosServicio() {
        // Aquí puedes agregar la lógica para guardar los cambios en el servicio
        // Por ejemplo:
        const formData = new FormData();
        formData.append('idServicio', idServicioEdit.value);
        formData.append('descripcion', descripcionEdit.value);
        formData.append('precio', precioEdit.value);
        formData.append('tiempoEstimado', tiempoEstimadoEdit.value);

        fetch("actualizarservicio.php", {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Muestra la respuesta del servidor en la consola (para verificar)
            window.alert("Datos Actualizados Correctamente");
            location.reload();
            formularioEdicion.style.display = "none";
            // Aquí podrías agregar la lógica para mostrar nuevamente la tabla de servicios o actualizarla
            mostrarServicios();
        })
        .catch(error => {
            console.error("Error al actualizar servicio:", error);
        });
    }

    mostrarServicios();

    eliminarBotones.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const idServicio = e.target.getAttribute("data-id");
            console.log("Botón de eliminación clickeado para el servicio con ID:", idServicio);
            eliminarServicio(idServicio);
        });
    });

    guardarCambiosBtn.addEventListener("click", function() {
        guardarCambiosServicio();
    });

    volverBtnEdit.addEventListener("click", function() {
          $('#tablaServicios').show();
        $('#formularioEdicionServicio').hide();
        mostrarServicios();
    });

});
