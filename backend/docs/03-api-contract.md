# 03 - API Contract

## 1. Response chung

Tất cả API nên trả theo format:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

API lỗi:

```json
{
  "success": false,
  "message": "Product not found",
  "data": null
}
```

API phân trang:

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

## 2. Auth API

### Register

```txt
POST /api/auth/register
```

Request:

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "0909000000",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Register successfully",
  "data": {
    "id": 1,
    "fullName": "Nguyen Van A",
    "email": "a@example.com"
  }
}
```

---

### Login

```txt
POST /api/auth/login
```

Request:

```json
{
  "email": "a@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "raw-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": 1,
      "fullName": "Nguyen Van A",
      "email": "a@example.com",
      "roles": ["CUSTOMER"]
    }
  }
}
```

---

### Refresh token

```txt
POST /api/auth/refresh
```

Request:

```json
{
  "refreshToken": "raw-refresh-token"
}
```

Response:

```json
{
  "success": true,
  "message": "Refresh token successfully",
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-raw-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

Rule:
- Refresh token hợp lệ thì backend cấp access token mới.
- Backend đồng thời rotate refresh token: revoke token cũ và trả refresh token mới.
- Nếu refresh token sai, đã revoke hoặc hết hạn thì trả lỗi.

---

### Logout

```txt
POST /api/auth/logout
```

Header:

```txt
Authorization: Bearer <access-token>
```

Request:

```json
{
  "refreshToken": "raw-refresh-token"
}
```

Response:

```json
{
  "success": true,
  "message": "Logout successfully",
  "data": null
}
```

Rule:
- Backend revoke refresh token trong database.
- Backend đưa `jti` của access token vào blacklist.
- Access token đã logout không được dùng lại dù chưa hết hạn.

---

### Me

```txt
GET /api/auth/me
```

Header:

```txt
Authorization: Bearer <access-token>
```

---

## 3. Product API

### Get products

```txt
GET /api/products
```

Query:
- `search`
- `categoryId`
- `minPrice`
- `maxPrice`
- `sort=price_asc|price_desc|newest`
- `page`
- `size`

Example:

```txt
GET /api/products?search=desk&categoryId=1&minPrice=1000000&maxPrice=5000000&sort=price_asc&page=0&size=10
```

---

### Get product detail

```txt
GET /api/products/{id}
```

```txt
GET /api/products/slug/{slug}
```

---

### Admin product

```txt
POST /api/admin/products
PUT /api/admin/products/{id}
DELETE /api/admin/products/{id}
```

Upload product image:

```txt
POST /api/admin/uploads/product-images
```

Header:

```txt
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

Form data:

```txt
file: <image-file>
```

Validation:
- Chỉ nhận `image/jpeg`, `image/png`, `image/webp`.
- Dung lượng tối đa mỗi file: `5MB`.
- Nếu file không hợp lệ, trả lỗi `INVALID_REQUEST`.

Response:

```json
{
  "success": true,
  "message": "Upload product image successfully",
  "data": {
    "fileName": "20260605-153000-a1b2c3-desk.jpg",
    "originalFileName": "desk.jpg",
    "contentType": "image/jpeg",
    "size": 245000,
    "url": "/uploads/products/20260605-153000-a1b2c3-desk.jpg"
  }
}
```

File được lưu local trong project:

```txt
backend/uploads/products
```

File public được truy cập bằng:

```txt
GET /uploads/products/{fileName}
```

Lưu ý:
- Endpoint upload chỉ tạo file và trả URL, chưa tạo product.
- Khi tạo hoặc sửa product, client đưa URL đã upload vào `imageUrls`.

Create request:

```json
{
  "categoryId": 1,
  "name": "Smart Standing Desk Basic",
  "slug": "smart-standing-desk-basic",
  "shortDescription": "Bàn nâng hạ thông minh cơ bản",
  "description": "Phù hợp cho góc làm việc tại nhà",
  "price": 4500000,
  "oldPrice": 5200000,
  "stockQuantity": 20,
  "sku": "SW-DESK-001",
  "status": "ACTIVE",
  "imageUrls": [
    "/uploads/products/20260605-153000-a1b2c3-desk.jpg"
  ]
}
```

---

## 4. Category API

Public:

```txt
GET /api/categories
GET /api/categories/{id}
```

Admin:

```txt
POST /api/admin/categories
PUT /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

---

## 5. Cart API

Yêu cầu đăng nhập.

```txt
GET /api/cart
POST /api/cart/items
PUT /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
```

Add cart item request:

```json
{
  "productId": 1,
  "quantity": 2
}
```

Update cart item request:

```json
{
  "quantity": 3
}
```

---

## 6. Order API

Yêu cầu đăng nhập.

User:

```txt
POST /api/orders
GET /api/orders/my
GET /api/orders/{id}
```

Create order request:

```json
{
  "receiverName": "Nguyen Van A",
  "receiverPhone": "0909000000",
  "shippingAddress": "123 Nguyen Trai, Quan 1, TP.HCM",
  "paymentMethod": "COD",
  "note": "Giao giờ hành chính"
}
```

Admin:

```txt
GET /api/admin/orders
GET /api/admin/orders/{id}
PUT /api/admin/orders/{id}/status
```

Update order status request:

```json
{
  "status": "CONFIRMED"
}
```

---

## 7. Payment API

User:

```txt
POST /api/payments/{orderId}
```

Request:

```json
{
  "paymentMethod": "COD"
}
```

Admin:

```txt
PUT /api/admin/payments/{id}/status
```

Request:

```json
{
  "paymentStatus": "PAID"
}
```

---

## 8. Shipment API

Admin:

```txt
PUT /api/admin/shipments/{id}/status
```

Request:

```json
{
  "shippingStatus": "SHIPPING",
  "trackingCode": "GHN123456",
  "carrierName": "GHN"
}
```

---

## 9. Review API

Public:

```txt
GET /api/products/{productId}/reviews
```

User:

```txt
POST /api/products/{productId}/reviews
```

Request:

```json
{
  "rating": 5,
  "content": "Ghế ngồi rất thoải mái, phù hợp làm việc lâu."
}
```

Admin:

```txt
PUT /api/admin/reviews/{id}/status
```

Request:

```json
{
  "status": "HIDDEN"
}
```

---

## 10. Comment API

Public:

```txt
GET /api/products/{productId}/comments
```

User:

```txt
POST /api/products/{productId}/comments
```

Request comment gốc:

```json
{
  "content": "Bàn này có bảo hành không?",
  "parentId": null
}
```

Request reply:

```json
{
  "content": "Sản phẩm được bảo hành 12 tháng nhé.",
  "parentId": 1
}
```

Admin:

```txt
PUT /api/admin/comments/{id}/status
```

---

## 11. Feedback API

Public:

```txt
POST /api/feedbacks
```

Request:

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "0909000000",
  "subject": "Tư vấn sản phẩm",
  "message": "Tôi muốn tư vấn combo setup cho phòng nhỏ."
}
```

Admin:

```txt
GET /api/admin/feedbacks
PUT /api/admin/feedbacks/{id}/status
```

---

## 12. Policy API

Public:

```txt
GET /api/policies
GET /api/policies/{type}
```

Admin:

```txt
POST /api/admin/policies
PUT /api/admin/policies/{id}
```

Policy type:
- `RETURN`
- `WARRANTY`
- `SHIPPING`
- `PAYMENT`

---

## 13. Store Location API

Public:

```txt
GET /api/store-locations
```

Admin:

```txt
POST /api/admin/store-locations
PUT /api/admin/store-locations/{id}
DELETE /api/admin/store-locations/{id}
```

Create request:

```json
{
  "name": "Smart Workspace HCM",
  "address": "Quận 1, TP.HCM",
  "phone": "0909000000",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "googleMapUrl": "https://maps.google.com/..."
}
```

---

## 14. Admin Dashboard API

Admin:

```txt
GET /api/admin/dashboard
```

Response data đề xuất:
- `totalProducts`
- `totalOrders`
- `totalRevenue`
- `newFeedbacks`
- `pendingOrders`
