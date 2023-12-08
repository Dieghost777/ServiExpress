<?php
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

$idProveedor = isset($_GET['idProveedor']) ? $_GET['idProveedor'] : null;
$nombreProducto = isset($_GET['nombreProducto']) ? $_GET['nombreProducto'] : null;

if ($idProveedor !== null && $nombreProducto !== null) {
    $sql = "SELECT id_producto, stockDisponible FROM productos_proveedor WHERE id_proveedor = $idProveedor AND nombre_producto = '$nombreProducto'
    and stockDisponible>0";
    
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $stockData = $result->fetch_assoc();
        $stock = $stockData['stockDisponible'];
        $idProducto = $stockData['id_producto'];

        echo json_encode(array("success" => true, "stock" => $stock, "idProducto" => $idProducto));
    } else {
        echo json_encode(array("success" => false, "message" => "No se encontró stock para este producto y proveedor"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Faltan parámetros para realizar la consulta"));
}

$conn->close();
?>
