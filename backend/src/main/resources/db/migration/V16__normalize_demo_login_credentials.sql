SET @demo_password_hash = '$2a$10$lmarEVWKuCKIagVD4.ToK.PLgxvGFrE9Jqy7Mtbdqlt.U7.MicrCq';

UPDATE users
SET password_hash = @demo_password_hash,
    status = 'ACTIVE'
WHERE email IN (
    'customer-1@smartworkspace.local',
    'customer@smartworkspace.local',
    'email@email.com',
    'phase7-admin-20260604172425@example.com',
    'phase6-b-20260604171553@example.com',
    'phase6-a-20260604171553@example.com',
    'phase5-20260604170929@example.com'
);

INSERT INTO users (full_name, email, phone, password_hash, status)
VALUES ('Admin Demo', 'admin-demo@smartworkspace.local', '0909000099', @demo_password_hash, 'ACTIVE')
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    password_hash = VALUES(password_hash),
    status = VALUES(status);

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.email IN ('admin-demo@smartworkspace.local', 'email@email.com');

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'CUSTOMER'
WHERE u.email IN ('customer-1@smartworkspace.local', 'customer@smartworkspace.local');
