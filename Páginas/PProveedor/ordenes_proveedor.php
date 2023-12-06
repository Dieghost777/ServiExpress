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

$idProveedor = $_SESSION['id_proveedor'] ?? null; // Obtener el ID del proveedor de la sesión

if ($idProveedor !== null) {
    $sql = "SELECT op.id_orden AS 'ID', 
    Concat(e.nombre_emp , ' ', e.appaterno_emp) AS 'NombreEmpleado', 
    op.fecha_pedido AS 'FechaSolicitud', 
    op.producto_soli AS 'ProductoSolicitado', 
    op.estado AS 'Estado',
    op.cantidad_solicitada as 'Cantidad solicitada'
FROM orden_pedido op 
INNER JOIN empleado e ON e.id_empleado = op.Empleado_id_empleado 
WHERE op.Proveedor_id_proveedor = ?  AND op.estado = 'pendiente'
";


    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idProveedor);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $ordenes = [];
        while ($row = $result->fetch_assoc()) {
            $ordenes[] = $row;
        }
        echo json_encode($ordenes);
    } else {
        echo json_encode([]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "No se proporcionó un ID de proveedor válido"]);
}

$conn->close();
?>
