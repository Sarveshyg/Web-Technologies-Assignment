<?php
require_once 'config.php';

$result = null;
$breakdown = [];
$active_slab = null;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name  = trim($_POST['name']);
    $units = floatval($_POST['units']);
    $bill_month = isset($_POST['billing_month']) ? (int)$_POST['billing_month'] : (int)date('m');
    $bill_year  = isset($_POST['billing_year'])  ? (int)$_POST['billing_year']  : (int)date('Y');
    $billed_at  = sprintf('%04d-%02d-01 00:00:00', $bill_year, $bill_month);

    if ($units <= 0) {
        $result = ['error' => 'Please enter a valid number of units.'];
    } else {
        $amount = 0.0;
        $remaining = $units;
        $rates_data = getRates($conn);

        foreach ($rates_data as $i => $slab) {
            $limit = $slab['max_units'] - $slab['min_units'] + 1;
            if ($remaining <= 0) break;
            $consume = min($remaining, $limit);
            $cost = $consume * $slab['rate'];
            $breakdown[] = [
                'label' => $slab['label'],
                'units' => $consume,
                'rate'  => (float)$slab['rate'],
                'cost'  => round($cost, 2),
            ];
            $amount += $cost;
            $remaining -= $consume;
            if ($consume > 0) $active_slab = $i;
        }

        $rate = round($amount / $units, 2);
        $total = round($amount, 2);

        $stmt = $conn->prepare("INSERT INTO customer (name, units, bill, billed_at) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            $result = ['error' => 'Database error: ' . $conn->error];
        } else {
            $units_int = (int)$units;
            $stmt->bind_param("siss", $name, $units_int, $total, $billed_at);
            $stmt->execute();
            $stmt->close();

            $result = [
                'name'    => htmlspecialchars($name),
                'units'   => $units,
                'rate'    => $rate,
                'total'   => $total,
                'bill_id' => $conn->insert_id,
            ];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculate Bill - ElectraBill</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <script>document.body?'body':(document.documentElement.className=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))</script>
</head>
<body>

<nav class="navbar">
    <div class="container nav-inner">
        <a href="index.html" class="nav-brand"><i class="fa-solid fa-bolt"></i> ElectraBill</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="calculate.php" class="active">Calculator</a>
            <a href="stats.php">Statistics</a>
            <button id="themeToggle" title="Toggle theme"><i class="fa-solid fa-moon"></i></button>
            <a href="admin/rates.php" style="font-size:16px;padding:7px 10px;" title="Admin"><i class="fa-solid fa-gear"></i></a>
        </div>
    </div>
</nav>

<div class="calc-page">
    <div class="container">
        <div class="calc-header">
            <h1>Electricity Bill Calculator</h1>
            <p>Enter your consumption details to calculate the bill</p>
        </div>

        <div class="calc-layout">
            <div class="form-card">
                <h2><i class="fa-solid fa-pen-to-square"></i> Enter Details</h2>
                <form method="POST" action="calculate.php">
                    <div class="form-group">
                        <label for="name">Customer Name</label>
                        <input type="text" id="name" name="name" placeholder="e.g. John Doe" required
                               value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
                    </div>
                    <div class="form-group">
                        <label for="units">Units Consumed (kWh)</label>
                        <input type="number" id="units" name="units" placeholder="e.g. 180" min="1" step="0.01" required
                               value="<?= htmlspecialchars($_POST['units'] ?? '') ?>">
                    </div>

                    <div class="form-group">
                        <label>Billing Period</label>
                        <div style="display:flex;gap:10px;">
                            <select name="billing_month" class="form-select" style="flex:1;">
                                <?php for ($m = 1; $m <= 12; $m++):
                                    $sel = ((int)($_POST['billing_month'] ?? date('m')) === $m) ? 'selected' : '';
                                ?>
                                    <option value="<?= $m ?>" <?= $sel ?>><?= date('F', mktime(0,0,0,$m,1)) ?></option>
                                <?php endfor; ?>
                            </select>
                            <select name="billing_year" class="form-select" style="flex:1;">
                                <?php $cur = (int)date('Y');
                                for ($y = $cur - 5; $y <= $cur; $y++):
                                    $sel = ((int)($_POST['billing_year'] ?? $cur) === $y) ? 'selected' : '';
                                ?>
                                    <option value="<?= $y ?>" <?= $sel ?>><?= $y ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block"><i class="fa-solid fa-calculator"></i> Calculate Bill</button>
                </form>

                <?php if ($result): ?>
                    <div class="result-card <?= isset($result['error']) ? 'result-error' : 'result-success' ?>">
                        <div class="result-header">
                            <?php if (isset($result['error'])): ?>
                                <h3><i class="fa-solid fa-circle-exclamation"></i> Error</h3>
                            <?php else: ?>
                                <h3><i class="fa-solid fa-circle-check"></i> Bill Generated</h3>
                            <?php endif; ?>
                        </div>
                        <div class="result-body">
                            <?php if (isset($result['error'])): ?>
                                <p class="error-text"><?= $result['error'] ?></p>
                            <?php else: ?>
                                <table class="result-table">
                                    <tr>
                                        <td>Customer Name</td>
                                        <td class="td-value"><?= $result['name'] ?></td>
                                    </tr>
                                    <tr>
                                        <td>Units Consumed</td>
                                        <td class="td-value"><?= $result['units'] ?> kWh</td>
                                    </tr>
                                    <tr>
                                        <td>Avg. Rate / Unit</td>
                                        <td class="td-value">Rs. <?= $result['rate'] ?></td>
                                    </tr>
                                    <tr>
                                        <td>Bill ID</td>
                                        <td class="td-value">#<?= $result['bill_id'] ?></td>
                                    </tr>
                                    <tr class="total-row">
                                        <td><strong>Total Amount</strong></td>
                                        <td class="td-value"><strong>Rs. <?= number_format($result['total'], 2) ?></strong></td>
                                    </tr>
                                </table>
                            <?php endif; ?>
                        </div>
                        <div class="result-footer">
                            <a href="invoice.php?id=<?= $result['bill_id'] ?>" class="btn btn-primary" target="_blank"><i class="fa-solid fa-file-pdf"></i> Download PDF</a>
                            <a href="calculate.php" class="btn btn-outline"><i class="fa-solid fa-rotate"></i> Calculate Again</a>
                            <a href="index.html" class="btn btn-outline"><i class="fa-solid fa-house"></i> Home</a>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <div class="sidebar">
                <div class="sidebar-card">
                    <h3><i class="fa-solid fa-table-list"></i> Tariff Slabs</h3>
                    <div class="slab-list">
                        <?php
                        $rates_data = getRates($conn);
                        foreach ($rates_data as $i => $slab):
                            $active = (isset($active_slab) && $active_slab === $i) ? ' slab-active' : '';
                        ?>
                            <div class="slab-item<?= $active ?>">
                                <span><?= htmlspecialchars($slab['label']) ?></span>
                                <span class="slab-rate">Rs. <?= number_format($slab['rate'], 2) ?>/unit</span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <?php if ($breakdown): ?>
                    <div class="sidebar-card">
                        <h3><i class="fa-solid fa-chart-simple"></i> Slab-wise Breakdown</h3>
                        <div class="slab-list">
                            <?php foreach ($breakdown as $b): ?>
                                <div class="slab-item slab-breakdown">
                                    <span><?= $b['label'] ?> (<?= $b['units'] ?> &times; Rs. <?= $b['rate'] ?>)</span>
                                    <span class="slab-rate">Rs. <?= number_format($b['cost'], 2) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
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
