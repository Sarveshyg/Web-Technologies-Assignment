<?php
require_once __DIR__ . '/../config.php';
session_start();

$admin_pass = 'admin123';
$msg = null;

if (isset($_POST['login'])) {
    if ($_POST['password'] === $admin_pass) {
        $_SESSION['admin_auth'] = true;
    } else {
        $msg = ['type' => 'error', 'text' => 'Incorrect password.'];
    }
}

if (isset($_GET['logout'])) {
    unset($_SESSION['admin_auth']);
    header('Location: rates.php');
    exit;
}

if (!empty($_SESSION['admin_auth'])) {
    if (isset($_POST['save_rates'])) {
        foreach ($_POST['rate'] as $id => $data) {
            $label = trim($conn->real_escape_string($data['label']));
            $min   = (int)$data['min'];
            $max   = (int)$data['max'];
            $rate  = (float)$data['rate'];

            if ($min <= 0 || $max <= 0 || $min >= $max || $rate <= 0) {
                $msg = ['type' => 'error', 'text' => 'Invalid values for slab "' . htmlspecialchars($label) . '".'];
                break;
            }

            $overlap = $conn->query("SELECT id FROM rates WHERE id != $id AND ((min_units <= $min AND max_units >= $min) OR (min_units <= $max AND max_units >= $max))");
            if ($overlap && $overlap->num_rows > 0) {
                $msg = ['type' => 'error', 'text' => 'Slab "' . htmlspecialchars($label) . '" overlaps with an existing slab.'];
                break;
            }

            $conn->query("UPDATE rates SET label='$label', min_units=$min, max_units=$max, rate=$rate WHERE id=$id");
            $msg = ['type' => 'success', 'text' => 'Rates updated successfully.'];
        }
    }

    if (isset($_POST['add_slab'])) {
        $label = trim($conn->real_escape_string($_POST['new_label']));
        $min   = (int)$_POST['new_min'];
        $max   = (int)$_POST['new_max'];
        $rate  = (float)$_POST['new_rate'];

        if ($label === '' || $min <= 0 || $max <= 0 || $min >= $max || $rate <= 0) {
            $msg = ['type' => 'error', 'text' => 'Please fill all fields with valid values.'];
        } elseif ($max > 999999) {
            $msg = ['type' => 'error', 'text' => 'Max units cannot exceed 999,999.'];
        } else {
            $overlap = $conn->query("SELECT id FROM rates WHERE (min_units <= $min AND max_units >= $min) OR (min_units <= $max AND max_units >= $max)");
            if ($overlap && $overlap->num_rows > 0) {
                $msg = ['type' => 'error', 'text' => 'New slab overlaps with an existing slab.'];
            } else {
                $stmt = $conn->prepare("INSERT INTO rates (label, min_units, max_units, rate) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("sidd", $label, $min, $max, $rate);
                $stmt->execute();
                $stmt->close();
                $msg = ['type' => 'success', 'text' => 'New slab added.'];
            }
        }
    }

    if (isset($_GET['delete'])) {
        $id = (int)$_GET['delete'];
        $conn->query("DELETE FROM rates WHERE id=$id");
        $msg = ['type' => 'success', 'text' => 'Slab deleted.'];
        header('Location: rates.php');
        exit;
    }

    $rates = $conn->query("SELECT * FROM rates ORDER BY min_units ASC");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Rates - ElectraBill</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    <script>document.body?'body':(document.documentElement.className=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))</script>
</head>
<body>

<nav class="navbar">
    <div class="container nav-inner">
        <a href="../index.html" class="nav-brand"><i class="fa-solid fa-bolt"></i> ElectraBill</a>
        <div class="nav-links">
            <a href="../index.html">Home</a>
            <a href="../calculate.php">Calculator</a>
            <a href="../stats.php">Statistics</a>
            <button id="themeToggle" title="Toggle theme"><i class="fa-solid fa-moon"></i></button>
        </div>
    </div>
</nav>

<div class="admin-page">
    <div class="container">
        <div class="admin-header">
            <h1>Rate Management</h1>
            <p>Update electricity slab rates dynamically</p>
        </div>

        <div class="admin-card">
            <?php if (empty($_SESSION['admin_auth'])): ?>

                <h2><i class="fa-solid fa-lock"></i> Admin Login</h2>
                <?php if ($msg): ?>
                    <div class="admin-msg <?= $msg['type'] ?>"><?= htmlspecialchars($msg['text']) ?></div>
                <?php endif; ?>
                <form method="POST">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter admin password" required>
                    </div>
                    <button type="submit" name="login" class="btn btn-primary btn-block">Login</button>
                </form>
                <div class="admin-footer-links">
                    <a href="../index.html"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
                </div>

            <?php else: ?>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
                    <h2 style="margin:0;"><i class="fa-solid fa-table-list"></i> Current Slab Rates</h2>
                    <a href="?logout=1" class="btn btn-outline" style="font-size:13px;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                </div>

                <?php if ($msg): ?>
                    <div class="admin-msg <?= $msg['type'] ?>"><?= htmlspecialchars($msg['text']) ?></div>
                <?php endif; ?>

                <form method="POST">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Min Units</th>
                                <th>Max Units</th>
                                <th>Rate (Rs.)</th>
                                <th style="width:50px;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ($rates && $rates->num_rows > 0): while ($r = $rates->fetch_assoc()): ?>
                                <tr>
                                    <td><input type="text" name="rate[<?= $r['id'] ?>][label]" value="<?= htmlspecialchars($r['label']) ?>" class="admin-input" style="width:140px;text-align:left;"></td>
                                    <td><input type="number" name="rate[<?= $r['id'] ?>][min]" value="<?= $r['min_units'] ?>" class="admin-input"></td>
                                    <td><input type="number" name="rate[<?= $r['id'] ?>][max]" value="<?= $r['max_units'] ?>" class="admin-input"></td>
                                    <td><input type="number" name="rate[<?= $r['id'] ?>][rate]" value="<?= $r['rate'] ?>" class="admin-input" step="0.01"></td>
                                    <td><a href="?delete=<?= $r['id'] ?>" class="btn btn-outline btn-sm" onclick="return confirm('Delete this slab?');"><i class="fa-solid fa-trash-can"></i></a></td>
                                </tr>
                            <?php endwhile; endif; ?>
                        </tbody>
                    </table>
                    <div style="margin-top:16px;">
                        <button type="submit" name="save_rates" class="btn btn-primary btn-sm"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
                    </div>
                </form>

                <hr style="border:none;border-top:1px solid var(--border);margin:24px 0;">

                <h3 style="font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:16px;"><i class="fa-solid fa-plus"></i> Add New Slab</h3>
                <form method="POST" style="display:flex;flex-wrap:wrap;gap:10px;align-items:end;">
                    <div>
                        <label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">Label</label>
                        <input type="text" name="new_label" placeholder="e.g. 251 - 300 Units" class="admin-input" style="width:160px;text-align:left;" required>
                    </div>
                    <div>
                        <label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">Min</label>
                        <input type="number" name="new_min" class="admin-input" required>
                    </div>
                    <div>
                        <label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">Max</label>
                        <input type="number" name="new_max" class="admin-input" required>
                    </div>
                    <div>
                        <label style="display:block;font-size:12px;color:var(--text-secondary);margin-bottom:4px;">Rate</label>
                        <input type="number" name="new_rate" class="admin-input" step="0.01" required>
                    </div>
                    <button type="submit" name="add_slab" class="btn btn-success btn-sm"><i class="fa-solid fa-plus"></i> Add</button>
                </form>

                <div class="admin-footer-links" style="margin-top:20px;">
                    <a href="../calculate.php"><i class="fa-solid fa-calculator"></i> Test in Calculator</a>
                </div>

            <?php endif; ?>
        </div>
    </div>
</div>

<script src="../dark.js"></script>
<footer>
    <div class="container">
        <p>&copy; 2025 ElectraBill. All rights reserved.</p>
    </div>
</footer>

</body>
</html>
<?php $conn->close(); ?>
