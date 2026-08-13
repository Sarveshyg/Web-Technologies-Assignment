CREATE DATABASE IF NOT EXISTS electricity_billing_cs50;

USE electricity_billing_cs50;

CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    units INT,
    bill DECIMAL(10,2)
);
