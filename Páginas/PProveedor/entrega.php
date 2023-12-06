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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fechaRecepcion = $_POST['fecha_recep'];
    $idOrden = $_POST['Orden_pedido_id_orden'];
    $idEmpleado = $_POST['Orden_pedido_Empleado_id_empleado'];
    $idProveedor = $_SESSION['id_proveedor']; // Obtener la ID del proveedor de la sesión
    $productoRecibido = $_POST['producto_recibido']; // Nuevo campo: producto recibido
    $cantidad = $_POST['cantidad']; // Nuevo campo: cantidad

    // Verificar si la orden existe en la tabla orden_pedido
    $ordenExistente = "SELECT * FROM orden_pedido 
                       WHERE id_orden = '$idOrden' 
                       AND Proveedor_id_proveedor = '$idProveedor'";

    $resultado = $conn->query($ordenExistente);

    if ($resultado->num_rows > 0) {
        // La orden existe, realizar la inserción en la tabla recepcion_producto
        $sql = "INSERT INTO recepcion_producto (fecha_recep, Orden_pedido_id_orden, Orden_pedido_Empleado_id_empleado, Orden_pedido_Proveedor_id_proveedor, producto_recibido, cantidad) 
                VALUES ('$fechaRecepcion', '$idOrden', '$idEmpleado', '$idProveedor', '$productoRecibido', '$cantidad')";

        if ($conn->query($sql) === TRUE) {
            echo "Entrega registrada con éxito";
        } else {
            echo "Error al registrar la entrega: " . $conn->error;
        }
    } else {
        echo "La orden no existe en la base de datos";
    }
}

$conn->close();
?>
