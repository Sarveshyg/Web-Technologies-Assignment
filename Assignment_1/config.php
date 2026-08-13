<?php
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "electricity_billing_cs50";

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->query("CREATE DATABASE IF NOT EXISTS $dbname");
$conn->select_db($dbname);

$conn->query("CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    units INT,
    bill DECIMAL(10,2)
)");

$result = $conn->query("SHOW COLUMNS FROM customer LIKE 'billed_at'");
if ($result->num_rows === 0) {
    $conn->query("ALTER TABLE customer ADD COLUMN billed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
}

$conn->query("CREATE TABLE IF NOT EXISTS rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    min_units INT NOT NULL,
    max_units INT NOT NULL,
    rate DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$check = $conn->query("SELECT COUNT(*) AS cnt FROM rates")->fetch_assoc();
if ((int)$check['cnt'] === 0) {
    $conn->query("INSERT INTO rates (label, min_units, max_units, rate) VALUES
        ('1 - 50 Units', 1, 50, 3.50),
        ('51 - 150 Units', 51, 150, 4.00),
        ('151 - 250 Units', 151, 250, 5.20),
        ('Above 250 Units', 251, 999999, 6.50)
    ");
}

function getRates($conn) {
    $result = $conn->query("SELECT * FROM rates ORDER BY min_units ASC");
    if ($result && $result->num_rows > 0) {
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    return [
        ['label' => '1 - 50 Units',      'min_units' => 1,   'max_units' => 50,   'rate' => 3.50],
        ['label' => '51 - 150 Units',    'min_units' => 51,  'max_units' => 150,  'rate' => 4.00],
        ['label' => '151 - 250 Units',   'min_units' => 151, 'max_units' => 250,  'rate' => 5.20],
        ['label' => 'Above 250 Units',   'min_units' => 251, 'max_units' => 999999,'rate' => 6.50],
    ];
}
?>
