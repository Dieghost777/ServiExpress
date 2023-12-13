<?php
// Recibir datos del formulario
$nombreEmpresa = $_POST['nombreEmpresa'];
$correo = $_POST['correo'];
$contacto = $_POST['contacto'];
$rubro = $_POST['rubro'];
$contrasena = $_POST['contrasena'];
$nombreUsuario = $_POST['nombreUsuario'];
$rut = $_POST['rut'];

// Conectar a la base de datos (agrega tus credenciales)
$host = "127.0.0.1";
$puerto = 3308;
$usuario = "root";
$contrasena = "admin";
$base_de_datos = "bddserviexpress";

// Crear conexión
$conn = new mysqli($host, $usuario, $contrasena, $base_de_datos, $puerto);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// ID del tipo de usuario por defecto
$idTipoUsuario = 3; // Puedes modificarlo según tus necesidades

// Consulta para insertar datos en la base de datos
$sql = "INSERT INTO proveedor (nom_empresa, Correo, contacto_prov, rubro_prov, contrasena, nombre_usuario, rut, id_tipo_usuario)
        VALUES ('$nombreEmpresa', '$correo', $contacto, '$rubro', '$contrasena', '$nombreUsuario', '$rut', $idTipoUsuario)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array('mensaje' => 'Proveedor registrado exitosamente'));
} else {
    echo json_encode(array('error' => 'Error al registrar proveedor: ' . $conn->error));
}

$conn->close();
?>
