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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['fecha']) || !isset($_POST['hora']) || !isset($_POST['servicio']) || !isset($_SESSION['id_usuario'])) {
        $missingData = array();
        if (!isset($_POST['fecha'])) $missingData[] = 'fecha';
        if (!isset($_POST['hora'])) $missingData[] = 'hora';
        if (!isset($_POST['servicio'])) $missingData[] = 'servicio';
        if (!isset($_SESSION['id_usuario'])) $missingData[] = 'id_usuario';

        echo json_encode(array('success' => false, 'message' => 'Datos incompletos o incorrectos', 'missing_data' => $missingData));
        exit;
    }

    $fecha_reserva = $_POST['fecha'];
    $hora_reserva = $_POST['hora'];
    $id_cliente = $_SESSION['id_usuario']; // ID del usuario logeado
    $id_servicio = $_POST['servicio']; // ID del servicio seleccionado en el combo box

    $sql = "INSERT INTO reserva_hora (fecha_res, hora_res, Cliente_id_cliente, id_servicio) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ssii", $fecha_reserva, $hora_reserva, $id_cliente, $id_servicio);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(array('success' => true, 'message' => 'Reserva realizada con éxito'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Error al realizar la reserva'));
        }

        $stmt->close();
    } else {
        echo json_encode(array('success' => false, 'message' => 'Error en la preparación de la consulta'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Método no permitido'));
}
?>