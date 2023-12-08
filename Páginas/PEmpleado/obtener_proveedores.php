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

$sql = "SELECT id_proveedor, nom_empresa FROM proveedor";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $proveedores = array();
    while ($row = $result->fetch_assoc()) {
        $proveedor = array(
            'id' => $row['id_proveedor'],
            'nombre' => $row['nom_empresa']
        );
        array_push($proveedores, $proveedor);
    }
    $response = array('success' => true, 'proveedores' => $proveedores);
    echo json_encode($response);
} else {
    $response = array('success' => false, 'message' => 'No se encontraron proveedores');
    echo json_encode($response);
}

$conn->close();
?>
