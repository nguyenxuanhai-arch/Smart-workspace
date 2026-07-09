UPDATE products
SET
    short_description = 'Tập trung vào thẩm mỹ, ánh sáng đẹp, phù hợp quay video và làm nội dung.',
    description = 'Creator Setup được thiết kế cho freelancer và content creator cần một góc làm việc vừa đẹp trên khung hình, vừa gọn gàng khi sản xuất nội dung mỗi ngày.

Bộ setup ưu tiên ánh sáng dễ kiểm soát, bề mặt làm việc rộng cho laptop, phụ kiện quay dựng và khu vực sạc nhanh. Cách phối màu trung tính giúp không gian lên hình sạch, chuyên nghiệp nhưng vẫn đủ ấm áp để làm việc lâu.

Các chi tiết như kệ decor, desk mat sạc không dây và hệ quản lý dây giúp bàn luôn gọn mắt, hạn chế thời gian dọn lại setup trước mỗi buổi quay hoặc livestream.'
WHERE slug = 'creator-setup';

INSERT IGNORE INTO product_reviews (product_id, user_id, rating, content, status, created_at, updated_at)
SELECT p.id, u.id, 5,
       'Setup lên hình rất sạch, ánh sáng dễ căn và bàn đủ rộng cho máy ảnh, laptop cùng phụ kiện quay.',
       'VISIBLE', NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY
FROM products p
JOIN users u ON u.email = 'customer@smartworkspace.local'
WHERE p.slug = 'creator-setup';

INSERT IGNORE INTO product_reviews (product_id, user_id, rating, content, status, created_at, updated_at)
SELECT p.id, u.id, 5,
       'Mình dùng để quay video sản phẩm hằng ngày, phần dây và sạc được giấu gọn nên tiết kiệm khá nhiều thời gian chuẩn bị.',
       'VISIBLE', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY
FROM products p
JOIN users u ON u.email = 'phase6-b-20260604171553@example.com'
WHERE p.slug = 'creator-setup';

INSERT IGNORE INTO product_reviews (product_id, user_id, rating, content, status, created_at, updated_at)
SELECT p.id, u.id, 4,
       'Tổng thể đẹp và chắc chắn. Mình thích nhất là mặt bàn rộng, đặt thêm đèn và mic vẫn còn thoải mái.',
       'VISIBLE', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY
FROM products p
JOIN users u ON u.email = 'phase5-20260604170929@example.com'
WHERE p.slug = 'creator-setup';
