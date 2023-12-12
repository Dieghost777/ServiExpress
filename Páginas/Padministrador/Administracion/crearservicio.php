<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    $server = "127.0.0.1:3308";
    $user = "root";
    $pass = "admin";
    $db = "bddserviexpress";
    
    // Crea la conexión
    $conn = new mysqli($server, $user, $pass, $db);

    // Verifica la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Obtén los valores del formulario
    $descripcion = $_POST['descripcion'];
    $precio = $_POST['precio'];
    $tiempoEstimado = $_POST['tiempoEstimado'];

    // Prepara la consulta SQL para insertar un nuevo servicio
    $sql = "INSERT INTO servicio (Desc_serv, Precio_serv, Tiempo_estimado)
            VALUES ('$descripcion', '$precio', '$tiempoEstimado')";

    // Ejecuta la consulta y verifica si fue exitosa
    if ($conn->query($sql) === TRUE) {
        echo "Nuevo servicio agregado correctamente";
    } else {
        echo "Error al agregar el servicio: " . $conn->error;
    }

    $conn->close();
}
?>
