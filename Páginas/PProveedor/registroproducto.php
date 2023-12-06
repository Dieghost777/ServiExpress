<?php
session_start();

$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión a la base de datos"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar si hay una sesión de proveedor iniciada
    if (!isset($_SESSION['id_proveedor'])) {
        http_response_code(403); // Acceso prohibido si no hay una sesión activa
        echo json_encode(["message" => "Acceso denegado"]);
        exit;
    }

    $id_proveedor = $_SESSION['id_proveedor'];
    $nombre_producto = isset($_POST['nombre_producto']) ? $conn->real_escape_string($_POST['nombre_producto']) : '';
    $precio = isset($_POST['precio']) ? floatval($_POST['precio']) : 0;
    $stock = isset($_POST['stock']) ? intval($_POST['stock']) : 0;

    // Establecer el stock disponible igual al stock base
    $stock_disponible = $stock;

    $sql = "INSERT INTO productos_proveedor (id_proveedor, nombre_producto, precio, stock, StockDisponible) 
            VALUES ($id_proveedor, '$nombre_producto', $precio, $stock, $stock_disponible)";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Producto registrado exitosamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al registrar el producto: " . $conn->error]);
    }

    // Depuración - Enviar información a la consola del navegador
    echo "<script>console.log('ID del proveedor:', " . json_encode($_SESSION['id_proveedor']) . ");</script>";
}

$conn->close();