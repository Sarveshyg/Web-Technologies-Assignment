<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    request.setCharacterEncoding("UTF-8");

    String name = request.getParameter("name");
    String unitsStr = request.getParameter("units");
    String error = null;

    double units = 0;
    if (name == null || name.trim().isEmpty()) {
        error = "Please enter the consumer name.";
    } else if (unitsStr == null || unitsStr.trim().isEmpty()) {
        error = "Please enter the units consumed.";
    } else {
        try {
            units = Double.parseDouble(unitsStr.trim());
        } catch (NumberFormatException e) {
            error = "Units must be a valid number.";
        }
        if (error == null && units < 0) {
            error = "Units cannot be negative.";
        }
    }

    double[] limits = { 50.0, 100.0, 100.0, Double.MAX_VALUE };
    double[] rates  = { 3.50, 4.00, 5.20, 6.50 };
    String[] labels = {
        "First 50 units",
        "Next 100 units (51 - 150)",
        "Next 100 units (151 - 250)",
        "Above 250 units"
    };

    double total = 0.0;
    double[][] rows = new double[4][3];
    int usedSlabs = 0;
    if (error == null) {
        double remaining = units;
        for (int i = 0; i < limits.length && remaining > 0; i++) {
            double used = Math.min(remaining, limits[i]);
            double amount = used * rates[i];
            total += amount;
            rows[i][0] = used;
            rows[i][1] = rates[i];
            rows[i][2] = amount;
            remaining -= used;
            usedSlabs++;
        }
    }

    java.text.DecimalFormat df = new java.text.DecimalFormat("#,##0.00");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bill Summary - <%= error == null ? name : "Error" %></title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="site-header">
    <div class="brand">
      <span class="bolt" aria-hidden="true">&#9889;</span>
      <h1>Bill Summary</h1>
    </div>
    <p class="tagline">Electricity bill as per slab rates</p>
  </header>

  <main class="container narrow">

    <section class="card">

      <% if (error != null) { %>

        <div class="toast"><%= error %></div>
        <div class="actions">
          <a href="index.jsp" class="btn-secondary">Go Back</a>
        </div>

      <% } else { %>

        <div class="summary-head">
          <h2>Consumer: <%= name.trim() %></h2>
          <p>Units Consumed: <strong><%= df.format(units) %></strong></p>
        </div>

        <table class="bill-table">
          <thead>
            <tr>
              <th>Slab</th>
              <th>Units</th>
              <th>Rate (&#8377;)</th>
              <th>Amount (&#8377;)</th>
            </tr>
          </thead>
          <tbody>
            <% for (int i = 0; i < usedSlabs; i++) { %>
            <tr>
              <td><%= labels[i] %></td>
              <td><%= df.format(rows[i][0]) %></td>
              <td><%= df.format(rows[i][1]) %></td>
              <td><%= df.format(rows[i][2]) %></td>
            </tr>
            <% } %>
          </tbody>
          <tfoot>
            <tr class="grand-total">
              <td colspan="3">Total Bill Amount</td>
              <td>&#8377;<%= df.format(total) %></td>
            </tr>
          </tfoot>
        </table>

        <div class="actions">
          <a href="index.jsp" class="btn-secondary">Calculate Another Bill</a>
        </div>

      <% } %>

    </section>

  </main>

  <footer class="site-footer">
    <p>WT Assignment - JSP-only Electricity Bill Calculator</p>
  </footer>

</body>
</html>