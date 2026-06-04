# AGENTS.md - Smart Workspace Backend

## 1. Project

Smart Workspace là backend cho website thương mại điện tử bán sản phẩm setup phòng làm việc thông minh.

Sản phẩm chính:
- Bàn nâng hạ thông minh
- Ghế công thái học
- Giá đỡ laptop
- Đèn màn hình chống lóa
- Phụ kiện setup bàn làm việc
- Combo setup: Creator Setup, Coder Setup, Hybrid Worker Setup

Mục tiêu của backend là phục vụ lab project môn Thương mại điện tử. Ưu tiên:
- Đúng yêu cầu đề bài
- Code rõ ràng, dễ hiểu
- Dễ demo bằng Swagger/Postman
- Không làm kiến trúc quá phức tạp

---

## 2. Required Tech Stack

Backend bắt buộc dùng:

- Java 17 hoặc Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA / Hibernate ORM
- Spring Security + JWT
- Flyway Migration
- MySQL
- Maven
- Lombok
- Swagger/OpenAPI

Không được tự ý đổi sang:
- Node.js
- Express
- NestJS
- Prisma
- MongoDB
- GraphQL

---

## 3. Architecture

Dự án dùng **Layered Monolith đơn giản**.

Không dùng modular monolith.
Không chia package theo module nghiệp vụ.
Không dùng thư mục `module/`.

Cấu trúc package chính:

```txt
com.smartworkspace.backend
├── config
├── security
├── common
├── entity
├── repository
├── service
├── controller
├── dto
├── mapper
└── enums
```

Luồng xử lý bắt buộc:

```txt
Controller -> Service -> Repository -> Database
```

Quy tắc:
- Controller chỉ nhận request, gọi Service và trả response.
- Service xử lý nghiệp vụ.
- Repository chỉ truy vấn database.
- Entity mapping với bảng MySQL.
- DTO dùng cho request/response API.
- Không để Controller gọi Repository trực tiếp.
- Không trả Entity trực tiếp ra API.

---

## 4. Database Rule

Database schema được quản lý bằng Flyway.

Migration nằm tại:

```txt
src/main/resources/db/migration
```

File migration đặt theo format:

```txt
V1__init_schema.sql
V2__seed_roles.sql
V3__seed_categories.sql
V4__seed_products.sql
```

Trong `application.yml`, bắt buộc dùng:

```yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

Không dùng:
- `ddl-auto: update`
- `ddl-auto: create`
- `ddl-auto: create-drop`

Nếu cần đổi schema sau khi đã chạy migration, tạo file migration mới, không sửa migration cũ.

---

## 5. Security Rule

API public:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`
- `GET /api/policies`
- `GET /api/store-locations`
- `POST /api/feedbacks`

API cần đăng nhập:
- `/api/auth/me`
- `/api/cart/**`
- `/api/orders/**`
- `/api/reviews/**`
- `/api/comments/**`
- `/api/users/me/**`

API admin:
- `/api/admin/**`

API admin bắt buộc role:

```txt
ADMIN
```

---

## 6. Working Rule For Codex / Cursor / Antigravity

Trước khi code, agent phải đọc:

1. `AGENTS.md`
2. `docs/00-project-context.md`
3. `docs/01-backend-scope.md`
4. `docs/02-database-design.md`
5. `docs/03-api-contract.md`
6. `docs/04-agent-task-board.md`
7. `docs/05-coding-rules.md`
8. `docs/06-flyway-rules.md`
9. `docs/07-test-checklist.md`

Sau khi đọc xong, agent phải tóm tắt:
1. Hiểu project là gì
2. Stack sẽ dùng
3. Kiến trúc sẽ dùng
4. Phase hoặc chức năng chuẩn bị làm
5. File dự kiến tạo/sửa

Agent phải chờ xác nhận trước khi code nếu task chưa rõ.

---

## 7. Scope Rule

Không tự thêm tính năng ngoài scope lab.

Không làm:
- Microservices
- Clean Architecture phức tạp
- Domain Driven Design phức tạp
- Kafka
- RabbitMQ
- Redis
- Elasticsearch
- Kubernetes
- CI/CD nâng cao
- Thanh toán thật
- AI recommendation thật
- Realtime tracking shipper

Ưu tiên hoàn thành các chức năng chính trước:
- Auth
- Product catalog
- Search/filter/sort
- Cart
- Order
- Payment mock
- Review/comment
- Feedback/contact
- Policy
- Store location / Google Maps
- Admin
