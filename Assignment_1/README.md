# ElectraBill - Electricity Bill Calculator

ElectraBill is a web-based electricity bill calculation system developed as part of the Web Technologies Assignment. The application calculates electricity bills using slab-based pricing and provides additional features such as bill history, statistics, CSV export, and administration of tariff rates.

## Features

- Electricity bill calculation based on units consumed
- Slab-based tariff calculation
- Input validation for electricity units
- Detailed bill breakdown
- Customer bill records stored in MySQL
- Bill history and statistics
- CSV export functionality
- Admin panel for managing electricity tariff rates
- Light/Dark mode
- Responsive and modern user interface
- Invoice generation

## Electricity Tariff

The application uses the following slab-based pricing:

| Units Consumed | Rate |
|---|---:|
| 1 - 50 Units | Rs. 3.50 per unit |
| 51 - 150 Units | Rs. 4.00 per unit |
| 151 - 250 Units | Rs. 5.20 per unit |
| Above 250 Units | Rs. 6.50 per unit |

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts

### Backend

- PHP
- MySQL

### Development Environment

- XAMPP
- Apache
- MySQL
- phpMyAdmin

## Project Structure

```text
Assignment_1/
│
├── admin/
│   └── Admin-related PHP files
│
├── index.html
├── calculate.php
├── config.php
├── csv.php
├── invoice.php
├── stats.php
├── dark.js
├── style.css
├── bills.sql
└── seed.sql
