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

$nombre = $_GET['nombre'];
$rut = $_GET['rut'];

$sql = "SELECT CONCAT(nombre_cli, ' ', appaterno_cli, ' ', apmaterno_cli) AS 'NOMBRE',
               rut AS 'RUT',
               correo_cl AS 'CORREO',
               fono_cli AS 'Telefono',
               direccion_cli AS 'Direccion'
        FROM CLIENTE
        WHERE nombre_cli LIKE '%$nombre%' OR rut = '$rut'";

$result = $conn->query($sql);

$clientes = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($clientes);

$conn->close();
?>
