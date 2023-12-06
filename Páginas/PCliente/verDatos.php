<?php
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
session_start();
if (!isset($_SESSION['id_usuario'])) {
    exit('No hay sesión activa');
}
$idUsuario = $_SESSION['id_usuario'];
$sql = "SELECT nombre_cli, appaterno_cli, apmaterno_cli, direccion_cli, fono_cli, correo_cl, rut, foto_perfil FROM cliente WHERE id_cliente = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la preparación de la consulta: " . $conn->error);
}
$stmt->bind_param("i", $idUsuario);
if (!$stmt->execute()) {
    die("Error al ejecutar la consulta: " . $stmt->error);
}
$result = $stmt->get_result();

if ($result->num_rows > 0) {
$row = $result->fetch_assoc();
header('Content-Type: application/json');
echo json_encode($row);
} else {
echo json_encode(array("message" => "No se encontraron datos del usuario"));
}
$stmt->close();
$conn->close();
?>
