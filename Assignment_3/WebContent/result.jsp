<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
    String name = (String) request.getAttribute("name");
    Double units = (Double) request.getAttribute("units");
    com.electricity.BillCalculator.BillResult result =
            (com.electricity.BillCalculator.BillResult) request.getAttribute("result");

    if (name == null || units == null || result == null) {
        response.sendRedirect("index.html");
        return;
    }

    java.text.DecimalFormat df = new java.text.DecimalFormat("#,##0.00");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bill Summary - <%= name %></title>
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
      <div class="summary-head">
        <h2>Consumer: <%= name %></h2>
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
          <%
            for (com.electricity.BillCalculator.SlabDetail s : result.getSlabs()) {
          %>
          <tr>
            <td><%= s.getLabel() %></td>
            <td><%= df.format(s.getUnits()) %></td>
            <td><%= df.format(s.getRate()) %></td>
            <td><%= df.format(s.getAmount()) %></td>
          </tr>
          <%
            }
          %>
        </tbody>
        <tfoot>
          <tr class="grand-total">
            <td colspan="3">Total Bill Amount</td>
            <td>&#8377;<%= df.format(result.getTotal()) %></td>
          </tr>
        </tfoot>
      </table>

      <div class="actions">
        <a href="index.html" class="btn-secondary">Calculate Another Bill</a>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <p>WT Assignment - Servlet-based Electricity Bill Calculator</p>
  </footer>

</body>
</html>