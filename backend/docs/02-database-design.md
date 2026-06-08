# 02 - Database Design

## 1. Quy ước chung

Database: MySQL

Tên bảng dùng snake_case.

Ví dụ:
- `users`
- `product_images`
- `order_items`
- `store_locations`

Khóa chính:
- Dùng `BIGINT AUTO_INCREMENT`

Thời gian:
- Các bảng chính nên có `created_at`
- Các bảng cần cập nhật nên có `updated_at`

Xóa mềm:
- Sản phẩm, danh mục, review/comment có thể dùng `status` hoặc `is_deleted`
- Với lab, ưu tiên dùng `status` để dễ hiểu

---

## 2. Nhóm User & Auth

### 2.1 users

Lưu thông tin tài khoản người dùng.

Field đề xuất:
- `id`
- `full_name`
- `email`
- `phone`
- `password_hash`
- `status`
- `created_at`
- `updated_at`

Quan hệ:
- 1 user có nhiều address
- 1 user có nhiều role qua user_roles
- 1 user có 0 hoặc 1 cart active
- 1 user có nhiều orders
- 1 user có nhiều reviews/comments
- 1 user có nhiều refresh token
- 1 user có nhiều blacklisted token nếu logout nhiều phiên

---

### 2.2 roles

Lưu vai trò hệ thống.

Role mặc định:
- `ADMIN`
- `CUSTOMER`

Field:
- `id`
- `name`
- `description`

---

### 2.3 user_roles

Bảng trung gian giữa users và roles.

Field:
- `user_id`
- `role_id`

Khóa chính có thể là composite:
- `(user_id, role_id)`

---

### 2.4 addresses

Lưu địa chỉ nhận hàng của user.

Field:
- `id`
- `user_id`
- `receiver_name`
- `receiver_phone`
- `province`
- `district`
- `ward`
- `detail_address`
- `is_default`
- `created_at`
- `updated_at`

---

### 2.5 refresh_tokens

Lưu refresh token để user có thể xin access token mới mà không cần đăng nhập lại.

Field:
- `id`
- `user_id`
- `token_hash`
- `revoked`
- `expires_at`
- `created_at`
- `revoked_at`
- `replaced_by_token_hash`

Rule:
- Không lưu raw refresh token trong database.
- Chỉ lưu hash của refresh token, ví dụ SHA-256.
- `revoked = true` khi user logout hoặc khi refresh token đã được rotate.
- `replaced_by_token_hash` dùng để lưu token mới thay thế token cũ sau khi rotate.
- Refresh token hết hạn thì không được dùng để cấp access token mới.

Quan hệ:
- 1 refresh token thuộc 1 user.
- 1 user có thể có nhiều refresh token nếu đăng nhập trên nhiều thiết bị.

---

### 2.6 blacklisted_tokens

Lưu access token đã bị vô hiệu hóa trước thời điểm hết hạn, thường dùng khi user logout.

Field:
- `id`
- `token_jti`
- `user_id`
- `expires_at`
- `created_at`

Rule:
- Access token cần có claim `jti` để định danh duy nhất token.
- Khi logout, backend lấy `jti` từ access token và lưu vào bảng này.
- JWT filter phải kiểm tra `token_jti` có nằm trong blacklist không.
- Chỉ cần giữ blacklist token đến khi access token hết hạn.

Quan hệ:
- 1 blacklisted token có thể thuộc 1 user.

---

## 3. Nhóm Product Catalog

### 3.1 categories

Lưu danh mục sản phẩm.

Field:
- `id`
- `parent_id`
- `name`
- `slug`
- `description`
- `status`
- `created_at`
- `updated_at`

Quan hệ:
- category có thể có category con qua `parent_id`
- category có nhiều products

---

### 3.2 products

Lưu sản phẩm.

Field:
- `id`
- `category_id`
- `name`
- `slug`
- `short_description`
- `description`
- `price`
- `old_price`
- `stock_quantity`
- `sku`
- `status`
- `created_at`
- `updated_at`

Gợi ý status:
- `ACTIVE`
- `INACTIVE`
- `OUT_OF_STOCK`

Quan hệ:
- product thuộc category
- product có nhiều product_images
- product có nhiều reviews
- product có nhiều comments
- product có thể có nhiều promotions qua product_promotions

---

### 3.3 product_images

Lưu ảnh sản phẩm.

Field:
- `id`
- `product_id`
- `image_url`
- `alt_text`
- `is_primary`
- `sort_order`
- `created_at`

Ghi chú:
- `imageUrls` là field DTO dùng cho request/response, không phải column trong bảng `products`.
- Khi tạo hoặc sửa product, backend map từng URL trong `imageUrls` thành bản ghi trong bảng `product_images`.
- File ảnh vật lý nằm trong `backend/uploads/products`, database chỉ lưu URL/path ảnh.

---

### 3.4 promotions

Lưu chương trình khuyến mại.

Field:
- `id`
- `name`
- `description`
- `discount_type`
- `discount_value`
- `start_date`
- `end_date`
- `status`
- `created_at`
- `updated_at`

Discount type:
- `PERCENT`
- `FIXED_AMOUNT`

---

### 3.5 product_promotions

Bảng trung gian giữa products và promotions.

Field:
- `product_id`
- `promotion_id`

---

## 4. Nhóm Cart

### 4.1 carts

Lưu giỏ hàng của user.

Field:
- `id`
- `user_id`
- `status`
- `created_at`
- `updated_at`

Status:
- `ACTIVE`
- `ORDERED`
- `CANCELLED`

