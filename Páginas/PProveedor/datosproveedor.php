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

if (isset($_GET['cerrar_sesion'])) {
    $_SESSION = array();
    session_destroy();

    header('Content-Type: application/json');
    echo json_encode(array('success' => true, 'message' => 'Sesión cerrada correctamente'));
    exit();
}

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(array('error' => 'No se ha iniciado sesión'));
    exit();
}

$id_usuario = $_SESSION['id_usuario'];

$sql = "SELECT nom_empresa, Correo, contacto_prov, rubro_prov, nombre_usuario, rut FROM proveedor WHERE id_proveedor = ?";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $nom_empresa = $row['nom_empresa'];
        $correo = $row['Correo'];
        $contacto_prov = $row['contacto_prov'];
        $rubro_prov = $row['rubro_prov'];
        $nombre_usuario = $row['nombre_usuario'];
        $rut = $row['rut'];

        // Creamos un array con los datos
        $datos_usuario = array(
            'Nombre Empresa' => $nom_empresa,
            'Correo' => $correo,
            'Contacto' => $contacto_prov,
            'Rubro' => $rubro_prov,
            'Nombre de Usuario' => $nombre_usuario,
            'RUT' => $rut
        );

        // Codificamos los datos a formato JSON
        $datos_json = json_encode($datos_usuario);
        echo $datos_json;
    } else {
        echo json_encode(array('error' => 'No se encontraron resultados'));
    }

    $stmt->close();
} else {
    echo json_encode(array('error' => 'Error en la preparación de la consulta'));
}

$conn->close();
?>
