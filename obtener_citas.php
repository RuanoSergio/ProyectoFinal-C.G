<?php
include 'db_config_pg.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT id, nombre, correo, celular, servicio, fecha, hora FROM citas WHERE 1=1";
    $params = [];

    if (isset($_GET['nombre']) && !empty($_GET['nombre'])) {
        $sql .= " AND nombre ILIKE ?"; 
        $params[] = '%' . $_GET['nombre'] . '%'; 
    }

    if (isset($_GET['celular']) && !empty($_GET['celular'])) {
        $sql .= " AND celular = ?";
        $params[] = $_GET['celular'];
    }

    $sql .= " ORDER BY fecha ASC, hora ASC";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($citas);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al cargar las citas: ' . $e->getMessage()]);
}
?>