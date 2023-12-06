<?php


session_start();
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(array('success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error)));
}

$sql = "SELECT * FROM administrador WHERE nombre_usuario = '$nombreUsuario' AND contrasena = '$contrasena'";
$resultadoUsuario = $conn->query($sql);

if ($resultadoUsuario !== false) {

    if ($resultadoUsuario->num_rows > 0) {
        $_SESSION['nombre_usuario'] = $nombreUsuario;
        echo json_encode(array('success' => true, 'message' => 'Usuario encontrado'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Usuario no encontrado'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Error en la consulta del usuario: ' . $conn->error));
}

$conn->close();
?>

?>