Quan hệ:
- 1 cart thuộc 1 user
- 1 cart có nhiều cart_items

---

### 4.2 cart_items

Lưu sản phẩm trong giỏ.

Field:
- `id`
- `cart_id`
- `product_id`
- `quantity`
- `unit_price`
- `created_at`
- `updated_at`

Ghi chú:
- `unit_price` lưu giá tại thời điểm thêm vào giỏ.
- Khi tạo order, nên lấy giá hiện tại hoặc giá đã tính theo logic service.

---

## 5. Nhóm Order

### 5.1 orders

Lưu đơn hàng.

Field:
- `id`
- `user_id`
- `order_code`
- `receiver_name`
- `receiver_phone`
- `shipping_address`
- `subtotal_amount`
- `shipping_fee`
- `discount_amount`
- `total_amount`
- `status`
- `note`
- `created_at`
- `updated_at`

Order status:
- `PENDING`
- `CONFIRMED`
- `SHIPPING`
- `COMPLETED`
- `CANCELLED`

---

### 5.2 order_items

Lưu snapshot sản phẩm trong đơn hàng.

Field:
- `id`
- `order_id`
- `product_id`
- `product_name`
- `product_sku`
- `unit_price`
- `quantity`
- `subtotal`

Ghi chú:
- Phải lưu `product_name`, `product_sku`, `unit_price` để sau này sản phẩm đổi giá/tên thì đơn hàng cũ vẫn đúng.

---

## 6. Nhóm Payment & Shipment

### 6.1 payments

Lưu thanh toán của đơn hàng.

Field:
- `id`
- `order_id`
- `payment_method`
- `payment_status`
- `amount`
- `transaction_code`
- `paid_at`
- `created_at`
- `updated_at`

Payment method:
- `COD`
- `BANK_TRANSFER`
- `MOMO`
- `ZALOPAY`
- `VNPAY`
- `CARD`

Payment status:
- `UNPAID`
- `PAID`
- `FAILED`
- `REFUNDED`

---

### 6.2 shipments

Lưu thông tin vận chuyển.

Field:
- `id`
- `order_id`
- `carrier_name`
- `tracking_code`
- `shipping_status`
- `estimated_delivery_date`
- `delivered_at`
- `created_at`
- `updated_at`

Shipping status:
- `PENDING`
- `PROCESSING`
- `SHIPPING`
- `DELIVERED`
- `FAILED`
- `RETURNED`

---

## 7. Nhóm Social Proof

### 7.1 product_reviews

Lưu đánh giá sản phẩm.

Field:
- `id`
- `product_id`
- `user_id`
- `rating`
- `content`
- `status`
- `created_at`
- `updated_at`

Status:
- `VISIBLE`
- `HIDDEN`

Rule:
- `rating` từ 1 đến 5
- Có thể unique `(product_id, user_id)` để mỗi user chỉ review một lần

---

### 7.2 product_comments

Lưu bình luận sản phẩm.

Field:
- `id`
- `product_id`
- `user_id`
- `parent_id`
- `content`
- `status`
- `created_at`
- `updated_at`

Ghi chú:
- `parent_id` dùng để reply comment.
- Nếu `parent_id` null thì là comment gốc.
- Nếu `parent_id` có giá trị thì là comment trả lời.

---

## 8. Nhóm Support & Content

### 8.1 feedbacks

Lưu liên hệ/feedback.

Field:
- `id`
- `full_name`
- `email`
- `phone`
- `subject`
- `message`
- `status`
- `created_at`
- `updated_at`

Status:
- `NEW`
- `PROCESSING`
- `DONE`

---

### 8.2 policies

Lưu chính sách.

Field:
- `id`
- `type`
- `title`
- `content`
- `status`
- `created_at`
- `updated_at`

Policy type:
- `RETURN`
- `WARRANTY`
- `SHIPPING`
- `PAYMENT`

---

### 8.3 store_locations

Lưu địa điểm cửa hàng/showroom.

Field:
- `id`
- `name`
- `address`
- `phone`
- `latitude`
- `longitude`
- `google_map_url`
- `status`
- `created_at`
- `updated_at`

---

## 9. Quan hệ chính

Tóm tắt quan hệ:

```txt
users 1 - n addresses
users n - n roles thông qua user_roles
users 1 - n refresh_tokens
users 1 - n blacklisted_tokens
users 1 - n orders
users 1 - 0..1 carts
users 1 - n product_reviews
users 1 - n product_comments

categories 1 - n products
categories 1 - n categories thông qua parent_id

products 1 - n product_images
products 1 - n product_reviews
products 1 - n product_comments
products n - n promotions thông qua product_promotions

carts 1 - n cart_items
products 1 - n cart_items

orders 1 - n order_items
orders 1 - 1 payments
orders 1 - 1 shipments
products 1 - n order_items
```

---

## 10. Lưu ý cho JPA/Hibernate

Không dùng Entity trực tiếp làm response.

Các quan hệ nên cấu hình cẩn thận để tránh vòng lặp JSON.

Ưu tiên:
- Entity dùng `@ManyToOne(fetch = FetchType.LAZY)` cho quan hệ nhiều-về-một.
- Response DTO tự map dữ liệu cần trả.
- Không lạm dụng `CascadeType.ALL`.
- Không dùng `EAGER` bừa bãi.

---

## 11. Lưu ý lưu token

Với refresh token, chỉ trả raw token một lần trong response sau login/refresh; database chỉ lưu hash token.

Với access token blacklist, chỉ lưu `jti` và thời điểm hết hạn để có thể dọn dữ liệu cũ sau khi token hết hiệu lực.
