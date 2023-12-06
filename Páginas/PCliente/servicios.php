<?php 
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if (isset($_GET['obtener_servicios'])) {
    $sql = "SELECT id_servicio, Desc_serv, Precio_serv, Tiempo_estimado FROM servicio";
    $result = $conn->query($sql);

    if ($result === false) {
        die(json_encode(array('success' => false, 'message' => 'Error en la consulta de servicios: ' . $conn->error)));
    }

    $servicios = array();

    while ($row = $result->fetch_assoc()) {
        $servicios[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($servicios);

    $conn->close();
    exit();
}

?>