<?php
// Recibir datos del formulario
$nombre = $_POST['nombre'];
$apellidoPaterno = $_POST['apellidoPaterno'];
$apellidoMaterno = $_POST['apellidoMaterno'];
$cargo = $_POST['cargo'];
$rut = $_POST['rut'];
$correo = $_POST['correo'];
$nombreUsuario = $_POST['nombreUsuario'];
$contrasena = $_POST['contrasena'];

// Conectar a la base de datos (aquí debes agregar tus credenciales)
$server = "127.0.0.1:3308";
$user = "root";
$pass = "admin";
$db = "bddserviexpress";

$conn = new mysqli($server, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para insertar datos en la base de datos
$sql = "INSERT INTO empleado (nombre_emp, appaterno_emp, apmaterno_emp, cargo_emp, rut, correo, nombre_usuario, id_tipo_usuario, contrasena)
        VALUES ('$nombre', '$apellidoPaterno', '$apellidoMaterno', '$cargo', '$rut', '$correo', '$nombreUsuario', 4, '$contrasena')";

if ($conn->query($sql) === TRUE) {
  $response = array("mensaje" => "Empleado registrado exitosamente");
  echo json_encode($response);
} else {
  $response = array("error" => "Error al registrar empleado: " . $conn->error);
  echo json_encode($response);
}

$conn->close();
?>
