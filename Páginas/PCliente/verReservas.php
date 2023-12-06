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

if (!isset($_SESSION['id_usuario'])) {
    exit;
}
$idUsuario = $_SESSION['id_usuario'];
if (isset($_POST['eliminarReserva'])) {
    $idReserva = $_POST['idReserva']; // Obtener el ID de la reserva a eliminar
    $sql = "DELETE FROM reserva_hora WHERE id_reserva = $idReserva AND Cliente_id_cliente = $idUsuario";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('success' => true, 'message' => 'Reserva eliminada correctamente'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Error al eliminar la reserva: ' . $conn->error));
    }

    $conn->close();
    exit;
}
// Consulta SQL para obtener las reservas del usuario
$sql = "SELECT id_reserva, s.Desc_serv AS nombreServicio, r.fecha_res AS fecha, r.hora_res AS hora
        FROM reserva_hora r
        INNER JOIN servicio s ON r.id_servicio = s.id_servicio
        WHERE r.Cliente_id_cliente = $idUsuario";
// Ejecutar la consulta
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $reservas = array();
    while ($row = $result->fetch_assoc()) {
        $reservas[] = $row;
    }
    echo json_encode($reservas); // Enviar las reservas como respuesta JSON
} else {
    echo json_encode(array()); // Enviar un array vacío si no hay reservas
}

$conn->close();
?>
