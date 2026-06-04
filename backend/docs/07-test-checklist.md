# 07 - Test Checklist

## 1. Mục tiêu test

Checklist này dùng để test backend Smart Workspace bằng Swagger hoặc Postman.

Ưu tiên test flow chính để demo lab cuối kỳ.

---

## 2. Chuẩn bị

Trước khi test:

- [ ] MySQL đang chạy
- [ ] Database tạo được
- [ ] Flyway migration chạy thành công
- [ ] App Spring Boot chạy ở port 8080
- [ ] Swagger mở được nếu có cấu hình
- [ ] Có seed roles ADMIN và CUSTOMER
- [ ] Có seed categories
- [ ] Có seed products mẫu

Base URL:

```txt
http://localhost:8080/api
```

---

## 3. Auth Flow

### Register

- [ ] Gọi `POST /auth/register`
- [ ] Tạo user CUSTOMER thành công
- [ ] Password được hash trong database
- [ ] Không lưu password plain text

### Login

- [ ] Gọi `POST /auth/login`
- [ ] Nhận được accessToken
- [ ] Token type là Bearer
- [ ] Sai password trả lỗi hợp lý

### Me

- [ ] Gọi `GET /auth/me` với token
- [ ] Trả đúng thông tin user hiện tại
- [ ] Không có token thì bị 401

---

## 4. Authorization Flow

- [ ] API public gọi được không cần token
- [ ] API user không có token thì bị 401
- [ ] API admin dùng CUSTOMER token thì bị 403
- [ ] API admin dùng ADMIN token thì gọi được

---

## 5. Product Flow

### Public products

- [ ] `GET /products` trả danh sách sản phẩm
- [ ] `GET /products/{id}` trả chi tiết sản phẩm
- [ ] `GET /products/slug/{slug}` trả chi tiết sản phẩm
- [ ] Product response có category
- [ ] Product response có images
- [ ] Product response có price/oldPrice nếu có

### Search/filter/sort

- [ ] Search theo keyword hoạt động
- [ ] Filter theo category hoạt động
- [ ] Filter theo minPrice/maxPrice hoạt động
- [ ] Sort `price_asc` hoạt động
- [ ] Sort `price_desc` hoạt động
- [ ] Sort `newest` hoạt động
- [ ] Pagination hoạt động

### Admin products

- [ ] ADMIN tạo product thành công
- [ ] ADMIN sửa product thành công
- [ ] ADMIN xóa mềm product thành công
- [ ] CUSTOMER không được gọi admin product API

---

## 6. Category Flow

- [ ] `GET /categories` trả danh sách danh mục
- [ ] ADMIN tạo category thành công
- [ ] ADMIN sửa category thành công
- [ ] ADMIN xóa category thành công hoặc chuyển status inactive

---

## 7. Cart Flow

- [ ] User login lấy token
- [ ] `GET /cart` trả giỏ hàng active
- [ ] `POST /cart/items` thêm sản phẩm vào giỏ
- [ ] Thêm lại cùng product thì tăng số lượng hoặc cập nhật quantity đúng logic
- [ ] `PUT /cart/items/{itemId}` cập nhật số lượng
- [ ] `DELETE /cart/items/{itemId}` xóa item
- [ ] Cart total tính đúng
- [ ] User không xem được cart của user khác

---

## 8. Order Flow

- [ ] Cart có sản phẩm
- [ ] Gọi `POST /orders` tạo order
- [ ] Order tạo từ cart thành công
- [ ] Order items lưu snapshot sản phẩm
- [ ] Tổng tiền tính đúng
- [ ] Sau khi tạo order, cart được clear
- [ ] `GET /orders/my` trả đơn hàng của user
- [ ] `GET /orders/{id}` trả chi tiết order
- [ ] User không xem được order của user khác

---

## 9. Payment Flow

- [ ] Tạo order với payment method COD
- [ ] Tạo order với payment method BANK_TRANSFER
- [ ] Tạo order với payment method MOMO mock
- [ ] Tạo order với payment method ZALOPAY mock
- [ ] Tạo order với payment method VNPAY mock
- [ ] ADMIN cập nhật payment status thành PAID
- [ ] Payment status trả đúng trong order detail

---

## 10. Shipment Flow

- [ ] Khi tạo order có shipment mock
- [ ] ADMIN cập nhật shipment status
- [ ] Shipment status trả đúng trong order detail
- [ ] Có trackingCode/carrierName nếu admin cập nhật

---

## 11. Review Flow

- [ ] User login mới tạo review được
- [ ] Rating 1-5 hợp lệ
- [ ] Rating ngoài 1-5 bị lỗi validation
- [ ] `GET /products/{productId}/reviews` xem review public
- [ ] Nếu áp dụng unique, user không review một product nhiều lần
- [ ] ADMIN ẩn review được

---

## 12. Comment Flow

- [ ] User login mới comment được
- [ ] Comment gốc có `parentId = null`
- [ ] Reply comment có `parentId`
- [ ] `GET /products/{productId}/comments` trả comment và reply
- [ ] ADMIN ẩn comment được

---

## 13. Feedback Flow

- [ ] Khách gửi feedback không cần login
- [ ] Validate email nếu có email
- [ ] ADMIN xem danh sách feedback
- [ ] ADMIN cập nhật feedback status

---

## 14. Policy Flow

- [ ] Public xem danh sách policy
- [ ] Public xem policy theo type
- [ ] ADMIN tạo policy
- [ ] ADMIN sửa policy
- [ ] Policy type gồm RETURN, WARRANTY, SHIPPING, PAYMENT

---

## 15. Store Location Flow

- [ ] Public xem store locations
- [ ] Response có address, latitude, longitude, googleMapUrl
- [ ] ADMIN tạo location
- [ ] ADMIN sửa location
- [ ] ADMIN xóa hoặc inactive location

---

## 16. Admin Dashboard Flow

- [ ] ADMIN gọi `GET /admin/dashboard`
- [ ] Có tổng sản phẩm
- [ ] Có tổng đơn hàng
- [ ] Có tổng doanh thu mock
- [ ] Có số đơn pending
- [ ] Có số feedback mới

---

## 17. Final Demo Flow

Demo nên đi theo thứ tự:

1. Register user
2. Login user
3. Xem products
4. Search/filter/sort products
5. Thêm product vào cart
6. Xem cart
7. Tạo order
8. Xem orders của user
9. Admin login
10. Admin xem orders
11. Admin cập nhật order status
12. User review sản phẩm
13. User comment sản phẩm
14. Khách gửi feedback
15. Public xem policies
16. Public xem store locations/Google Maps URL
