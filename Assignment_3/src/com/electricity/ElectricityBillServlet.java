package com.electricity;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ElectricityBillServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        process(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        process(request, response);
    }

    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String name = request.getParameter("name");
        String unitsStr = request.getParameter("units");

        if (name == null || name.trim().isEmpty()) {
            redirectWithError(response, "Please enter the consumer name.");
            return;
        }

        if (unitsStr == null || unitsStr.trim().isEmpty()) {
            redirectWithError(response, "Please enter the units consumed.");
            return;
        }

        double units;
        try {
            units = Double.parseDouble(unitsStr.trim());
        } catch (NumberFormatException e) {
            redirectWithError(response, "Units must be a valid number.");
            return;
        }

        if (units < 0) {
            redirectWithError(response, "Units cannot be negative.");
            return;
        }

        BillCalculator.BillResult result = BillCalculator.calculate(units);

        request.setAttribute("name", name.trim());
        request.setAttribute("units", units);
        request.setAttribute("result", result);

        request.getRequestDispatcher("result.jsp").forward(request, response);
    }

    private void redirectWithError(HttpServletResponse response, String message)
            throws IOException {
        response.sendRedirect("index.html?error=" + URLEncoder.encode(message, "UTF-8"));
    }
}