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

if (!isset($_SESSION['id_empleado'])) {
    echo json_encode(array('error' => 'No se ha iniciado sesión'));
    exit();
}

$id_empleado = $_SESSION['id_empleado'];

$sql = "SELECT nombre_emp, appaterno_emp, apmaterno_emp, cargo_emp, rut, correo FROM empleado WHERE id_empleado = ?";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param("i", $id_empleado);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $nombre_emp = $row['nombre_emp'];
        $appaterno_emp = $row['appaterno_emp'];
        $apmaterno_emp = $row['apmaterno_emp'];
        $cargo_emp = $row['cargo_emp'];
        $rut = $row['rut'];
        $correo = $row['correo'];

        // Creamos un array con los datos del empleado
        $datos_empleado = array(
            'Nombre' => $nombre_emp,
            'Apellido Paterno' => $appaterno_emp,
            'Apellido Materno' => $apmaterno_emp,
            'Cargo' => $cargo_emp,
            'RUT' => $rut,
            'Correo' => $correo
        );

        // Codificamos los datos a formato JSON
        $datos_json = json_encode($datos_empleado);
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
