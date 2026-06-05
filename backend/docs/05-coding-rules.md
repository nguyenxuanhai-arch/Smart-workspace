# 05 - Coding Rules

## 1. Tech Stack Rules

Backend bắt buộc dùng:

- Java 17 hoặc Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA / Hibernate
- Spring Security + JWT
- Flyway
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

Dự án này là lab project môn Thương mại điện tử, nên ưu tiên code rõ ràng, dễ hiểu, dễ demo.

---

## 2. Architecture Rules

Dùng **Layered Monolith đơn giản**.

Không dùng modular monolith.
Không chia package theo module nghiệp vụ.
Không dùng thư mục `module/`.

Cấu trúc package chính:

```txt
com.example.smartworkspace
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

Controller chỉ nhận request và gọi Service.

Service xử lý nghiệp vụ chính.

Repository chỉ truy vấn database.

Entity mapping với bảng trong MySQL.

DTO dùng cho request/response API.

Không để Controller gọi Repository trực tiếp.

---

## 3. Package Naming Rules

Package gốc:

```txt
com.example.smartworkspace
```

Tên package dùng chữ thường, không dùng dấu gạch ngang.

Ví dụ đúng:

```txt
com.example.smartworkspace.controller
com.example.smartworkspace.service
com.example.smartworkspace.repository
com.example.smartworkspace.entity
com.example.smartworkspace.dto.product
```

Ví dụ sai:

```txt
com.example.smartworkspace.ProductModule
com.example.smartworkspace.product-module
com.example.smartworkspace.module.product
```

---

## 4. Entity Rules

Entity phải khớp với database schema trong Flyway migration.

Không tự ý để Hibernate tự tạo bảng.

Trong `application.yml` bắt buộc dùng:

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

Mỗi entity nên có các field cơ bản nếu phù hợp:

```txt
createdAt
updatedAt
```

Không trả Entity trực tiếp ra API response. Phải dùng DTO Response.

---

## 5. DTO Rules

API nhận dữ liệu bằng Request DTO.

API trả dữ liệu bằng Response DTO.

Không dùng Entity làm request body.

Ví dụ đúng:

```java
@PostMapping
public ApiResponse<ProductResponse> createProduct(
    @Valid @RequestBody ProductCreateRequest request
) {
    return ApiResponse.success(productService.create(request));
}
```

Ví dụ sai:

```java
@PostMapping
public Product createProduct(@RequestBody Product product) {
    return productRepository.save(product);
}
```

---

## 6. Response Format Rules

Tất cả API nên trả response thống nhất bằng `ApiResponse`.

Format đề xuất:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Với API phân trang, dùng `PageResponse`.

Format đề xuất:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10
  }
}
```

---

## 7. Validation Rules

Request DTO phải dùng validation nếu có dữ liệu đầu vào.

Ví dụ:

```java
@NotBlank
private String name;

@NotNull
@Min(0)
private BigDecimal price;

@Email
private String email;
```

Controller phải dùng `@Valid`.

---

## 8. Exception Rules

Không throw exception lung tung trong Controller.

Nên dùng:

```java
throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
```

Tất cả lỗi xử lý tập trung trong:

```txt
common/GlobalExceptionHandler.java
```

Các lỗi thường gặp nên có trong `ErrorCode`:

```txt
USER_NOT_FOUND
PRODUCT_NOT_FOUND
CATEGORY_NOT_FOUND
ORDER_NOT_FOUND
UNAUTHORIZED
FORBIDDEN
INVALID_REQUEST
EMAIL_ALREADY_EXISTS
CART_ITEM_NOT_FOUND
```

---

## 9. Security Rules

API public:

```txt
POST /api/auth/register
POST /api/auth/login
GET /api/products
GET /api/products/{id}
GET /api/products/slug/{slug}
GET /api/categories
GET /api/policies
GET /api/store-locations
POST /api/feedbacks
GET /uploads/products/**
```

API cần đăng nhập:

```txt
/api/auth/me
/api/users/me/**
/api/cart/**
/api/orders/**
/api/reviews/**
/api/comments/**
```

API admin:

```txt
/api/admin/**
```

API admin bắt buộc role:

```txt
ADMIN
```

Không hard-code password, JWT secret hoặc database password trong code Java.

---

## 10. Repository Rules

Repository kế thừa `JpaRepository`.

