<?php
session_start();
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    $response = array('success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error);
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Realizar la consulta para obtener los nombres y precios de los servicios
    $sql = "SELECT id_servicio, Desc_serv, Precio_serv FROM servicio";
    $result = $conn->query($sql);

    $services = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }
    }

    echo json_encode($services);
} else {
    echo json_encode(array('success' => false, 'message' => 'Método no permitido'));
}

?>
