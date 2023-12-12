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

$idBoleta = $_POST['idBoleta'];
$fechaEmision = $_POST['fechaEmision'];
$monto = $_POST['monto'];

$query = "UPDATE boleta SET fecha_emision = '$fechaEmision', monto = '$monto' WHERE id_boleta = '$idBoleta'";

if ($conn->query($query) === TRUE) {
    echo "Boleta actualizada exitosamente";
} else {
    echo "Error al actualizar la boleta: " . $conn->error;
}

$conn->close();
?>
