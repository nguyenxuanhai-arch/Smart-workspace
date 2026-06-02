# Smart Workspace

Smart Workspace là backend cho website thương mại điện tử bán sản phẩm setup phòng làm việc thông minh. Dự án phục vụ lab môn Thương mại điện tử, tập trung vào luồng nghiệp vụ dễ demo bằng Swagger hoặc Postman, code rõ ràng và không làm kiến trúc quá phức tạp.

## Ý tưởng dự án

Smart Workspace mô phỏng mô hình D2C E-commerce / Dropshipping - Brand Hybrid. Thay vì chỉ bán từng sản phẩm lẻ, website tập trung vào các giải pháp setup góc làm việc trọn gói cho sinh viên, lập trình viên, freelancer, content creator và nhân viên văn phòng hybrid/remote.

Nhóm sản phẩm chính:

- Bàn nâng hạ thông minh
- Ghế công thái học
- Giá đỡ laptop
- Đèn màn hình chống lóa
- Phụ kiện setup bàn làm việc
- Combo setup như Creator Setup, Coder Setup, Hybrid Worker Setup

## Phạm vi chức năng

Backend được thiết kế để hỗ trợ các nhóm chức năng chính:

- Auth: đăng ký, đăng nhập, lấy thông tin user hiện tại, phân quyền CUSTOMER/ADMIN
- Product catalog: danh mục, sản phẩm, ảnh sản phẩm, tìm kiếm, lọc, sắp xếp, phân trang
- Cart: giỏ hàng active theo user, thêm/sửa/xóa item, tính tổng tiền
- Order: tạo đơn hàng từ giỏ hàng, lưu snapshot sản phẩm, quản lý trạng thái đơn
- Payment mock: COD, chuyển khoản ngân hàng, MoMo, ZaloPay, VNPay, thẻ
- Shipment mock: lưu thông tin giao hàng và trạng thái vận chuyển
- Review/comment: đánh giá và bình luận sản phẩm
- Feedback/contact: khách gửi liên hệ, admin xử lý phản hồi
- Policy: chính sách đổi trả, bảo hành, vận chuyển, thanh toán
- Store location: địa điểm cửa hàng/showroom kèm Google Maps URL
- Admin: quản lý sản phẩm, danh mục, đơn hàng, thanh toán, vận chuyển, user và dashboard cơ bản

Trong bản lab, thanh toán và vận chuyển chỉ là mock. Dự án không tích hợp thanh toán thật, realtime tracking, microservices, Kafka, Redis, Kubernetes hay CI/CD nâng cao.

## Tech stack

- Java 21
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA / Hibernate
- Spring Validation
- Spring Security + JWT theo scope dự án
- Flyway Migration
- MySQL
- Maven Wrapper
- Lombok
- Swagger/OpenAPI với springdoc-openapi

## Kiến trúc

Dự án dùng layered monolith đơn giản:

```txt
Controller -> Service -> Repository -> Database
```

Quy ước chính:

- Controller chỉ nhận request, gọi Service và trả response.
- Service xử lý nghiệp vụ.
- Repository chỉ truy vấn database.
- Entity mapping với bảng MySQL.
- API request/response dùng DTO, không trả Entity trực tiếp.
- Response nên thống nhất bằng `ApiResponse` và `PageResponse`.

Package backend hiện tại nằm dưới:

```txt
backend/src/main/java/com/example/smartworkspace
```

## Database và Flyway

Schema được quản lý bằng Flyway tại:

```txt
backend/src/main/resources/db/migration
```

Migration hiện có:

- `V1__init_schema.sql`
- `V2__seed_roles.sql`
- `V3__seed_categories.sql`
- `V4__seed_products.sql`

Hibernate chỉ validate schema, không tự tạo hoặc tự cập nhật bảng:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

Nếu cần thay đổi schema sau khi migration đã chạy, tạo migration mới thay vì sửa file cũ.

## Cấu hình local

Yêu cầu:

- Java 21
- MySQL
- Maven Wrapper có sẵn trong thư mục `backend`

Tạo database MySQL:

```sql
CREATE DATABASE smart_workspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Biến môi trường tham khảo trong `env.example`:

```env
DB_URL=jdbc:mysql://localhost:3306/smart_workspace?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=change-this-secret-to-at-least-32-characters
JWT_EXPIRATION_MS=86400000
```

Chạy backend trên Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Chạy backend trên macOS/Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Sau khi chạy thành công:

- Base URL: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## API chính theo scope

Public API:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/slug/{slug}`
- `GET /api/categories`
- `GET /api/policies`
- `GET /api/store-locations`
- `POST /api/feedbacks`

API cần đăng nhập:

- `/api/auth/me`
- `/api/users/me/**`
- `/api/cart/**`
- `/api/orders/**`
- `/api/reviews/**`
- `/api/comments/**`

API admin:

- `/api/admin/**`

Role admin bắt buộc là `ADMIN`.

## Demo flow đề xuất

1. Register user
2. Login user và lấy Bearer token
3. Xem danh sách sản phẩm
4. Search/filter/sort sản phẩm
5. Thêm sản phẩm vào giỏ hàng
6. Tạo đơn hàng từ giỏ hàng
7. Xem lịch sử đơn hàng của user
8. Admin đăng nhập
9. Admin cập nhật trạng thái đơn hàng, thanh toán, vận chuyển
10. User review/comment sản phẩm
11. Khách gửi feedback
12. Public xem policies và store locations

## Tài liệu dự án

Các tài liệu mô tả scope, database, API contract, coding rules và checklist demo nằm trong thư mục `docs`:

- `docs/00-project-context.md`
- `docs/01-backend-scope.md`
- `docs/02-database-design.md`
- `docs/03-api-contract.md`
- `docs/04-agent-task-board.md`
- `docs/05-coding-rules.md`
- `docs/06-flyway-rules.md`
- `docs/07-test-checklist.md`
