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
    if (!isset($_SESSION['id_proveedor'])) {
        http_response_code(403);
        echo json_encode(["message" => "Acceso denegado"]);
        exit;
    }

    $idProducto = isset($_POST['id_producto']) ? intval($_POST['id_producto']) : 0;
    $nuevoStock = isset($_POST['nuevo_stock']) ? intval($_POST['nuevo_stock']) : 0;


    $sql = "UPDATE productos_proveedor SET stock = ?, StockDisponible = ? WHERE id_producto = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["message" => "Error al preparar la consulta"]);
        exit;
    }

    $stmt->bind_param("iii", $nuevoStock, $nuevoStock , $idProducto);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["message" => "Error al ejecutar la consulta"]);
        exit;
    }

    echo json_encode(["message" => "Stock actualizado correctamente"]);
}

$conn->close();
?>