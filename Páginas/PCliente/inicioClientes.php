<?php
session_start();

if (isset($_POST['cerrar_sesion'])) {
    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();

    header('Content-Type: application/json');
    echo json_encode(array('success' => true, 'message' => 'Sesión cerrada correctamente'));
    exit(); 
}

$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(array('success' => false, 'message' => 'Conexión fallida: ' . $conn->connect_error)));
}

$nombre_usuario = isset($_SESSION['nombre_usuario']) ? $_SESSION['nombre_usuario'] : '';

if (empty($nombre_usuario)) {
    header('Content-Type: application/json');
    echo json_encode(array('success' => false, 'message' => 'Sesión no válida, redirigiendo...'));
    exit();}
$sql = "SELECT nombre_cli, appaterno_cli, apmaterno_cli, direccion_cli, fono_cli, correo_cl, rut FROM cliente WHERE nombre_usuario = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die(json_encode(array('success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conn->error)));
}
$bindResult = $stmt->bind_param("s", $nombre_usuario);
if (!$bindResult) {
    die(json_encode(array('success' => false, 'message' => 'Error en el bind de parámetros: ' . $stmt->error)));}
if ($stmt->execute()) {
    $stmt->bind_result($nombre_cli, $appaterno_cli, $apmaterno_cli, $direccion_cli, $fono_cli, $correo_cli, $rut);
    $stmt->fetch();
     header('Content-Type: application/json');
     echo json_encode(array(
        'success' => true,
        'nombre_cli' => $nombre_cli,
        'appaterno_cli' => $appaterno_cli,
        'apmaterno_cli' => $apmaterno_cli,
        'direccion_cli' => $direccion_cli,
        'fono_cli' => $fono_cli,
        'correo_cli' => $correo_cli,
        'rut' => $rut
    ));
}else { die(json_encode(array('success' => false, 'message' => 'Error al ejecutar la consulta: ' . $stmt->error)));
}
$stmt->close();
