function validarDatosPersonales() {
    const nombre = document.getElementById("nombre_cli").value;
    const appaterno = document.getElementById("appaterno_cli").value;
    const apmaterno = document.getElementById("apmaterno_cli").value;
    const direccion = document.getElementById("direccion_cli").value;
    const telefono = document.getElementById("fono_cli").value;
    const correo = document.getElementById("correo_cl").value;

    if (nombre === "" || appaterno === "" || apmaterno === "" || direccion === "" || telefono === "" || correo === "") {
        mostrarErrorRegistro("Por favor, completa todos los campos.");
        return false;
    }

    const correoValido = validarCorreo(correo);
    if (!correoValido) {
        mostrarErrorRegistro("Ingresa un correo electrónico válido.");
        return false;
    }

    $('#myTabs a[href="#datosUsuario"]').tab('show');
}

function mostrarErrorRegistro(mensaje) {
    const contenedorErrores = $("#errores-registro");

    if (contenedorErrores.children().length > 0) {
        contenedorErrores.children().replaceWith($("<div class='error-message'></div>").text(mensaje));
    } else {
        const mensajeDiv = $("<div class='error-message'></div>").text(mensaje);

        contenedorErrores.append(mensajeDiv);

        setTimeout(() => {
            mensajeDiv.fadeOut('slow', () => {
                mensajeDiv.remove();
            });
        }, 3000);
    }
}

function validarCorreo(correo) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
}

function formatearRutInput() {
    const inputRut = document.getElementById('rut');
    inputRut.value = formatearRut(inputRut.value);
}

function formatearRut(rut) {
    rut = rut.replace(/[.-]/g, '');

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();

    return cuerpo.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.') + '-' + dv;
}

async function verificarDisponibilidad() {
    const nombreUsuario = document.getElementById('nombre_usuario').value;

    try {
        const response = await fetch('verificar_disponibilidad.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nombre_usuario=${encodeURIComponent(nombreUsuario)}`,
        });

        if (response.ok) {
            const respuesta = await response.json();
            if (respuesta.disponible) {
                mostrarDatosUsuario();
            } else {
                mostrarMensajeUsuarioNoDisponible("El nombre de usuario no está disponible.");
            }
        } else {
            console.error('Error en la solicitud AJAX:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud AJAX:', error);
    }
}

function mostrarMensajeUsuarioNoDisponible(mensaje) {
    const mensajeDiv = $("<div class='error-message-red'></div>").text(mensaje);
    $("#errores-registro").empty().append(mensajeDiv);
}

async function mostrarDatosUsuario() {
    await registrarUsuario();
}

async function registrarUsuario() {
    const nombre = document.getElementById("nombre_cli").value;
    const appaterno = document.getElementById("appaterno_cli").value;
    const apmaterno = document.getElementById("apmaterno_cli").value;
    const direccion = document.getElementById("direccion_cli").value;
    const telefono = document.getElementById("fono_cli").value;
    const correo = document.getElementById("correo_cl").value;
    const nombreUsuario = document.getElementById("nombre_usuario").value;
    const rut = document.getElementById("rut").value;
    const contrasena = document.getElementById("contrasena").value;

    try {
        const response = await fetch('registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nombre_cli=${encodeURIComponent(nombre)}&appaterno_cli=${encodeURIComponent(appaterno)}&apmaterno_cli=${encodeURIComponent(apmaterno)}&direccion_cli=${encodeURIComponent(direccion)}&fono_cli=${encodeURIComponent(telefono)}&correo_cl=${encodeURIComponent(correo)}&nombre_usuario=${encodeURIComponent(nombreUsuario)}&rut=${encodeURIComponent(rut)}&contrasena=${encodeURIComponent(contrasena)}`,
        });

        if (response.ok) {
            const respuesta = await response.json();
            if (respuesta.success) {
                console.log(respuesta.message);
                window.location.href = '../index.html';
            } else {
                mostrarErrorRegistro(respuesta.message);
            }
        } else {
            console.error('Error en la solicitud AJAX:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud AJAX:', error);
    }
}
