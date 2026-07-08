-- Seed Customers
INSERT IGNORE INTO users (full_name, email, phone, password_hash, status) VALUES
('Customer Demo', 'customer-1@smartworkspace.local', '0950588913', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'LOCKED'),
('Nguyễn Xuân Hải', 'customer@smartworkspace.local', '0987397954', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'ACTIVE'),
('Quản trị viên', 'email@email.com', '0123456789', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'ACTIVE'),
('Phase 7 Admin', 'phase7-admin-20260604172425@example.com', '0556165383', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'ACTIVE'),
('Phase 6 User B', 'phase6-b-20260604171553@example.com', '0758228563', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'ACTIVE'),
('Phase 6 User A Updated', 'phase6-a-20260604171553@example.com', '0652287138', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'ACTIVE'),
('Phase 5 Tester', 'phase5-20260604170929@example.com', '0991084015', '$2a$10$D8bi6o8f1QO1T0fB.m1/Ceb.lT8kK9U6bI9Gq6.GzU1N2U/yFw7/W', 'ACTIVE');

-- Assign Roles
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'ADMIN'
WHERE u.email IN ('email@email.com', 'phase7-admin-20260604172425@example.com');

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'CUSTOMER'
WHERE u.email IN (
    'customer-1@smartworkspace.local', 
    'customer@smartworkspace.local', 
    'phase6-b-20260604171553@example.com', 
    'phase6-a-20260604171553@example.com', 
    'phase5-20260604170929@example.com'
);

-- Seed Missing Products
INSERT IGNORE INTO products (category_id, name, slug, price, old_price, stock_quantity, sku, status)
VALUES 
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Creator Setup', 'creator-setup', 11990000.00, 14990000.00, 100, 'SW-CREA-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Coder Elite', 'coder-elite', 13490000.00, 16990000.00, 100, 'SW-CODE-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Hybrid Focus', 'hybrid-focus', 9990000.00, 12990000.00, 100, 'SW-HYBR-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Smart Standing Desk S1', 'smart-standing-desk-s1', 8500000.00, 10000000.00, 100, 'SW-DESKS1-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ghe-cong-thai-hoc'), 'Ergo Mesh Chair M2', 'ergo-mesh-chair-m2', 5200000.00, 5490000.00, 100, 'SW-CHAIRM2-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Aluminum Laptop Stand', 'aluminum-laptop-stand', 450000.00, 890000.00, 100, 'SW-ALULAP-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Wireless Charging Mat', 'wireless-charging-mat', 890000.00, 1290000.00, 100, 'SW-WIRMAT-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Cable Management Kit', 'cable-management-kit', 350000.00, 590000.00, 100, 'SW-CABMAN-001', 'ACTIVE'),
((SELECT id FROM categories WHERE slug='ban-lam-viec'), 'Phase 7 Product Updated', 'phase-7-product-updated', 990000.00, 1200000.00, 7, 'SW-PHASE7-001', 'INACTIVE');
