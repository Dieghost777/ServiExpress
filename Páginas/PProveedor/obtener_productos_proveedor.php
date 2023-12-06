<?php
session_start();

$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error]);
    exit;
}

if (!isset($_SESSION['id_proveedor'])) {
    echo json_encode(['success' => false, 'message' => 'No hay proveedor logueado']);
    exit;
}

$idProveedor = $_SESSION['id_proveedor'];

$sql = "SELECT id_producto, nombre_producto, precio, stock, StockDisponible FROM productos_proveedor WHERE id_proveedor = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idProveedor);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode(['success' => true, 'productos' => $productos]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontraron productos']);
}

$stmt->close();
$conn->close();
?>
