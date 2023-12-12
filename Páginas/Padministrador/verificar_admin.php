<?php
session_start();
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    $response = array('success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error);
    die(json_encode($response));
}

$nombreUsuario = $_POST['nombreUsuario']; // Asegúrate de validar y escapar los datos del usuario.
$contrasena = $_POST['contrasena'];

$sql = "SELECT id FROM administrador WHERE nombre_usuario = '$nombreUsuario' AND contrasena = '$contrasena'";
$resultadoUsuario = $conn->query($sql);

if ($resultadoUsuario !== false && $resultadoUsuario->num_rows > 0) {
    $row = $resultadoUsuario->fetch_assoc();
    $_SESSION['id_administrador'] = $row['id']; // Guarda el ID del administrador en la sesión.
    $_SESSION['nombre_usuario'] = $nombreUsuario;
    $response = array('success' => true, 'message' => 'Usuario encontrado');
    echo json_encode($response);
} else {
    $response = array('success' => false, 'message' => 'Usuario no encontrado');
    echo json_encode($response);
}

$conn->close();
?>
