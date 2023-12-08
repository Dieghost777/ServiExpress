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

// Consulta para obtener los productos del proveedor dado su ID
$sql = "SELECT id_producto, nombre_producto FROM productos_proveedor WHERE id_proveedor = $idProveedor";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $productos = array();
    while ($row = $result->fetch_assoc()) {
        // Guardar cada producto en un arreglo
        $producto = array(
            "id" => $row["id_producto"],
            "nombre" => $row["nombre_producto"]
        );
        // Agregar el producto al arreglo de productos
        $productos[] = $producto;
    }
    // Devolver los productos en formato JSON
    echo json_encode(array("success" => true, "productos" => $productos));
} else {
    echo json_encode(array("success" => false, "message" => "No se encontraron productos para este proveedor"));
}

$conn->close();
?>
