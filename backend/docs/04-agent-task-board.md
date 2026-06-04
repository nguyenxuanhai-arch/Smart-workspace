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

- [ ] Tạo `SecurityConfig`
- [ ] Tạo `JwtService`
- [ ] Tạo `JwtAuthenticationFilter`
- [ ] Tạo `CustomUserDetails`
- [ ] Tạo `CustomUserDetailsService`
- [ ] Cấu hình BCrypt password encoder
- [ ] Cấu hình endpoint public/private/admin
- [ ] Tạo Auth DTO
- [ ] Tạo `AuthService`
- [ ] Tạo `AuthController`
- [ ] API register
- [ ] API login
- [ ] API me
- [ ] Register tự gán role CUSTOMER
- [ ] Test login lấy JWT token thành công

---

## Phase 6 - User & Address

- [ ] Tạo User DTO
- [ ] Tạo Address DTO
- [ ] API xem profile
- [ ] API cập nhật profile
- [ ] API xem danh sách địa chỉ
- [ ] API thêm địa chỉ
- [ ] API sửa địa chỉ
- [ ] API xóa địa chỉ
- [ ] Kiểm tra user chỉ sửa được địa chỉ của mình

---

## Phase 7 - Category & Product Catalog

- [ ] Tạo Category DTO
- [ ] Tạo Product DTO
- [ ] Tạo ProductMapper
- [ ] API public xem categories
- [ ] API admin CRUD categories
- [ ] API public xem danh sách products
- [ ] API public xem product detail theo id
- [ ] API public xem product detail theo slug
- [ ] Search product theo keyword
- [ ] Filter product theo category
- [ ] Filter product theo giá
- [ ] Sort product theo giá/ngày tạo
- [ ] Pagination products
- [ ] API admin tạo product
- [ ] API admin sửa product
- [ ] API admin xóa mềm product
- [ ] Xử lý product images

---

## Phase 8 - Cart

- [ ] Tạo Cart DTO
- [ ] API xem giỏ hàng
- [ ] API thêm item vào giỏ
- [ ] Nếu item đã tồn tại thì tăng số lượng
- [ ] API cập nhật số lượng
- [ ] API xóa item
- [ ] Tính subtotal từng item
- [ ] Tính total giỏ hàng
- [ ] Chỉ user đăng nhập mới dùng được cart

---

## Phase 9 - Order, Payment, Shipment

- [ ] Tạo Order DTO
- [ ] Tạo Payment DTO
- [ ] Tạo Shipment DTO
- [ ] API tạo order từ cart
- [ ] Lưu snapshot order_items
- [ ] Tính subtotal, shipping fee, discount, total
- [ ] Clear cart sau khi tạo order
- [ ] API xem order của user
- [ ] API xem chi tiết order
- [ ] User chỉ xem được order của mình
- [ ] Tạo payment mock
- [ ] Hỗ trợ COD, BANK_TRANSFER, MOMO, ZALOPAY, VNPAY, CARD
- [ ] Tạo shipment mock
- [ ] Admin xem danh sách order
- [ ] Admin cập nhật order status
- [ ] Admin cập nhật payment status
- [ ] Admin cập nhật shipment status

---

## Phase 10 - Review, Comment, Feedback

- [ ] API xem reviews theo product
- [ ] API tạo review
- [ ] Validate rating 1-5
- [ ] Chặn user review một product nhiều lần nếu áp dụng unique
- [ ] API xem comments theo product
- [ ] API tạo comment
- [ ] Hỗ trợ reply comment bằng parentId
- [ ] Admin cập nhật trạng thái review
- [ ] Admin cập nhật trạng thái comment
- [ ] API gửi feedback public
- [ ] Admin xem feedback
- [ ] Admin cập nhật trạng thái feedback

---

## Phase 11 - Policy, Store Location, Admin Dashboard

- [ ] API public xem policies
- [ ] API public xem policy theo type
- [ ] Admin tạo/sửa policy
- [ ] API public xem store locations
- [ ] Admin CRUD store locations
- [ ] Store location có Google Maps URL
- [ ] Admin dashboard basic:
  - Tổng sản phẩm
  - Tổng đơn hàng
  - Tổng doanh thu mock
  - Đơn pending
  - Feedback mới

---

## Phase 12 - Testing & Demo

- [ ] Test register
- [ ] Test login
- [ ] Test JWT `/auth/me`
- [ ] Test admin authorization
- [ ] Test product listing
- [ ] Test search/filter/sort products
- [ ] Test cart flow
- [ ] Test create order
- [ ] Test payment mock
- [ ] Test admin update order
- [ ] Test review/comment
- [ ] Test feedback
- [ ] Test policies
- [ ] Test store locations
- [ ] Chuẩn bị Swagger demo
- [ ] Chuẩn bị Postman collection nếu có thời gian
