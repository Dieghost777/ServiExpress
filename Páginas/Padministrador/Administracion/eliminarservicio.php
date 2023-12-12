<?php
// Verificar si se ha recibido un ID de servicio
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['idServicio'])) {
    // Obtener el ID del servicio enviado desde la solicitud
    $idServicio = $_POST['idServicio'];

    // Aquí puedes realizar la lógica para eliminar el servicio con el ID proporcionado
    // Por ejemplo, ejecutar una consulta DELETE en tu base de datos

    // Supongamos que tienes una conexión a tu base de datos
    $server = "127.0.0.1:3308";
    $user = "root";
    $pass = "admin";
    $db = "bddserviexpress";

    // Crear conexión
    $conn = new mysqli($server, $user, $pass, $db);

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Ejemplo de consulta para eliminar el servicio
    $sql = "DELETE FROM servicio WHERE id_servicio = $idServicio";

    if ($conn->query($sql) === TRUE) {
        // Si la eliminación fue exitosa, podrías devolver una respuesta al cliente
        echo json_encode(array("message" => "El servicio ha sido eliminado exitosamente"));
    } else {
        // Si ocurre algún error durante la eliminación
        echo json_encode(array("message" => "Error al intentar eliminar el servicio: " . $conn->error));
    }

    $conn->close(); // Cerrar la conexión
} else {
    // Si no se proporciona un ID de servicio válido en la solicitud
    echo json_encode(array("message" => "ID de servicio no válido"));
}
?>
