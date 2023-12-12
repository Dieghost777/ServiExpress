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

// Obtener datos de la boleta
$query = "SELECT b.id_boleta as 'ID BOLETA', CONCAT(C.nombre_cli, ' ', C.appaterno_cli) AS 'NOMBRE CLIENTE', B.fecha_emision AS 'FECHA EMISION', B.monto AS 'MONTO'
          FROM boleta B
          INNER JOIN cliente C ON C.id_cliente = B.Cliente_id_cliente";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    // Iterar sobre los resultados para mostrarlos
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td class='id-boleta' contenteditable='true'>" . $row['ID BOLETA'] . "</td>";
        echo "<td class='nombre-cliente' contenteditable='true'>" . $row['NOMBRE CLIENTE'] . "</td>";
        echo "<td class='fecha-emision' contenteditable='true'>" . $row['FECHA EMISION'] . "</td>";
        echo "<td class='monto' contenteditable='true'>" . $row['MONTO'] . "</td>";
        echo "<td><button class='editar-btn'>Editar</button></td>";
        echo "</tr>";
    }
} else {
    echo "0 resultados";
}

$conn->close();
?>
