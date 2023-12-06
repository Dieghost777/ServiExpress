<?php
// Establecer conexión a la base de datos
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

// Crear conexión
$conn = new mysqli($server, $user, $pass, $db);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Comprobar si existe una sesión activa
session_start();
if (!isset($_SESSION['id_usuario'])) {
    exit('No hay sesión activa');
}

// Obtener el ID de usuario de la sesión
$idUsuario = $_SESSION['id_usuario'];

// Recibir los datos del formulario
$nombre = $_POST['nombre'];
$apellidoPaterno = $_POST['apellidoPaterno'];
$apellidoMaterno = $_POST['apellidoMaterno'];
$direccion = $_POST['direccion'];
$telefono = $_POST['telefono'];
$correo = $_POST['correo'];
$rut = $_POST['rut'];

// Consulta para actualizar los datos del usuario
$sql = "UPDATE cliente SET nombre_cli=?, appaterno_cli=?, apmaterno_cli=?, direccion_cli=?, fono_cli=?, correo_cl=?, rut=? WHERE id_cliente=?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la preparación de la consulta: " . $conn->error);
}

// Enlazar parámetros y ejecutar la consulta
$stmt->bind_param("ssssisss", $nombre, $apellidoPaterno, $apellidoMaterno, $direccion, $telefono, $correo, $rut, $idUsuario);
if (!$stmt->execute()) {
    die("Error al ejecutar la consulta: " . $stmt->error);
}

// Si la actualización fue exitosa, envía una respuesta JSON
$response = array("success" => true, "message" => "Datos actualizados correctamente");
echo json_encode($response);

// Cerrar la conexión y liberar recursos
$stmt->close();
$conn->close();
?>
