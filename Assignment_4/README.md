# Electricity Bill Calculator (JSP only)

A responsive web application that calculates electricity bills based on
slab-based tariff rates, built **only with JSP** (no Servlet class),
plus HTML, CSS and JavaScript.

## Tariff Slabs

| Units                      | Rate (Rs./unit) |
|----------------------------|-----------------|
| First 50 units             | 3.50            |
| Next 100 units (51 - 150)  | 4.00            |
| Next 100 units (151 - 250) | 5.20            |
| Above 250 units            | 6.50            |

## Project Structure

```
A4/
├── index.jsp          # Responsive input form (with live estimate)
├── calculate.jsp      # Reads request params, computes the bill, shows breakdown
├── css/style.css      # Responsive styling
├── js/script.js       # Client-side validation + live estimate
└── README.md
```

There is no `WEB-INF/web.xml` and no Java class — everything is handled by
JSP scriptlets in `calculate.jsp`. `index.jsp` is served automatically
because Tomcat's default welcome-file list includes `index.jsp`.

## How the calculation works

`calculate.jsp` reads `name` and `units` from the POST request, validates
them, then walks through each slab in order consuming the slab's limit first.
For example, **214 units** is billed as:

- 50 x 3.50 = Rs. 175.00
- 100 x 4.00 = Rs. 400.00
- 64 x 5.20 = Rs. 332.80
- **Total = Rs. 907.80**

## Running the application (Apache Tomcat)

1. Copy the `A4` folder into `<TOMCAT_HOME>/webapps/`.
2. Start Tomcat and open:

   ```
   http://localhost:8080/A4/
   ```

3. Enter a consumer name and units consumed, then click **Calculate Bill**.

## Features

- Slab-wise bill breakdown on the result page
- Responsive layout (works on mobile, tablet and desktop)
- Client-side form validation and a live bill estimate
- Server-side validation in `calculate.jsp` with error messages