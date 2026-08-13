<?php
require_once 'config.php';

$from = isset($_GET['from']) ? $_GET['from'] : '';
$to   = isset($_GET['to'])   ? $_GET['to']   : '';

$where = '';
$params = [];
if ($from) {
    $where .= " AND billed_at >= ?";
    $params[] = $from;
}
if ($to) {
    $where .= " AND billed_at <= ?";
    $params[] = $to . ' 23:59:59';
}

function runQuery($conn, $sql, $params) {
    if (empty($params)) return $conn->query($sql);
    $stmt = $conn->prepare($sql);
    $types = str_repeat('s', count($params));
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    return $stmt->get_result();
}

$data = runQuery($conn, "
    SELECT id, name, units, bill,
           DATE_FORMAT(billed_at, '%Y-%m-%d') AS billed_date
    FROM customer WHERE 1=1 $where
    ORDER BY billed_at DESC
", $params);

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="electrabill_export.csv"');

$out = fopen('php://output', 'w');
fputcsv($out, ['Bill ID', 'Customer Name', 'Units Consumed', 'Total Amount', 'Date']);

if ($data && $data->num_rows > 0) {
    while ($row = $data->fetch_assoc()) {
        fputcsv($out, [
            $row['id'],
            $row['name'],
            $row['units'],
            number_format($row['bill'], 2),
            $row['billed_date'],
        ]);
    }
}

fclose($out);
$conn->close();
