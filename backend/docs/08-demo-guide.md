# 08 - Demo Guide

Guide này dùng để chạy demo cuối kỳ bằng Swagger hoặc Postman.

Base URL:

```txt
http://localhost:8080/api
```

Swagger:

```txt
http://localhost:8080/swagger-ui/index.html
```

---

## 1. Chuẩn bị

1. MySQL đang chạy.
2. App Spring Boot chạy ở port `8080`.
3. Flyway đã migrate đủ 4 migration.
4. Seed roles, categories, products đã có.

Chạy kiểm tra nhanh:

```powershell
.\mvnw.cmd test
```

---

## 2. Tạo Admin Demo

App seed role `ADMIN` nhưng không seed sẵn admin user. Có thể tạo admin demo như sau:

1. Gọi `POST /api/auth/register`.

```json
{
  "fullName": "Admin Demo",
  "email": "admin-demo@smartworkspace.local",
  "phone": "0909000099",
  "password": "123456"
}
```

2. Gán role admin trong MySQL.

```sql
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r
WHERE u.email = 'admin-demo@smartworkspace.local'
  AND r.name = 'ADMIN';
```

3. Gọi `POST /api/auth/login` với email/password trên để lấy admin token.

---

## 3. Demo Flow Đề Xuất

### Auth

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/auth/me` với customer token
4. Gọi thử `GET /api/admin/dashboard` bằng customer token để thấy `403`

### Product

1. `GET /api/products`
2. `GET /api/products?search=desk`
3. `GET /api/products?sort=price_asc`
4. `GET /api/products?minPrice=100000&maxPrice=5000000`

### Cart, Order, Payment, Shipment

1. `POST /api/cart/items`
2. `GET /api/cart`
3. `PUT /api/cart/items/{itemId}`
4. `POST /api/orders`
5. `GET /api/orders/my`
6. `POST /api/payments/{orderId}`
7. Admin gọi:
   - `PUT /api/admin/orders/{id}/status`
   - `PUT /api/admin/payments/{id}/status`
   - `PUT /api/admin/shipments/{id}/status`

### Review, Comment, Feedback

1. `GET /api/products/{productId}/reviews`
2. `POST /api/products/{productId}/reviews`
3. `GET /api/products/{productId}/comments`
4. `POST /api/products/{productId}/comments`
5. `POST /api/feedbacks`
6. Admin gọi:
   - `PUT /api/admin/reviews/{id}/status`
   - `PUT /api/admin/comments/{id}/status`
   - `GET /api/admin/feedbacks`
   - `PUT /api/admin/feedbacks/{id}/status`

### Policy, Store Location, Dashboard

1. `POST /api/admin/policies`
2. `GET /api/policies`
3. `GET /api/policies/{type}`
4. `POST /api/admin/store-locations`
5. `GET /api/store-locations`
6. `PUT /api/admin/store-locations/{id}`
7. `DELETE /api/admin/store-locations/{id}`
8. `GET /api/admin/dashboard`

---

## 4. Postman

Import:

```txt
docs/postman/smart-workspace-lab.postman_collection.json
docs/postman/smart-workspace-local.postman_environment.json
```

Postman collection có script tự lưu:

- `customerToken`
- `adminToken`
- `productId`
- `cartItemId`
- `orderId`
- `paymentId`
- `shipmentId`
- `reviewId`
- `commentId`
- `feedbackId`
- `policyId`
- `storeLocationId`

Lưu ý:

- Admin request cần user `admin-demo@smartworkspace.local` đã được gán role `ADMIN`.
- Nếu chạy lại collection nhiều lần, các API unique như review một product hoặc policy type có thể trả conflict. Khi cần demo sạch, dùng email customer mới hoặc reset database local.
- Collection ưu tiên flow demo, không thay thế kiểm thử tự động đầy đủ.