Ví dụ:

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
}
```

Chỉ viết query custom khi thật sự cần.

Search/filter/sort sản phẩm có thể dùng:

- `JpaSpecificationExecutor`
- hoặc query method đơn giản
- hoặc `@Query` nếu cần rõ ràng hơn

Với lab project, ưu tiên cách dễ hiểu.

---

## 11. Service Rules

Service phải là nơi xử lý nghiệp vụ.

Ví dụ nghiệp vụ nên nằm trong Service:

- Tạo đơn hàng từ giỏ hàng
- Tính tổng tiền
- Kiểm tra sản phẩm tồn tại
- Kiểm tra quyền sở hữu đơn hàng
- Clear cart sau khi đặt hàng
- Cập nhật trạng thái đơn

Service public method nên đặt tên rõ nghĩa:

```java
createOrderFromCart()
addItemToCart()
updateOrderStatus()
getProductDetail()
```

---

## 12. Controller Rules

Controller chỉ nhận request, gọi service và trả response.

Không viết logic tính toán trong Controller.

Endpoint dùng danh từ số nhiều.

Ví dụ đúng:

```txt
GET /api/products
POST /api/cart/items
GET /api/orders/my
PUT /api/admin/orders/{id}/status
```

Ví dụ không nên:

```txt
GET /api/getAllProducts
POST /api/createNewProduct
```

---

## 13. Mapper Rules

Nếu mapping đơn giản, có thể tự viết mapper class.

Ví dụ:

```java
@Component
public class ProductMapper {
    public ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
            .id(product.getId())
            .name(product.getName())
            .price(product.getPrice())
            .build();
    }
}
```

Không cần dùng MapStruct nếu làm project lab và chưa cần thiết.

---

## 14. Flyway Rules

Schema database tạo bằng Flyway migration trong:

```txt
src/main/resources/db/migration
```

Tên file migration:

```txt
V1__init_schema.sql
V2__seed_roles.sql
V3__seed_categories.sql
V4__seed_products.sql
```

Không sửa migration cũ nếu đã chạy.

Nếu cần đổi schema, tạo migration mới:

```txt
V5__alter_products_add_discount_price.sql
```

---

## 15. Naming Rules

Tên class:

```txt
ProductController
ProductService
ProductRepository
ProductResponse
ProductCreateRequest
```

Tên biến dùng camelCase:

```java
productName
discountPrice
createdAt
```

Tên table database dùng snake_case:

```sql
product_images
order_items
store_locations
```

Tên enum dùng UPPER_CASE:

```java
PENDING
CONFIRMED
SHIPPING
COMPLETED
CANCELLED
```

---

## 16. Comment Rules

Không cần comment quá nhiều.

Chỉ comment khi logic khó hiểu.

Không viết comment tiếng Anh phức tạp nếu không cần.

Code phải tự rõ nghĩa qua tên class, tên method, tên biến.

---

## 17. Test Rules

Sau khi làm xong mỗi chức năng, cần có hướng dẫn test bằng Postman hoặc Swagger.

Ưu tiên test các flow chính:

1. Register
2. Login
3. Lấy token
4. Xem danh sách sản phẩm
5. Thêm sản phẩm vào giỏ
6. Tạo đơn hàng
7. Admin cập nhật đơn hàng
8. User đánh giá sản phẩm
9. Gửi feedback

---

## 18. Scope Rules

Không tự thêm tính năng ngoài scope lab.

Không làm các phần sau nếu chưa được yêu cầu:

- Microservices
- Modular monolith
- Clean Architecture phức tạp
- Domain Driven Design phức tạp
- Redis cache
- Kafka/RabbitMQ
- Thanh toán thật
- AI recommendation thật
- Realtime chat
- Realtime tracking shipper
- Docker nâng cao
- Kubernetes
- CI/CD phức tạp

Ưu tiên hoàn thành chức năng chính trước.

---

## 19. Local File Storage Rules

Upload file local chỉ dùng cho demo lab, trước mắt áp dụng cho ảnh sản phẩm.

Folder lưu file:

```txt
backend/uploads/products
```

Endpoint đề xuất:

```txt
POST /api/admin/uploads/product-images
```

Quy tắc:

- Chỉ admin được upload ảnh sản phẩm.
- Controller nhận `multipart/form-data` với field `file`.
- Service xử lý validate, tạo tên file an toàn, lưu file, trả URL.
- Không lưu binary file vào database.
- Product vẫn lưu ảnh bằng trường `imageUrls`.
- API upload trả URL dạng `/uploads/products/{fileName}` để client đưa vào `imageUrls`.
- Không dùng trực tiếp tên file gốc làm tên file lưu trên server.
- Không cho phép path traversal như `../`.
- Chỉ nhận `image/jpeg`, `image/png`, `image/webp`.
- Dung lượng tối đa mỗi file là `5MB`.
- Không cần tạo Flyway migration cho folder upload local.

Nếu sau này đổi sang cloud storage, giữ nguyên response URL để Product API ít phải thay đổi.
