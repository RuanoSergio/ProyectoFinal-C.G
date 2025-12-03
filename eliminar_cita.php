<?php
include 'db_config_pg.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id'])) {
    $id = $_POST['id'];

    try {
        $sql = "DELETE FROM citas WHERE id = ?";
        $stmt = $conn->prepare($sql);
        
        if ($stmt->execute([$id])) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Cita eliminada con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'No se encontró la cita para eliminar.']);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID de cita no proporcionado.']);
}
?>