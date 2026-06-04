# 06 - Flyway Rules

## 1. Mục tiêu

Dự án dùng Flyway để quản lý database schema.

Hibernate/JPA không tự tạo hoặc tự cập nhật bảng.

---

## 2. Vị trí migration

Tất cả migration nằm trong:

```txt
src/main/resources/db/migration
```

---

## 3. Quy tắc đặt tên file

Format bắt buộc:

```txt
V{version}__{description}.sql
```

Ví dụ:

```txt
V1__init_schema.sql
V2__seed_roles.sql
V3__seed_categories.sql
V4__seed_products.sql
```

Lưu ý:
- Sau `V1` là hai dấu gạch dưới `__`
- Không dùng dấu cách trong tên file
- Dùng chữ thường và dấu gạch dưới cho description

---

## 4. Quy tắc quan trọng

Không sửa migration cũ nếu migration đó đã chạy.

Nếu cần sửa database, tạo migration mới.

Ví dụ:

```txt
V5__alter_products_add_discount_price.sql
V6__add_store_location_status.sql
V7__create_coupons_table.sql
```

---

## 5. JPA config bắt buộc

Trong `application.yml`:

```yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

Không dùng:

```yml
ddl-auto: update
ddl-auto: create
ddl-auto: create-drop
```

Lý do:
- Flyway là nguồn quản lý schema chính.
- Hibernate chỉ kiểm tra entity có khớp schema không.
- Tránh việc database bị tự sửa ngoài ý muốn.

---

## 6. Flyway config đề xuất

```yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```

---

## 7. Migration thứ tự đề xuất

### V1__init_schema.sql

Tạo toàn bộ bảng chính:

- users
- roles
- user_roles
- addresses
- categories
- products
- product_images
- promotions
- product_promotions
- carts
- cart_items
- orders
- order_items
- payments
- shipments
- product_reviews
- product_comments
- feedbacks
- policies
- store_locations

---

### V2__seed_roles.sql

Seed role:

```sql
INSERT INTO roles (name, description)
VALUES 
('ADMIN', 'Administrator'),
('CUSTOMER', 'Customer');
```

---

### V3__seed_categories.sql

Seed danh mục mẫu:

- Bàn làm việc
- Ghế công thái học
- Phụ kiện setup
- Đèn làm việc
- Combo setup

---

### V4__seed_products.sql

Seed sản phẩm mẫu:

- Smart Standing Desk Basic
- Ergonomic Chair Mesh
- Laptop Stand Aluminum
- Monitor Light Bar
- Wireless Charging Desk Mat
- Coder Setup Combo
- Creator Setup Combo

---

## 8. MySQL rules

Nên dùng:

```sql
BIGINT AUTO_INCREMENT PRIMARY KEY
```

Cho tiền tệ:

```sql
DECIMAL(15, 2)
```

Cho thời gian:

```sql
DATETIME
```

Cho trạng thái:

```sql
VARCHAR(50)
```

Cho text dài:

```sql
TEXT
```

---

## 9. Foreign key rules

Các bảng quan hệ nên có foreign key.

Ví dụ:

```sql
CONSTRAINT fk_products_category
FOREIGN KEY (category_id) REFERENCES categories(id)
```

Quy tắc:
- Không đặt tên foreign key quá dài.
- Tên nên dễ hiểu.
- Với lab project, không cần quá tối ưu.

---

## 10. Index rules

Nên tạo index cho các cột hay tìm kiếm:

- `users.email`
- `products.name`
- `products.slug`
- `products.category_id`
- `orders.user_id`
- `orders.order_code`
- `product_reviews.product_id`
- `product_comments.product_id`

Ví dụ:

```sql
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
```

---

## 11. Khi Flyway lỗi

Các lỗi thường gặp:

### Sai checksum

Nguyên nhân:
- Đã sửa migration cũ sau khi chạy.

Cách xử lý khi đang dev local:
- Xóa database local
- Chạy lại app
- Hoặc dùng `flyway repair` nếu hiểu rõ

Với lab project:
- Nếu chưa nộp bài, có thể reset database local cho nhanh.
- Nhưng vẫn nên giữ nguyên quy tắc không sửa migration cũ.

---

### Entity không khớp database

Nguyên nhân:
- Entity field khác tên/cấu trúc trong migration.
- Thiếu column.
- Sai kiểu dữ liệu.
- Sai enum/string.

Cách xử lý:
- Kiểm tra Entity annotation
- Kiểm tra migration
- Nếu cần đổi schema, tạo migration mới
