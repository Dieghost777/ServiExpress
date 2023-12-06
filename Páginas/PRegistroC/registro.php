<?php
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(array('success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error)));
}

// Agregar la id_tipo_usuario y asignarle el valor 1
$id_tipo_usuario = 1;

$nombre_cli = isset($_POST['nombre_cli']) ? $_POST['nombre_cli'] : '';
$appaterno_cli = isset($_POST['appaterno_cli']) ? $_POST['appaterno_cli'] : '';
$apmaterno_cli = isset($_POST['apmaterno_cli']) ? $_POST['apmaterno_cli'] : '';
$direccion_cli = isset($_POST['direccion_cli']) ? $_POST['direccion_cli'] : '';
$fono_cli = isset($_POST['fono_cli']) ? $_POST['fono_cli'] : '';
$correo_cli = isset($_POST['correo_cl']) ? $_POST['correo_cl'] : '';
$nombre_usuario = isset($_POST['nombre_usuario']) ? $_POST['nombre_usuario'] : '';
$rut = isset($_POST['rut']) ? $_POST['rut'] : '';
$contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';

$sql = "INSERT INTO cliente (nombre_cli, appaterno_cli, apmaterno_cli, direccion_cli, fono_cli, correo_cl, nombre_usuario, rut, contrasena, id_tipo_usuario)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die(json_encode(array('success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conn->error)));
}

$bindResult = $stmt->bind_param("sssssssssi", $nombre_cli, $appaterno_cli, $apmaterno_cli, $direccion_cli, $fono_cli, $correo_cli, $nombre_usuario, $rut, $contrasena, $id_tipo_usuario);

if (!$bindResult) {
    die(json_encode(array('success' => false, 'message' => 'Error en el bind de parámetros: ' . $stmt->error)));
}

if ($stmt->execute()) {
    // Registro completado
    echo json_encode(array('success' => true, 'message' => 'Registro exitoso'));

} else {
    // Registro fallido
    echo json_encode(array('success' => false, 'message' => 'Error al registrar: ' . $stmt->error));
}

$stmt->close();
$conn->close();
?>
