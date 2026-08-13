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

$monthly = runQuery($conn, "
    SELECT DATE_FORMAT(billed_at, '%Y-%m') AS period,
           COUNT(*) AS total_bills,
           SUM(units) AS total_units,
           SUM(bill) AS total_amount,
           ROUND(AVG(bill), 2) AS avg_bill
    FROM customer WHERE 1=1 $where
    GROUP BY period ORDER BY period ASC
", $params);

$yearly = runQuery($conn, "
    SELECT DATE_FORMAT(billed_at, '%Y') AS period,
           COUNT(*) AS total_bills,
           SUM(units) AS total_units,
           SUM(bill) AS total_amount,
           ROUND(AVG(bill), 2) AS avg_bill
    FROM customer WHERE 1=1 $where
    GROUP BY period ORDER BY period ASC
", $params);

$totals = runQuery($conn, "
    SELECT COUNT(*) AS total_bills,
           COALESCE(SUM(units), 0) AS total_units,
           COALESCE(SUM(bill), 0) AS total_amount,
           ROUND(COALESCE(AVG(bill), 0), 2) AS avg_bill
    FROM customer WHERE 1=1 $where
", $params)->fetch_assoc();

$recent = runQuery($conn, "
    SELECT id, name, units, bill, billed_at FROM customer WHERE 1=1 $where
    ORDER BY billed_at DESC LIMIT 20
", $params);

// Build monthly arrays for charts + MoM + peak
$months_arr = [];
$bills_arr = [];
$units_arr = [];
$mom_changes = [];
$peak_amount = 0;
$prev_amount = null;

if ($monthly && $monthly->num_rows > 0) {
    while ($row = $monthly->fetch_assoc()) {
        $months_arr[] = $row;
        $bills_arr[] = (float)$row['total_amount'];
        $units_arr[] = (int)$row['total_units'];

        $amount = (float)$row['total_amount'];
        if ($amount > $peak_amount) $peak_amount = $amount;

        if ($prev_amount !== null && $prev_amount > 0) {
            $change = round((($amount - $prev_amount) / $prev_amount) * 100, 1);
        } else {
            $change = null;
        }
        $mom_changes[] = $change;
        $prev_amount = $amount;
    }
    $monthly->data_seek(0);
}

$months_json = json_encode($months_arr ? array_column($months_arr, 'period') : []);
$monthly_bills_json = json_encode($bills_arr);
$monthly_units_json = json_encode($units_arr);

$years_arr = [];
$ybills_arr = [];
$yunits_arr = [];
if ($yearly && $yearly->num_rows > 0) {
    while ($row = $yearly->fetch_assoc()) {
        $years_arr[] = $row['period'];
        $ybills_arr[] = (float)$row['total_amount'];
        $yunits_arr[] = (int)$row['total_units'];
    }
    $yearly->data_seek(0);
}

$years_json = json_encode($years_arr);
$yearly_bills_json = json_encode($ybills_arr);
$yearly_units_json = json_encode($yunits_arr);

$csv_url = 'csv.php?' . http_build_query(array_filter(['from' => $from, 'to' => $to]));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statistics - ElectraBill</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <script>document.body?'body':(document.documentElement.className=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))</script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts@4.5.0/dist/apexcharts.min.js"></script>
</head>
<body>

<nav class="navbar">
    <div class="container nav-inner">
        <a href="index.html" class="nav-brand"><i class="fa-solid fa-bolt"></i> ElectraBill</a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="calculate.php">Calculator</a>
            <a href="stats.php" class="active">Statistics</a>
            <button id="themeToggle" title="Toggle theme"><i class="fa-solid fa-moon"></i></button>
            <a href="admin/rates.php" style="font-size:16px;padding:7px 10px;" title="Admin"><i class="fa-solid fa-gear"></i></a>
        </div>
    </div>
</nav>

<div class="stats-page">
    <div class="container">
        <div class="stats-header">
            <h1>Billing Statistics</h1>
            <p>Monthly and yearly breakdown of all recorded bills</p>
        </div>

        <form method="GET" class="filter-bar" style="display:flex;gap:12px;align-items:end;flex-wrap:wrap;margin-bottom:24px;justify-content:center;">
            <div>
                <label style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:4px;">From</label>
                <input type="date" name="from" value="<?= htmlspecialchars($from) ?>" class="admin-input" style="width:160px;text-align:left;">
            </div>
            <div>
                <label style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:4px;">To</label>
                <input type="date" name="to" value="<?= htmlspecialchars($to) ?>" class="admin-input" style="width:160px;text-align:left;">
            </div>
            <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-filter"></i> Filter</button>
            <?php if ($from || $to): ?>
                <a href="stats.php" class="btn btn-outline btn-sm"><i class="fa-solid fa-xmark"></i> Clear</a>
            <?php endif; ?>
            <a href="<?= $csv_url ?>" class="btn btn-outline btn-sm"><i class="fa-solid fa-download"></i> Export CSV</a>
        </form>

        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-icon"><i class="fa-solid fa-file-invoice"></i></div>
                <div class="summary-detail">
                    <span class="summary-label">Total Bills</span>
                    <span class="summary-value"><?= $totals['total_bills'] ?></span>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fa-solid fa-gauge-high"></i></div>
                <div class="summary-detail">
                    <span class="summary-label">Total Units</span>
                    <span class="summary-value"><?= number_format($totals['total_units']) ?></span>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fa-solid fa-rupee-sign"></i></div>
                <div class="summary-detail">
                    <span class="summary-label">Total Revenue</span>
                    <span class="summary-value">Rs. <?= number_format($totals['total_amount'], 2) ?></span>
                </div>
            </div>
            <div class="summary-card">
                <div class="summary-icon"><i class="fa-solid fa-chart-line"></i></div>
                <div class="summary-detail">
                    <span class="summary-label">Avg Bill</span>
                    <span class="summary-value">Rs. <?= number_format($totals['avg_bill'], 2) ?></span>
                </div>
            </div>
        </div>

        <?php if ($monthly && $monthly->num_rows > 0): ?>

        <div class="chart-row">
            <div class="chart-card">
                <h3><i class="fa-solid fa-chart-line"></i> Monthly Billing Trend</h3>
                <div class="chart-wrap">
                    <div id="monthlyChart"></div>
                </div>
            </div>
            <div class="chart-card">
                <h3><i class="fa-solid fa-chart-line"></i> Monthly Units Trend</h3>
                <div class="chart-wrap">
                    <div id="monthlyUnitsChart"></div>
                </div>
            </div>
        </div>

        <div class="chart-row">
            <div class="chart-card full">
                <h3><i class="fa-solid fa-calendar-year"></i> Yearly Overview</h3>
                <div class="chart-wrap">
                    <div id="yearlyChart"></div>
                </div>
            </div>
        </div>

        <div class="table-section">
            <div class="table-card">
                <h3><i class="fa-solid fa-table"></i> Monthly Breakdown</h3>
                <div class="table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Bills</th>
                                <th>Units</th>
                                <th>Amount</th>
                                <th>Avg</th>
                                <th>MoM Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $idx = 0; while ($row = $monthly->fetch_assoc()):
                                $is_peak = (float)$row['total_amount'] >= $peak_amount && $peak_amount > 0;
                            ?>
                                <tr class="<?= $is_peak ? 'peak-row' : '' ?>" title="<?= $is_peak ? 'Highest billing month' : '' ?>">
                                    <td><?= htmlspecialchars($row['period']) ?><?= $is_peak ? ' <i class="fa-solid fa-crown" style="color:#f59e0b;font-size:12px;"></i>' : '' ?></td>
                                    <td><?= $row['total_bills'] ?></td>
                                    <td><?= number_format($row['total_units']) ?></td>
                                    <td>Rs. <?= number_format($row['total_amount'], 2) ?></td>
                                    <td>Rs. <?= number_format($row['avg_bill'], 2) ?></td>
                                    <td>
                                        <?php $ch = $mom_changes[$idx] ?? null; ?>
                                        <?php if ($ch !== null): ?>
                                            <span style="color:<?= $ch >= 0 ? '#22c55e' : '#ef4444' ?>;">
                                                <i class="fa-solid fa-<?= $ch >= 0 ? 'arrow-up' : 'arrow-down' ?>"></i>
                                                <?= abs($ch) ?>%
                                            </span>
                                        <?php else: ?>
                                            <span style="color:var(--text-faint);">--</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php $idx++; endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-card">
                <h3><i class="fa-solid fa-table"></i> Yearly Breakdown</h3>
                <div class="table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Bills</th>
                                <th>Total Units</th>
                                <th>Total Amount</th>
                                <th>Avg Bill</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($row = $yearly->fetch_assoc()): ?>
                                <tr>
                                    <td><?= htmlspecialchars($row['period']) ?></td>
                                    <td><?= $row['total_bills'] ?></td>
                                    <td><?= number_format($row['total_units']) ?></td>
                                    <td>Rs. <?= number_format($row['total_amount'], 2) ?></td>
                                    <td>Rs. <?= number_format($row['avg_bill'], 2) ?></td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="table-card" style="grid-column:1/-1;">
            <h3><i class="fa-solid fa-receipt"></i> Recent Bills</h3>
            <div class="table-wrap">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Units</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th style="width:80px;">Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($recent && $recent->num_rows > 0): while ($r = $recent->fetch_assoc()): ?>
                            <tr>
                                <td>#<?= $r['id'] ?></td>
                                <td><?= htmlspecialchars($r['name']) ?></td>
                                <td><?= number_format($r['units']) ?></td>
                                <td>Rs. <?= number_format($r['bill'], 2) ?></td>
                                <td><?= date('d M Y', strtotime($r['billed_at'])) ?></td>
                                <td><a href="invoice.php?id=<?= $r['id'] ?>" target="_blank" class="btn btn-outline btn-sm"><i class="fa-solid fa-file-pdf"></i></a></td>
                            </tr>
                        <?php endwhile; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <?php else: ?>

        <div class="empty-state">
            <i class="fa-solid fa-chart-pie"></i>
            <h3>No data yet</h3>
            <p>Start by calculating a bill — statistics will appear here.</p>
            <a href="calculate.php" class="btn btn-primary"><i class="fa-solid fa-calculator"></i> Calculate a Bill</a>
        </div>

        <?php endif; ?>
    </div>
</div>

<script src="dark.js"></script>
<footer>
    <div class="container">
        <p>&copy; 2025 ElectraBill. All rights reserved.</p>
    </div>
</footer>

<script>
<?php if ($monthly && $monthly->num_rows > 0): ?>
var months = <?= $months_json ?>;
var billsData = <?= $monthly_bills_json ?>;
var unitsData = <?= $monthly_units_json ?>;
var years = <?= $years_json ?>;
var yearlyBills = <?= $yearly_bills_json ?>;
var yearlyUnits = <?= $yearly_units_json ?>;

var isDark = document.body.classList.contains('dark');
var gridColor = isDark ? '#2d2d4a' : '#e4e0f0';
var labelColor = isDark ? '#a5a0c0' : '#7c7596';

var baseOpts = {
    chart: {
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        animations: { enabled: true, easing: 'easeinout', speed: 800, dynamicAnimation: { speed: 600 } },
        sparkline: { enabled: false },
        foreColor: labelColor
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    grid: { borderColor: gridColor, strokeDashArray: 4, padding: { top: 0, right: 4, bottom: 0, left: 4 } },
    tooltip: { enabled: true, theme: isDark ? 'dark' : 'light', style: { fontFamily: 'Inter, sans-serif', fontSize: '13px' } },
    legend: { show: false },
    fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] }
    }
};

new ApexCharts(document.getElementById('monthlyChart'), {
    ...baseOpts,
    series: [{ name: 'Total Amount', data: billsData }],
    colors: ['#6366f1'],
    chart: { ...baseOpts.chart, type: 'area', height: 260 },
    yaxis: {
        labels: {
            formatter: function (v) { return 'Rs. ' + Number(v).toLocaleString(); },
            style: { fontFamily: 'Inter, sans-serif', fontSize: '12px', colors: [labelColor] }
        },
        axisBorder: { show: false }
    },
    xaxis: {
        categories: months,
        labels: { style: { fontFamily: 'Inter, sans-serif', fontSize: '11px', colors: [labelColor] } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    }
}).render();

new ApexCharts(document.getElementById('monthlyUnitsChart'), {
    ...baseOpts,
    series: [{ name: 'Units', data: unitsData }],
    colors: ['#22c55e'],
    chart: { ...baseOpts.chart, type: 'area', height: 260 },
    yaxis: {
        labels: { formatter: function (v) { return Number(v).toLocaleString(); }, style: { fontFamily: 'Inter, sans-serif', fontSize: '12px', colors: [labelColor] } },
        axisBorder: { show: false }
    },
    xaxis: {
        categories: months,
        labels: { style: { fontFamily: 'Inter, sans-serif', fontSize: '11px', colors: [labelColor] } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    }
}).render();

new ApexCharts(document.getElementById('yearlyChart'), {
    ...baseOpts,
    series: [
        { name: 'Total Amount (Rs.)', data: yearlyBills },
        { name: 'Total Units', data: yearlyUnits }
    ],
    colors: ['#6366f1', '#f59e0b'],
    chart: { ...baseOpts.chart, type: 'area', height: 280 },
    legend: { show: true, position: 'top', fontFamily: 'Inter, sans-serif', fontSize: '13px', labels: { colors: [labelColor] }, markers: { width: 10, height: 10, radius: 4 } },
    yaxis: [
        {
            labels: { formatter: function (v) { return 'Rs. ' + Number(v).toLocaleString(); }, style: { fontFamily: 'Inter, sans-serif', fontSize: '12px', colors: [labelColor] } },
            axisBorder: { show: false }
        },
        {
            opposite: true,
            labels: { formatter: function (v) { return Number(v).toLocaleString(); }, style: { fontFamily: 'Inter, sans-serif', fontSize: '12px', colors: [labelColor] } },
            axisBorder: { show: false }
        }
    ],
    xaxis: {
        categories: years,
        labels: { style: { fontFamily: 'Inter, sans-serif', fontSize: '12px', colors: [labelColor] } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    stroke: { curve: 'smooth', width: [3, 3], dashArray: [0, 4] },
    fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: [0.35, 0.2], opacityTo: [0.05, 0.02], stops: [0, 100] }
    }
}).render();
<?php endif; ?>
</script>

</body>
</html>
<?php $conn->close(); ?>
