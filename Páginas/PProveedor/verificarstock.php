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

if (isset($_SESSION['id_proveedor'])) {
    $idProveedor = $_SESSION['id_proveedor'];

    $cantidadSolicitada = $_POST['cantidad'];
    $nombreProducto = $_POST['nombre_producto'];

    $sql = "SELECT `Stock Disponible` FROM productos_proveedor WHERE `Nombre` = '$nombreProducto' AND `ID Proveedor` = $idProveedor";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $stockDisponible = $row['Stock Disponible'];

        if ($cantidadSolicitada <= $stockDisponible) {
            echo 'disponible';
        } else {
            echo 'no_disponible';
        }
    } else {
        echo 'producto_no_encontrado';
    }
} else {
    echo 'sesion_no_iniciada';
}

$conn->close();
?>
