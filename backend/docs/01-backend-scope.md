# 01 - Backend Scope

## 1. Mục tiêu backend

Xây dựng backend REST API cho website thương mại điện tử Smart Workspace bằng Java Spring Boot.

Backend phục vụ:
- Giao diện khách hàng
- Giao diện quản trị
- Demo lab cuối kỳ
- Báo cáo môn Thương mại điện tử

---

## 2. Must Have

### 2.1 Auth & User

Cần có:
- Đăng ký tài khoản khách hàng
- Đăng nhập
- Lấy thông tin user hiện tại
- Mã hóa mật khẩu bằng BCrypt
- JWT authentication
- Role CUSTOMER và ADMIN
- Admin có thể xem danh sách người dùng nếu cần
- User có thể quản lý địa chỉ nhận hàng

API chính:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/me/addresses`
- `POST /api/users/me/addresses`
- `PUT /api/users/me/addresses/{id}`
- `DELETE /api/users/me/addresses/{id}`

---

### 2.2 Product Catalog

Cần có:
- Danh sách sản phẩm
- Chi tiết sản phẩm
- Tìm kiếm theo tên/mô tả
- Lọc theo danh mục
- Lọc theo giá
- Sắp xếp theo giá, ngày tạo
- Phân trang
- Giá cũ, giá mới
- Trạng thái sản phẩm
- Ảnh sản phẩm
- Danh mục cha/con nếu cần

API public:
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/slug/{slug}`
- `GET /api/categories`

Query cho `GET /api/products`:
- `search`
- `categoryId`
- `minPrice`
- `maxPrice`
- `sort=price_asc|price_desc|newest`
- `page`
- `size`

API admin:
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `POST /api/admin/uploads/product-images`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`

Ghi chú ảnh sản phẩm:
- Product API vẫn lưu ảnh bằng trường `imageUrls`.
- Nếu admin upload file ảnh từ máy, backend lưu file vào folder local trong project và trả về URL.
- Admin dùng URL trả về để đưa vào `imageUrls` khi tạo hoặc sửa product.

---

### 2.3 Cart

Cần có:
- Mỗi user có một giỏ hàng active
- Xem giỏ hàng
- Thêm sản phẩm vào giỏ
- Nếu sản phẩm đã có trong giỏ thì tăng số lượng
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ
- Tính tổng tiền giỏ hàng

API:
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{itemId}`
- `DELETE /api/cart/items/{itemId}`

---

### 2.4 Order

Cần có:
- Tạo đơn hàng từ giỏ hàng
- Lưu snapshot sản phẩm tại thời điểm mua
- Lưu thông tin người nhận
- Tính tổng tiền
- Tính phí vận chuyển mock
- Áp dụng giảm giá đơn giản nếu có
- Xem lịch sử đơn hàng của user
- Admin quản lý trạng thái đơn hàng

Order status:
- `PENDING`
- `CONFIRMED`
- `SHIPPING`
- `COMPLETED`
- `CANCELLED`

