<?php
$host = "localhost";
$port = "5432";
$dbname = "barbershop_db";
$user = "postgres"; 
$password = "sergio123";

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

try {
    $conn = new PDO($dsn, $user, $password);
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    header('Content-Type: application/json');
    die(json_encode(['success' => false, 'message' => "❌ Error de Conexión a PostgreSQL: " . $e->getMessage()]));
}
?>