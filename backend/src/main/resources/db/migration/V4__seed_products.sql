INSERT INTO products (
    category_id,
    name,
    slug,
    short_description,
    description,
    price,
    old_price,
    stock_quantity,
    sku,
    status
)
VALUES
    (
        (SELECT id FROM categories WHERE slug = 'ban-lam-viec'),
        'Smart Standing Desk Basic',
        'smart-standing-desk-basic',
        'Ban nang ha thong minh co ban cho goc lam viec tai nha.',
        'Ban nang ha voi thiet ke toi gian, phu hop cho sinh vien, lap trinh vien va nhan vien van phong lam viec hybrid.',
        4500000.00,
        5200000.00,
        20,
        'SW-DESK-001',
        'ACTIVE'
    ),
    (
        (SELECT id FROM categories WHERE slug = 'ghe-cong-thai-hoc'),
        'Ergonomic Chair Mesh',
        'ergonomic-chair-mesh',
        'Ghe luoi cong thai hoc ho tro lung khi ngoi lau.',
        'Ghe cong thai hoc lung luoi, co tua lung va dem ngoi thoang khi, phu hop lam viec nhieu gio lien tuc.',
        3200000.00,
        3800000.00,
        25,
        'SW-CHAIR-001',
        'ACTIVE'
    ),
    (
        (SELECT id FROM categories WHERE slug = 'phu-kien-setup'),
        'Laptop Stand Aluminum',
        'laptop-stand-aluminum',
        'Gia do laptop nhom giup nang tam nhin va gon ban lam viec.',
        'Gia do laptop bang nhom, thiet ke chac chan, phu hop cho laptop van phong va setup man hinh ngoai.',
        650000.00,
        790000.00,
        50,
        'SW-ACC-001',
        'ACTIVE'
    ),
    (
        (SELECT id FROM categories WHERE slug = 'den-lam-viec'),
        'Monitor Light Bar',
        'monitor-light-bar',
        'Den man hinh giam loi choa cho goc lam viec toi.',
        'Den treo man hinh co nhieu muc sang, giup giam moi mat khi hoc tap, code hoac lam viec buoi toi.',
        890000.00,
        1090000.00,
        40,
        'SW-LIGHT-001',
        'ACTIVE'
    ),
    (
        (SELECT id FROM categories WHERE slug = 'phu-kien-setup'),
        'Wireless Charging Desk Mat',
        'wireless-charging-desk-mat',
        'Lot ban lam viec tich hop sac khong day.',
        'Lot chuot ban rong, be mat em, co khu vuc sac khong day cho dien thoai ho tro chuan Qi.',
        750000.00,
        950000.00,
        35,
        'SW-ACC-002',
        'ACTIVE'
    ),
    (
        (SELECT id FROM categories WHERE slug = 'combo-setup'),
        'Coder Setup Combo',
        'coder-setup-combo',
        'Combo setup toi gian cho lap trinh vien va sinh vien IT.',
        'Combo gom ban nang ha, ghe cong thai hoc, gia do laptop va phu kien quan ly day cap cho goc code gon gang.',
        7800000.00,
        9200000.00,
        10,
        'SW-COMBO-001',
        'ACTIVE'
    ),
    (
        (SELECT id FROM categories WHERE slug = 'combo-setup'),
        'Creator Setup Combo',
        'creator-setup-combo',
        'Combo setup cho content creator va freelancer.',
        'Combo gom ban nang ha, den man hinh, lot ban sac khong day va phu kien setup giup lam viec sang tao hieu qua.',
        6900000.00,
        8200000.00,
        12,
        'SW-COMBO-002',
        'ACTIVE'
    );

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
VALUES
    ((SELECT id FROM products WHERE slug = 'smart-standing-desk-basic'), 'https://example.com/images/smart-standing-desk-basic.jpg', 'Smart Standing Desk Basic', 1, 1),
    ((SELECT id FROM products WHERE slug = 'ergonomic-chair-mesh'), 'https://example.com/images/ergonomic-chair-mesh.jpg', 'Ergonomic Chair Mesh', 1, 1),
    ((SELECT id FROM products WHERE slug = 'laptop-stand-aluminum'), 'https://example.com/images/laptop-stand-aluminum.jpg', 'Laptop Stand Aluminum', 1, 1),
    ((SELECT id FROM products WHERE slug = 'monitor-light-bar'), 'https://example.com/images/monitor-light-bar.jpg', 'Monitor Light Bar', 1, 1),
    ((SELECT id FROM products WHERE slug = 'wireless-charging-desk-mat'), 'https://example.com/images/wireless-charging-desk-mat.jpg', 'Wireless Charging Desk Mat', 1, 1),
    ((SELECT id FROM products WHERE slug = 'coder-setup-combo'), 'https://example.com/images/coder-setup-combo.jpg', 'Coder Setup Combo', 1, 1),
    ((SELECT id FROM products WHERE slug = 'creator-setup-combo'), 'https://example.com/images/creator-setup-combo.jpg', 'Creator Setup Combo', 1, 1);
