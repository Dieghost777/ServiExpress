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
$nombreCliente = $_GET['nombreCliente'] ?? null;

if ($nombreCliente !== null) {
    // Dividir el nombre ingresado en palabras separadas
    $keywords = explode(' ', $nombreCliente);
    
    // Crear una consulta dinámica para buscar por nombre o apellido
    $sql = "SELECT B.id_boleta AS 'ID Boleta', CONCAT(C.nombre_cli, ' ', C.apmaterno_cli) AS 'Nombre Cliente', C.rut AS 'Rut', 
            B.fecha_emision AS 'Fecha Emisión', S.Desc_serv AS 'Descripción Servicio', B.monto AS 'Monto'
            FROM BOLETA B
            INNER JOIN cliente C ON C.id_cliente = B.Cliente_id_cliente 
            INNER JOIN servicio S ON S.id_servicio = B.id_servicio
            WHERE ";
    
    $conditions = [];
    foreach ($keywords as $keyword) {
        $conditions[] = "C.nombre_cli LIKE '%$keyword%' OR C.apmaterno_cli LIKE '%$keyword%'";
    }
    
    // Unir las condiciones con OR para buscar por nombre o apellido
    $sql .= implode(' OR ', $conditions);

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $boletas = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $boletas[] = $row;
        }
        echo json_encode($boletas);
    } else {
        echo json_encode([]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No se proporcionó un nombre de cliente válido"]);
}

$conn->close();
?>
