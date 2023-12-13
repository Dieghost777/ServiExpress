<?php
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

// Consulta para obtener los servicios
$query = "SELECT id_servicio, Desc_serv, Precio_serv, Tiempo_estimado FROM servicio";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td class='id-servicio'>" . $row['id_servicio'] . "</td>";
        echo "<td class='descripcion-servicio'>" . $row['Desc_serv'] . "</td>";
        echo "<td class='precio-servicio'>" . $row['Precio_serv'] . "</td>";
        echo "<td class='tiempo-estimado'>" . $row['Tiempo_estimado'] . "</td>";
        echo "<td>";
        echo "<button class='editar-btn-servicio' data-id='" . $row['id_servicio'] . "'>Editar</button>";
        echo "</td>";
        echo "</tr>";
    }
} else {
    echo "0 resultados";
}
$conn->close();
?>