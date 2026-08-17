<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electricity Bill Calculator</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="site-header">
    <div class="brand">
      <span class="bolt" aria-hidden="true">&#9889;</span>
      <h1>Electricity Bill Calculator</h1>
    </div>
    <p class="tagline">Transparent slab-based billing made simple</p>
  </header>

  <main class="container">

    <section class="card form-card">
      <h2>Enter Consumption Details</h2>

      <div id="toast" class="toast" hidden></div>

      <form id="billForm" action="calculate.jsp" method="post" novalidate>
        <div class="field">
          <label for="name">Consumer Name</label>
          <input type="text" id="name" name="name"
                 placeholder="e.g. Rahul Sharma" autocomplete="off">
          <span class="error" id="nameErr"></span>
        </div>

        <div class="field">
          <label for="units">Units Consumed</label>
          <input type="number" id="units" name="units" min="0" step="any"
                 placeholder="e.g. 214">
          <span class="error" id="unitsErr"></span>
        </div>

        <button type="submit" class="btn-primary">Calculate Bill</button>

        <p class="hint">Live estimate: <strong id="estimate">&#8377;0.00</strong></p>
      </form>
    </section>

    <section class="card slab-card">
      <h2>Tariff Slabs</h2>
      <table class="slab-table">
        <thead>
          <tr>
            <th>Units</th>
            <th>Rate (&#8377;/unit)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>First 50 units</td><td>3.50</td></tr>
          <tr><td>Next 100 units (51 - 150)</td><td>4.00</td></tr>
          <tr><td>Next 100 units (151 - 250)</td><td>5.20</td></tr>
          <tr><td>Above 250 units</td><td>6.50</td></tr>
        </tbody>
      </table>
    </section>

  </main>

  <footer class="site-footer">
    <p>WT Assignment - JSP-only Electricity Bill Calculator</p>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>