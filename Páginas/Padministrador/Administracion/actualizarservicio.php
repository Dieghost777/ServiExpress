<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Establece la conexión con la base de datos
    $servername = "127.0.0.1:3308";
    $username = "root";
    $password = "admin";
    $dbname = "bddserviexpress";
    
    // Crea la conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Obtén los valores actualizados del formulario
    $idServicio = $_POST['idServicio'];
    $descripcion = $_POST['descripcion'];
    $precio = $_POST['precio'];
    $tiempoEstimado = $_POST['tiempoEstimado'];

    // Actualizar el servicio en la base de datos
    $sql = "UPDATE servicio SET Desc_serv = '$descripcion', Precio_serv = '$precio', Tiempo_estimado = '$tiempoEstimado' WHERE id_servicio = '$idServicio'";

    if ($conn->query($sql) === TRUE) {
        // Si la actualización fue exitosa, podrías devolver una respuesta o realizar otra acción si lo deseas
        echo "Servicio actualizado exitosamente";
    } else {
        echo "Error al actualizar el servicio: " . $conn->error;
    }

    // Cerrar la conexión
    $conn->close();
}
?>