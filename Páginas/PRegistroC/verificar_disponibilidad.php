<?php
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$nombreUsuario = isset($_POST['nombreUsuario']) ? $_POST['nombreUsuario'] : '';

$sql = "SELECT COUNT(*) as count FROM cliente WHERE nombre_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombreUsuario);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$count = $row['count'];

$response = array('disponible' => $count == 0, 'mensaje' => $count == 0 ? 'El nombre de usuario está disponible.' : 'El nombre de usuario no está disponible.');
echo json_encode($response);

$stmt->close();
$conn->close();
?>
