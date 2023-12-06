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

if (isset($_SESSION['id_usuario'])) {
    $idUsuario = $_SESSION['id_usuario'];

    $query = "
        SELECT
            CONCAT(c.nombre_cli, ' ', c.appaterno_cli) AS nombre,
            b.fecha_emision AS fecha,
            b.monto AS Monto_Pagado,
            s.Desc_serv AS Servicio_Pagado
        FROM
            boleta b
        INNER JOIN
            Cliente c ON c.id_cliente = b.Cliente_id_cliente
        INNER JOIN
            servicio s ON s.id_servicio = b.id_servicio
        WHERE
            c.id_cliente = $idUsuario
    ";

    $result = $conn->query($query);

    if ($result) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        $response = array('success' => false, 'message' => 'Error en la consulta: ' . $conn->error);
        echo json_encode($response);
    }
} else {
    echo "Sesión no iniciada o ID de usuario no disponible.";
}

$conn->close();
?>
