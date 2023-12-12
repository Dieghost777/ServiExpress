<?php
// Verificar si el usuario es un administrador (aquí es donde verificarías la lógica específica)
session_start(); // Iniciar la sesión si no está iniciada
if (isset($_GET['cerrar_sesion'])) {
    $_SESSION = array();
    session_destroy();

    header('Content-Type: application/json');
    echo json_encode(array('success' => true, 'message' => 'Sesión cerrada correctamente'));
    exit();
}
?>
