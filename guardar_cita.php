<?php
include 'db_config_pg.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $celular = $_POST['celular'];
    $servicio = $_POST['servicio'];
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];

    try {
        $sql_check = "SELECT id FROM citas WHERE fecha = ? AND hora = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->execute([$fecha, $hora]);

        if ($stmt_check->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Ya existe una cita en esa fecha y hora. Elige otro horario.']);
        } else {
            $sql_insert = "INSERT INTO citas (nombre, correo, celular, servicio, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_insert = $conn->prepare($sql_insert);
            
            if ($stmt_insert->execute([$nombre, $correo, $celular, $servicio, $fecha, $hora])) {
                echo json_encode(['success' => true, 'message' => '¡Cita agendada con éxito!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar la cita.']);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método de solicitud no válido.']);
}
?>