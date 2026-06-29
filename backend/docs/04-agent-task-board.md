# 04 - Agent Task Board

## Lưu ý

Backend dùng:

- Java Spring Boot
- Spring Data JPA/Hibernate
- Flyway
- MySQL
- Spring Security JWT
- Layered Monolith đơn giản

Không dùng:
- Express
- NestJS
- Prisma
- Node.js
- Modular monolith
- Thư mục `module/`

---

## Phase 1 - Project Setup

- [x] Tạo Maven Spring Boot project
- [x] Package gốc: `com.example.smartworkspace`
- [x] Tạo cấu trúc package:
  - `configs`
  - `securities`
  - `commons`
  - `entities`
  - `repositories`
  - `services`
  - `controllers`
  - `dtos`
  - `mappers`
  - `enums`
- [x] Cấu hình `application.properties`
- [x] Cấu hình MySQL datasource
- [x] Cấu hình JPA `ddl-auto=validate`
- [x] Cấu hình Flyway
- [x] Cấu hình Swagger/OpenAPI
- [x] Chạy được app rỗng

---

## Phase 2 - Common Layer

- [x] Tạo `ApiResponse`
- [x] Tạo `PageResponse`
- [x] Tạo `AppException`
- [x] Tạo `ErrorCode`
- [x] Tạo `GlobalExceptionHandler`
- [x] Chuẩn hóa response success/error
- [x] Xử lý lỗi validation

---

## Phase 3 - Database & Flyway

- [x] Tạo `V1__init_schema.sql`
- [x] Tạo bảng users
- [x] Tạo bảng roles
- [x] Tạo bảng user_roles
- [x] Tạo bảng addresses
- [x] Tạo bảng categories
- [x] Tạo bảng products
- [x] Tạo bảng product_images
- [x] Tạo bảng promotions
- [x] Tạo bảng product_promotions
- [x] Tạo bảng carts
- [x] Tạo bảng cart_items
- [x] Tạo bảng orders
- [x] Tạo bảng order_items
- [x] Tạo bảng payments
- [x] Tạo bảng shipments
- [x] Tạo bảng product_reviews
- [x] Tạo bảng product_comments
- [x] Tạo bảng feedbacks
- [x] Tạo bảng policies
- [x] Tạo bảng store_locations
- [x] Tạo `V2__seed_roles.sql`
- [x] Tạo `V3__seed_categories.sql`
- [x] Tạo `V4__seed_products.sql`
- [x] Chạy Flyway migration thành công

---

## Phase 4 - Entity & Repository

- [x] Tạo entity User
- [x] Tạo entity Role
- [x] Tạo entity Address
- [x] Tạo entity Category
- [x] Tạo entity Product
- [x] Tạo entity ProductImage
- [x] Tạo entity Promotion
- [x] Tạo entity Cart
- [x] Tạo entity CartItem
- [x] Tạo entity Order
- [x] Tạo entity OrderItem
- [x] Tạo entity Payment
- [x] Tạo entity Shipment
- [x] Tạo entity ProductReview
- [x] Tạo entity ProductComment
- [x] Tạo entity Feedback
- [x] Tạo entity Policy
- [x] Tạo entity StoreLocation
- [x] Tạo repository tương ứng
- [x] Kiểm tra entity khớp migration bằng `ddl-auto=validate`

---

## Phase 5 - Security & Auth

- [x] Tạo `SecurityConfig`
- [x] Tạo `JwtService`
- [x] Tạo `JwtAuthenticationFilter`
- [x] Tạo `CustomUserDetails`
- [x] Tạo `CustomUserDetailsService`
- [x] Cấu hình BCrypt password encoder
- [x] Cấu hình endpoint public/private/admin
- [x] Tạo Auth DTO
- [x] Tạo `AuthService`
- [x] Tạo `AuthController`
- [x] API register
- [x] API login
- [x] API me
- [x] Register tự gán role CUSTOMER
- [x] Test login lấy JWT token thành công

---

## Phase 6 - User & Address

- [x] Tạo User DTO
- [x] Tạo Address DTO
- [x] API xem profile
- [x] API cập nhật profile
- [x] API xem danh sách địa chỉ
- [x] API thêm địa chỉ
- [x] API sửa địa chỉ
- [x] API xóa địa chỉ
- [x] Kiểm tra user chỉ sửa được địa chỉ của mình

---

## Phase 7 - Category & Product Catalog

