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
//Validacion de los datos en modo post (Post es cuandoo recibe el servidor) :v
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['fecha']) || !isset($_POST['hora']) || !isset($_POST['precioServicio']) || !isset($_SESSION['id_usuario']) || !isset($_POST['servicio'])) {
        $response = array('success' => false, 'message' => 'Datos incompletos o incorrectos');
        echo json_encode($response);
        exit;
    }

    //Variables :v
    $fecha_emision = $_POST['fecha'];
    $monto = $_POST['precioServicio'];
    //La id del usuario se guarda globalmente  con session cuando un usuario se logea
    $id_cliente = $_SESSION['id_usuario'];
    $id_servicio = $_POST['servicio'];
    //Preparacion de consulta
    $sql = "INSERT INTO boleta (fecha_emision, monto, Cliente_id_cliente, id_servicio) VALUES (?, ?, ?, ?)";
    //Inicia la consulta y la envia al servidor, aparte la variable stmt guarda los datos
    $stmt = $conn->prepare($sql);
// Inserta los datos
    if ($stmt) {
        $stmt->bind_param("siii", $fecha_emision, $monto, $id_cliente, $id_servicio);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $response = array('success' => true, 'message' => 'Datos de boleta insertados con éxito');
            echo json_encode($response);
        } else {
            $response = array('success' => false, 'message' => 'Error al insertar datos en la boleta');
            echo json_encode($response);
        }

        $stmt->close();
    } else {
        $response = array('success' => false, 'message' => 'Error en la preparación de la consulta');
        echo json_encode($response);
    }
} else {
    $response = array('success' => false, 'message' => 'Método no permitido');
    echo json_encode($response);
}

$conn->close();
?>
