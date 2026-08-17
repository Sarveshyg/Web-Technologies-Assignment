# Electricity Bill Calculator (Servlet + JSP)

A responsive web application that calculates electricity bills based on
slab-based tariff rates, built using **Servlet**, **JSP**, **HTML**, **CSS**
and **JavaScript**.

## Tariff Slabs

| Units                      | Rate (Rs./unit) |
|----------------------------|-----------------|
| First 50 units             | 3.50            |
| Next 100 units (51 - 150)  | 4.00            |
| Next 100 units (151 - 250) | 5.20            |
| Above 250 units            | 6.50            |

## Project Structure

```
A3/
├── src/com/electricity/
│   ├── BillCalculator.java        # Slab calculation logic
│   └── ElectricityBillServlet.java # Handles form POST/GET, forwards to result.jsp
├── WebContent/
│   ├── index.html                 # Responsive input form (with live estimate)
│   ├── result.jsp                 # Bill summary with slab-wise breakdown
│   ├── css/style.css              # Responsive styling
│   ├── js/script.js               # Client-side validation + live estimate
│   └── WEB-INF/
│       └── web.xml                # Servlet mapping (/calculate)
```

## How the calculation works

`BillCalculator.calculate(units)` walks through each slab in order, consuming
the slab's limit first, then moving to the next slab. For example,
**214 units** is billed as:

- 50 x 3.50 = Rs. 175.00
- 100 x 4.00 = Rs. 400.00
- 64 x 5.20 = Rs. 332.80
- **Total = Rs. 907.80**

## Running the application (Apache Tomcat)

1. Compile the servlet classes. The `javax.servlet` API is provided by
   Tomcat (`tomcat/lib/servlet-api.jar`):

   ```bash
   javac -cp "<TOMCAT_HOME>/lib/servlet-api.jar" -d classes src/com/electricity/*.java
   ```

2. Package the app. Inside the project, create a WAR or copy the contents:

   ```
   classes/com/...        (compiled .class files)
   WebContent/*           (index.html, result.jsp, css/, js/, WEB-INF/)
   ```

   The easiest way: in Eclipse, create a *Dynamic Web Project* pointing at
   `WebContent`, or simply copy the whole `WebContent` folder + compiled
   `classes` into `<TOMCAT_HOME>/webapps/A3/`.

3. Start Tomcat and open:

   ```
   http://localhost:8080/A3/
   ```

4. Enter a consumer name and units consumed, then click **Calculate Bill**.

## Features

- Slab-wise bill breakdown on the result page
- Responsive layout (works on mobile, tablet and desktop)
- Client-side form validation and a live bill estimate
- Server-side validation in the servlet with error messages