-- Seed Orders
INSERT IGNORE INTO orders (user_id, order_code, receiver_name, receiver_phone, shipping_address, subtotal_amount, shipping_fee, discount_amount, total_amount, status)
VALUES
((SELECT id FROM users WHERE email='customer-1@smartworkspace.local'), 'SW-1025', 'Customer Demo', '0950588913', '123 Smart St, HCMC', 4200000.00, 0, 0, 4200000.00, 'PENDING'),
((SELECT id FROM users WHERE email='customer-1@smartworkspace.local'), 'SW-1024', 'Customer Demo', '0950588913', '123 Smart St, HCMC', 18500000.00, 0, 0, 18500000.00, 'SHIPPED');

-- Seed Order Items
INSERT IGNORE INTO order_items (order_id, product_id, product_name, product_sku, unit_price, quantity, subtotal)
VALUES
((SELECT id FROM orders WHERE order_code='SW-1025'), (SELECT id FROM products WHERE sku='SW-DESKS1-001'), 'Smart Standing Desk S1', 'SW-DESKS1-001', 4200000.00, 1, 4200000.00),
((SELECT id FROM orders WHERE order_code='SW-1024'), (SELECT id FROM products WHERE sku='SW-CODE-001'), 'Coder Elite', 'SW-CODE-001', 13490000.00, 1, 13490000.00),
((SELECT id FROM orders WHERE order_code='SW-1024'), (SELECT id FROM products WHERE sku='SW-CHAIRM2-001'), 'Ergo Mesh Chair M2', 'SW-CHAIRM2-001', 5010000.00, 1, 5010000.00);

-- Seed Payments
INSERT IGNORE INTO payments (order_id, payment_method, payment_status, amount, transaction_code)
VALUES
((SELECT id FROM orders WHERE order_code='SW-1025'), 'CREDIT_CARD', 'PAID', 4200000.00, 'TXN-1025'),
((SELECT id FROM orders WHERE order_code='SW-1024'), 'BANK_TRANSFER', 'PAID', 18500000.00, 'TXN-1024');