- [x] Tạo Category DTO
- [x] Tạo Product DTO
- [x] Tạo ProductMapper
- [x] API public xem categories
- [x] API admin CRUD categories
- [x] API public xem danh sách products
- [x] API public xem product detail theo id
- [x] API public xem product detail theo slug
- [x] Search product theo keyword
- [x] Filter product theo category
- [x] Filter product theo giá
- [x] Sort product theo giá/ngày tạo
- [x] Pagination products
- [x] API admin tạo product
- [x] API admin sửa product
- [x] API admin xóa mềm product
- [x] Xử lý product images
- [x] API admin upload ảnh product local
- [x] Lưu file vào `backend/uploads/products`
- [x] Serve file public qua `/uploads/products/**`
- [x] Product create/update dùng URL upload trong `imageUrls`

---

## Phase 8 - Cart

- [x] Tạo Cart DTO
- [x] API xem giỏ hàng
- [x] API thêm item vào giỏ
- [x] Nếu item đã tồn tại thì tăng số lượng
- [x] API cập nhật số lượng
- [x] API xóa item
- [x] Tính subtotal từng item
- [x] Tính total giỏ hàng
- [x] Chỉ user đăng nhập mới dùng được cart

---

## Phase 9 - Order, Payment, Shipment

- [x] Tạo Order DTO
- [x] Tạo Payment DTO
- [x] Tạo Shipment DTO
- [x] API tạo order từ cart
- [x] Lưu snapshot order_items
- [x] Tính subtotal, shipping fee, discount, total
- [x] Clear cart sau khi tạo order
- [x] API xem order của user
- [x] API xem chi tiết order
- [x] User chỉ xem được order của mình
- [x] Tạo payment mock
- [x] Hỗ trợ COD, BANK_TRANSFER, MOMO, ZALOPAY, VNPAY, CARD
- [x] Tạo shipment mock
- [x] Admin xem danh sách order
- [x] Admin cập nhật order status
- [x] Admin cập nhật payment status
- [x] Admin cập nhật shipment status

---

## Phase 10 - Review, Comment, Feedback

- [x] API xem reviews theo product
- [x] API tạo review
- [x] Validate rating 1-5
- [x] Chặn user review một product nhiều lần nếu áp dụng unique
- [x] API xem comments theo product
- [x] API tạo comment
- [x] Hỗ trợ reply comment bằng parentId
- [x] Admin cập nhật trạng thái review
- [x] Admin cập nhật trạng thái comment
- [x] API gửi feedback public
- [x] Admin xem feedback
- [x] Admin cập nhật trạng thái feedback

---

## Phase 11 - Policy, Store Location, Admin Dashboard

- [x] API public xem policies
- [x] API public xem policy theo type
- [x] Admin tạo/sửa policy
- [x] API public xem store locations
- [x] Admin CRUD store locations
- [x] Store location có Google Maps URL
- [x] Admin dashboard basic:
  - Tổng sản phẩm
  - Tổng đơn hàng
  - Tổng doanh thu mock
  - Đơn pending
  - Feedback mới

---

## Phase 12 - Testing & Demo

- [x] Test register
- [x] Test login
- [x] Test JWT `/auth/me`
- [x] Test admin authorization
- [x] Test product listing
- [x] Test search/filter/sort products
- [x] Test upload ảnh product local
- [x] Test tạo product với URL ảnh local
- [x] Test cart flow
- [x] Test create order
- [x] Test payment mock
- [x] Test admin update order
- [x] Test review/comment
- [x] Test feedback
- [x] Test policies
- [x] Test store locations
- [x] Chuẩn bị Swagger demo
- [x] Chuẩn bị Postman collection nếu có thời gian

---

## Phase 13 - Refresh Token & Token Blacklist

- [x] Tạo migration `V5__add_refresh_token_and_blacklist_token.sql`
- [x] Tạo bảng `refresh_tokens`
- [x] Tạo bảng `blacklisted_tokens`
- [x] Tạo entity RefreshToken
- [x] Tạo entity BlacklistedToken
- [x] Tạo repository RefreshTokenRepository
- [x] Tạo repository BlacklistedTokenRepository
- [x] Thêm claim `jti` vào access token trong `JwtService`
- [x] Thêm cấu hình thời hạn access token và refresh token
- [x] Tạo DTO refresh/logout request
- [x] Login trả thêm `refreshToken` và `expiresIn`
- [x] API `POST /api/auth/refresh`
- [x] API `POST /api/auth/logout`
- [x] Refresh token được lưu DB dưới dạng hash
- [x] Refresh token được rotate sau mỗi lần refresh thành công
- [x] Logout revoke refresh token
- [x] Logout blacklist access token theo `jti`
- [x] `JwtAuthenticationFilter` kiểm tra blacklist trước khi xác thực
- [x] Test refresh token thành công và trả token mới
- [x] Test dùng lại access token sau logout bị 401
- [x] Test dùng lại refresh token cũ sau refresh/logout bị lỗi
