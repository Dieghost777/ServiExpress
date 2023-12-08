<?php
session_start();

$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$nombreCliente = $_GET['nombreCliente'] ?? '';

$sql = "SELECT CONCAT(C.nombre_cli, ' ', C.appaterno_cli) AS 'Nombre Cliente', S.Desc_serv AS 'Servicio Solicitado', 
        CONCAT('RESERVA SOLICITADA PARA LA FECHA ', RH.fecha_res, ' A LAS ', RH.hora_res) AS 'Hora'
        FROM reserva_hora RH
        INNER JOIN cliente C ON C.id_cliente = RH.Cliente_id_cliente 
        INNER JOIN servicio S ON S.id_servicio = RH.id_servicio";

if (!empty($nombreCliente)) {
    // Dividir el nombre ingresado en palabras separadas
    $keywords = explode(' ', $nombreCliente);
    
    $conditions = [];
    foreach ($keywords as $keyword) {
        $conditions[] = "C.nombre_cli LIKE '%$keyword%' OR C.appaterno_cli LIKE '%$keyword%'";
    }
    
    $sql .= " WHERE " . implode(' OR ', $conditions);
}

$result = $conn->query($sql);

$reservas = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reservas[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($reservas);

$conn->close();
?>
