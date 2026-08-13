<?php
require_once 'config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo 'Invalid bill ID.';
    exit;
}

$stmt = $conn->prepare("SELECT * FROM customer WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$bill = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$bill) {
    echo 'Bill not found.';
    exit;
}

$units = (float)$bill['units'];
$remaining = $units;
$breakdown = [];
$amount = 0.0;
$rates_data = getRates($conn);

foreach ($rates_data as $slab) {
    $limit = $slab['max_units'] - $slab['min_units'] + 1;
    if ($remaining <= 0) break;
    $consume = min($remaining, $limit);
    $cost = $consume * (float)$slab['rate'];
    $breakdown[] = [
        'label' => $slab['label'],
        'units' => $consume,
        'rate'  => (float)$slab['rate'],
        'cost'  => round($cost, 2),
    ];
    $amount += $cost;
    $remaining -= $consume;
}

$total = round($amount, 2);
$avg_rate = $units > 0 ? round($total / $units, 2) : 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #<?= $id ?> - ElectraBill</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <script>document.body?'body':(document.documentElement.className=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))</script>
    <style>
        .invoice-page {
            max-width: 720px;
            margin: 0 auto;
            padding: 40px 24px 60px;
        }
        .invoice-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 10px;
            overflow: hidden;
        }
        .invoice-head {
            padding: 32px 32px 24px;
            border-bottom: 2px solid var(--accent);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 16px;
        }
        .invoice-head h1 {
            font-size: 24px;
            font-weight: 800;
            color: var(--text-primary);
        }
        .invoice-head h1 span {
            color: var(--accent);
        }
        .invoice-head .inv-meta {
            text-align: right;
            font-size: 13px;
            color: var(--text-muted);
            line-height: 1.7;
        }
        .invoice-head .inv-meta strong {
            color: var(--text-primary);
        }
        .invoice-body {
            padding: 24px 32px;
        }
        .inv-customer {
            margin-bottom: 24px;
        }
        .inv-customer h3 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .inv-customer p {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
        .inv-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        .inv-table th {
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
            color: var(--text-secondary);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--border);
            background: var(--data-table-head);
        }
        .inv-table td {
            padding: 10px 12px;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--data-table-row-border);
        }
        .inv-table td:last-child,
        .inv-table th:last-child {
            text-align: right;
        }
        .inv-table .inv-total td {
            font-weight: 700;
            color: var(--text-primary);
            font-size: 16px;
            border-top: 2px solid var(--accent);
            border-bottom: none;
            padding-top: 14px;
        }
        .inv-table .inv-total td:last-child {
            color: var(--accent);
            font-size: 22px;
        }
        .inv-footer {
            padding: 16px 32px 24px;
            text-align: center;
            font-size: 12px;
            color: var(--text-faint);
            border-top: 1px solid var(--border);
        }
        .inv-actions {
            text-align: center;
            margin-top: 24px;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .no-print {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 24px;
        }
        @media print {
            .navbar, footer, .no-print, #themeToggle {
                display: none !important;
            }
            body {
                background: #fff !important;
                color: #000 !important;
            }
            .invoice-page {
                padding: 0;
            }
            .invoice-card {
                border: none;
                border-radius: 0;
            }
            .inv-actions, .no-print { display: none !important; }
            .inv-table .inv-total td:last-child { color: #000; }
            .inv-table th { background: #f5f5f5; }
            .invoice-head { border-bottom-color: #000; }
            .inv-table .inv-total td { border-top-color: #000; }
        }
    </style>
</head>
<body>

<nav class="navbar">
    <div class="container nav-inner">
        <a href="index.html" class="nav-brand"><i class="fa-solid fa-bolt"></i> ElectraBill</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="calculate.php">Calculator</a>
            <a href="stats.php">Statistics</a>
            <a href="admin/rates.php" style="font-size:16px;padding:7px 10px;" title="Admin"><i class="fa-solid fa-gear"></i></a>
            <button id="themeToggle" title="Toggle theme"><i class="fa-solid fa-moon"></i></button>
        </div>
    </div>
</nav>

<div class="invoice-page">
    <div class="invoice-card">
        <div class="invoice-head">
            <div>
                <h1><span>Electra</span>Bill</h1>
                <p style="font-size:13px;color:var(--text-muted);margin-top:2px;">Electricity Bill Invoice</p>
            </div>
            <div class="inv-meta">
                <strong>Invoice #<?= $id ?></strong><br>
                Period: <?= date('F Y', strtotime($bill['billed_at'])) ?><br>
                Issued: <?= date('d M Y') ?>
            </div>
        </div>
        <div class="invoice-body">
            <div class="inv-customer">
                <h3>Billed To</h3>
                <p><?= htmlspecialchars($bill['name']) ?></p>
            </div>

            <table class="inv-table">
                <thead>
                    <tr>
                        <th>Slab</th>
                        <th>Units</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($breakdown as $b): ?>
                        <tr>
                            <td><?= htmlspecialchars($b['label']) ?></td>
                            <td><?= number_format($b['units']) ?></td>
                            <td>Rs. <?= number_format($b['rate'], 2) ?></td>
                            <td>Rs. <?= number_format($b['cost'], 2) ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <tr>
                        <td colspan="3" style="text-align:right;font-weight:500;">Total Units</td>
                        <td style="text-align:right;font-weight:600;"><?= number_format($units) ?></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align:right;font-weight:500;">Avg. Rate / Unit</td>
                        <td style="text-align:right;font-weight:600;">Rs. <?= number_format($avg_rate, 2) ?></td>
                    </tr>
                    <tr class="inv-total">
                        <td colspan="3">Total Amount</td>
                        <td>Rs. <?= number_format($total, 2) ?></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="inv-footer">
            <p>Thank you for using ElectraBill &bull; This is a computer-generated invoice</p>
        </div>
    </div>

    <div class="no-print">
        <button onclick="window.print()" class="btn btn-primary"><i class="fa-solid fa-download"></i> Download PDF</button>
        <a href="calculate.php" class="btn btn-outline"><i class="fa-solid fa-arrow-left"></i> Back to Calculator</a>
        <a href="stats.php" class="btn btn-outline"><i class="fa-solid fa-chart-bar"></i> Statistics</a>
    </div>
</div>

<script src="dark.js"></script>
<footer>
    <div class="container">
        <p>&copy; 2025 ElectraBill. All rights reserved.</p>
    </div>
</footer>

</body>
</html>
<?php $conn->close(); ?>
