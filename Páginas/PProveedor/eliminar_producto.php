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
    // Obtener el ID del producto a eliminar
    $idProducto = $_POST['id_producto'];

    // Eliminar el producto de la base de datos
    $sql = "DELETE FROM productos_proveedor WHERE id_producto = $idProducto";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Producto eliminado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al eliminar el producto: " . $conn->error]);
    }
}

$conn->close();
?>