API user:
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/{id}`

API admin:
- `GET /api/admin/orders`
- `GET /api/admin/orders/{id}`
- `PUT /api/admin/orders/{id}/status`

---

### 2.5 Payment

Cần có:
- Thanh toán mock
- COD
- Chuyển khoản ngân hàng
- MoMo
- ZaloPay
- VNPay

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

API:
- `POST /api/payments/{orderId}`
- `PUT /api/admin/payments/{id}/status`

Không tích hợp thanh toán thật trong bản lab.

---

### 2.6 Shipment

Cần có:
- Lưu thông tin giao hàng
- Trạng thái giao hàng mock
- Admin cập nhật trạng thái giao hàng

Shipment status:
- `PENDING`
- `PROCESSING`
- `SHIPPING`
- `DELIVERED`
- `FAILED`
- `RETURNED`

API admin:
- `PUT /api/admin/shipments/{id}/status`

---

### 2.7 Review & Comment

Cần có:
- User đăng nhập mới được đánh giá/bình luận
- Review có rating 1-5
- Mỗi user chỉ nên review một sản phẩm một lần
- Comment có thể trả lời bằng `parent_id`
- Admin có thể ẩn hoặc cập nhật trạng thái review/comment

API:
- `GET /api/products/{productId}/reviews`
- `POST /api/products/{productId}/reviews`
- `GET /api/products/{productId}/comments`
- `POST /api/products/{productId}/comments`

API admin:
- `PUT /api/admin/reviews/{id}/status`
- `PUT /api/admin/comments/{id}/status`

---

### 2.8 Feedback / Contact

Cần có:
- Khách gửi feedback/liên hệ
- Admin xem feedback
- Admin cập nhật trạng thái xử lý

API:
- `POST /api/feedbacks`
- `GET /api/admin/feedbacks`
- `PUT /api/admin/feedbacks/{id}/status`

---

### 2.9 Policy

Cần có:
- Chính sách đổi trả
- Chính sách bảo hành
- Chính sách vận chuyển
- Chính sách thanh toán nếu cần
- Public xem chính sách
- Admin tạo/sửa chính sách

Policy type:
- `RETURN`
- `WARRANTY`
- `SHIPPING`
- `PAYMENT`

API:
- `GET /api/policies`
- `GET /api/policies/{type}`
- `POST /api/admin/policies`
- `PUT /api/admin/policies/{id}`

---

### 2.10 Store Location / Google Maps

Cần có:
- Danh sách địa điểm cửa hàng hoặc showroom
- Địa chỉ
- Số điện thoại
- Latitude
- Longitude
- Google Maps URL

API:
- `GET /api/store-locations`
- `POST /api/admin/store-locations`
- `PUT /api/admin/store-locations/{id}`
- `DELETE /api/admin/store-locations/{id}`

---

### 2.11 Admin

Cần có admin API cho:
- Sản phẩm
- Danh mục
- Đơn hàng
- Thanh toán
- Vận chuyển
- Người dùng
- Review/comment
- Feedback
- Policy
- Store location

Có thể làm thêm dashboard basic:
- Tổng số sản phẩm
- Tổng số đơn hàng
- Tổng doanh thu mock
- Số feedback chưa xử lý

API:
- `GET /api/admin/dashboard`

---

## 3. Nice To Have

Chỉ làm nếu còn thời gian:
- Tách file storage sang cloud nếu cần
- Swagger đầy đủ mô tả API
- Export Postman collection
- Coupon nâng cao
- Email xác nhận đơn hàng mock
- Dashboard thống kê đẹp hơn

---

## 4. Không làm ở bản lab

Không làm:
- Thanh toán thật
- Realtime chat
- Realtime tracking shipper
- Recommendation bằng AI thật
- Microservices
- Redis cache
- Kafka/RabbitMQ
- Docker nâng cao
- Kubernetes
- CI/CD phức tạp

---

## 5. Local File Storage

Bản lab dùng local file storage để admin upload ảnh sản phẩm khi demo.

Không tích hợp Amazon S3 hoặc cloud storage trong phạm vi hiện tại.

Folder lưu file trong project:

```txt
backend/uploads/products
```

URL public đề xuất:

```txt
/uploads/products/{fileName}
```

Use case hỗ trợ trước:
- Product images

Luồng xử lý:
1. Admin gọi API upload ảnh sản phẩm với `multipart/form-data`.
2. Backend validate file.
3. Backend tạo tên file an toàn và không trùng.
4. Backend lưu file vào `backend/uploads/products`.
5. Backend trả về URL dạng `/uploads/products/{fileName}`.
6. Admin đưa URL này vào `imageUrls` khi gọi `POST /api/admin/products` hoặc `PUT /api/admin/products/{id}`.

Quy tắc validate đề xuất:
- Chỉ cho phép file ảnh: `image/jpeg`, `image/png`, `image/webp`.
- Dung lượng tối đa mỗi file: `5MB`.
- Không dùng trực tiếp tên file gốc để lưu.
- Không cho phép path traversal như `../`.
- Folder `uploads` là dữ liệu runtime local, không phải migration database.

Lưu ý demo:
- File local chỉ phù hợp chạy demo trên máy dev.
- Nếu deploy thật, nên thay bằng cloud storage và giữ nguyên contract trả URL để ít ảnh hưởng Product API.
