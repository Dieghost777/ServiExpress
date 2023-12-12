<?php
session_start();

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

$productoSolicitado = $_POST['productoSolicitado'];
$cantidadSolicitada = $_POST['cantidadSolicitada'];
$fechaPedido = $_POST['fechaPedido'];
$idEmpleado = $_SESSION['id_empleado'];
$idProveedor = $_POST['idProveedor'];

$stmt = $conn->prepare("SELECT id_producto, stockDisponible FROM productos_proveedor WHERE id_proveedor = ? AND id_producto = ?");
$stmt->bind_param("ii", $idProveedor, $productoSolicitado);
$stmt->execute();
$stmt->bind_result($idProducto, $stockDisponible);
$stmt->fetch();
$stmt->close();

if ($idProducto) {
    if ($cantidadSolicitada <= $stockDisponible) {
        $stmtProductName = $conn->prepare("SELECT nombre_producto FROM productos_proveedor WHERE id_proveedor = ? AND id_producto = ?");
        $stmtProductName->bind_param("ii", $idProveedor, $productoSolicitado);
        $stmtProductName->execute();
        $stmtProductName->bind_result($nombreProducto);
        $stmtProductName->fetch();
        $stmtProductName->close();

        $sqlInsert = "INSERT INTO orden_pedido (producto_soli, cantidad_solicitada, fecha_pedido, Empleado_id_empleado, Proveedor_id_proveedor) VALUES (?, ?, ?, ?, ?)";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bind_param("sisis", $nombreProducto, $cantidadSolicitada, $fechaPedido, $idEmpleado, $idProveedor);

        if ($stmtInsert->execute()) {
            $sqlUpdate = "UPDATE productos_proveedor SET stockDisponible = stockDisponible - ? WHERE id_proveedor = ? AND id_producto = ?";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bind_param("iii", $cantidadSolicitada, $idProveedor, $idProducto);

            if ($stmtUpdate->execute()) {
                $response = array('success' => true, 'message' => 'Orden de pedido creada correctamente. Cantidad actualizada en productos_proveedor.');
                echo json_encode($response);
            } else {
                $response = array('success' => false, 'message' => 'Error al actualizar la cantidad disponible: ' . $stmtUpdate->error);
                echo json_encode($response);
            }
            $stmtUpdate->close();
        } else {
            $response = array('success' => false, 'message' => 'Error al crear la orden de pedido: ' . $stmtInsert->error);
            echo json_encode($response);
        }
        $stmtInsert->close();
    } else {
        $response = array('success' => false, 'message' => 'Excedes el stock disponible.');
        echo json_encode($response);
    }
} else {
    $response = array('success' => false, 'message' => 'No se pudo obtener la ID del producto.');
    echo json_encode($response);
}

$conn->close();
?>
