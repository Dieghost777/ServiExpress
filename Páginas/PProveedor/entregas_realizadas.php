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

$idProveedor = $_SESSION['id_proveedor'] ?? null;
$fechaInicio = $_GET['fecha_inicio'] ?? null;
$fechaFin = $_GET['fecha_fin'] ?? null;

if ($idProveedor !== null) {
    $sql = "SELECT CONCAT('La Empresa ', p.nom_empresa, ' hace entrega del producto/s ', rp.producto_recibido, 
    ' al empleado ', CONCAT(e.nombre_emp, ' ', e.appaterno_emp), 
    ' Por la cantidad: ', rp.cantidad, ' el día ', rp.fecha_recep) as Recepcion 
FROM recepcion_producto rp 
INNER JOIN proveedor p ON p.id_proveedor = rp.Orden_pedido_Proveedor_id_proveedor 
INNER JOIN empleado e ON e.id_empleado = rp.Orden_pedido_Empleado_id_empleado 
WHERE rp.Orden_pedido_Proveedor_id_proveedor =  ?";

    $params = "i"; // Tipo de dato de los parámetros: i (entero)
    $values = [$idProveedor]; // Valores de los parámetros

    // Agregar condiciones de fecha si se proporcionan fechas válidas
    if ($fechaInicio !== null && $fechaFin !== null) {
        $sql .= " AND rp.fecha_recep BETWEEN ? AND ?";
        $params .= "ss"; // Agregar tipos de dato para las fechas
        $values[] = $fechaInicio;
        $values[] = $fechaFin;
    }

    // Preparar la consulta
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        // Vincular parámetros
        $stmt->bind_param($params, ...$values);

        // Ejecutar la consulta
        $stmt->execute();

        // Obtener resultados
        $result = $stmt->get_result();
        
        $entregas = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $entregas[] = $row['Recepcion'];
            }
        }

        // Convertir el array PHP a formato JSON para usarlo en JavaScript
        echo json_encode($entregas);

        // Cerrar la sentencia
        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la preparación de la consulta"]);
    }
} else {
    echo json_encode(["error" => "No se proporcionó un ID de proveedor válido"]);
}

$conn->close();




?>
