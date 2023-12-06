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

if ($idProveedor !== null) {
    $sql = "SELECT id_empleado, CONCAT(nombre_emp, ' ', appaterno_emp) AS nombre_completo
            FROM empleado
          ";

    $result = $conn->query($sql);

    $empleados = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $empleados[] = [
                'id_empleado' => $row['id_empleado'],
                'nombre' => $row['nombre_completo']
            ];
        }
    }

    echo json_encode($empleados);
} else {
    echo json_encode(["error" => "No se proporcionó un ID de proveedor válido"]);
}

$conn->close();
?>
