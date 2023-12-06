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

$nombreUsuario = isset($_POST['nombreUsuario']) ? $conn->real_escape_string($_POST['nombreUsuario']) : '';
$contrasena = isset($_POST['contrasena']) ? $conn->real_escape_string($_POST['contrasena']) : '';
$idTipoUsuario = isset($_POST['idTipoUsuario']) ? $conn->real_escape_string($_POST['idTipoUsuario']) : '';

$columnaID = ''; 

switch ($idTipoUsuario) {
    case 1:
        $tablaUsuario = 'cliente';
        $columnaID = 'id_cliente'; 
        break;
    case 2:
        $tablaUsuario = 'proveedor';
        $columnaID = 'id_proveedor';
        break;
    case 3:
        $tablaUsuario = 'empleado';
        $columnaID = 'id_empleado'; 
        break;
    default:
        $response = array('success' => false, 'message' => 'Tipo de usuario no válido');
        echo json_encode($response);
        exit;
}

$sql = "SELECT $columnaID FROM $tablaUsuario WHERE nombre_usuario = '$nombreUsuario' AND contrasena = '$contrasena'";
$resultadoUsuario = $conn->query($sql);

if ($resultadoUsuario !== false) {
    if ($resultadoUsuario->num_rows > 0) {
        $_SESSION['nombre_usuario'] = $nombreUsuario;
        $usuario = $resultadoUsuario->fetch_assoc();
        // Guardar la ID del proveedor en $_SESSION['id_proveedor']
        if ($idTipoUsuario == 2) { // Si el usuario es un proveedor
            $_SESSION['id_proveedor'] = $usuario[$columnaID];
        }
        $_SESSION['id_usuario'] = $usuario[$columnaID]; 
        $response = array('success' => true, 'message' => 'Usuario encontrado');
        echo json_encode($response);
    } else {
        $response = array('success' => false, 'message' => 'Usuario no encontrado');
        echo json_encode($response);
    }
} else {
    $response = array('success' => false, 'message' => 'Error en la consulta del usuario: ' . $conn->error);
    echo json_encode($response);
}

$conn->close();
?>
