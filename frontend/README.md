# Admin Dashboard — Smart Workspace

Frontend React (Vite + Tailwind + Recharts) đã được nối với backend Spring Boot **Smart Workspace** (repo bạn gửi).

## 1. Chạy backend trước

```bash
cd Smart-workspace-main/backend
# tạo database MySQL "smart_workspace", cấu hình DB_USERNAME/DB_PASSWORD nếu khác mặc định
./mvnw spring-boot:run
```

Backend chạy ở `http://localhost:8080`. Cần có sẵn 1 tài khoản có role `ADMIN` (đăng ký qua
`POST /api/auth/register` rồi gán role ADMIN trong bảng `user_roles`, vì API register mặc định gán role CUSTOMER).

## 2. Chạy frontend

```bash
npm install
npm run dev
```

Vite dev server tự động proxy `/api` và `/uploads` sang `http://localhost:8080` (xem `vite.config.js`),
nên không bị lỗi CORS dù backend chưa cấu hình CORS.

Truy cập `http://localhost:5173`, đăng nhập bằng tài khoản ADMIN.

## 3. Các trang đã nối dữ liệu thật

| Trang | API |
|---|---|
| Đăng nhập | `POST /api/auth/login`, `GET /api/auth/me`, refresh token tự động |
| Dashboard | `GET /api/admin/dashboard` (4 chỉ số thật; biểu đồ theo ngày & top sản phẩm vẫn là minh họa vì backend chưa có endpoint) |
| Sản Phẩm | `GET /api/products`, xóa qua `DELETE /api/admin/products/{id}` |
| Danh Mục (thêm/sửa SP + quản lý danh mục) | `POST/PUT /api/admin/products`, upload ảnh `POST /api/admin/uploads/product-images`, `GET/POST/DELETE /api/admin/categories` |
| Đơn Hàng | `GET /api/admin/orders`, cập nhật trạng thái `PUT /api/admin/orders/{id}/status` |
| Đánh Giá | Gộp từ `GET /api/products/{id}/reviews` theo từng sản phẩm, ẩn/hiện qua `PUT /api/admin/reviews/{id}/status` |
| Chính Sách | `GET/POST/PUT /api/policies`, `/api/admin/policies` (loại RETURN / WARRANTY / SHIPPING) |
| Chi Nhánh | `GET/POST/PUT/DELETE /api/store-locations`, `/api/admin/store-locations` |

## 4. Các trang vẫn là dữ liệu mẫu (chưa có API tương ứng trong backend)

- **Khách Hàng**: backend không có endpoint admin liệt kê user/khách hàng, cũng không phân loại B2C/B2B.
- **Marketing** (Mã giảm giá / Banner / Chương trình khuyến mại): có entity `Promotion` trong backend
  nhưng chưa có controller/service nào xử lý — cần bổ sung API nếu muốn dùng thật.

Khi backend bổ sung các endpoint trên, chỉ cần thêm file mới trong `src/api/` theo đúng pattern các
file hiện có (`products.js`, `orders.js`,...) rồi nối vào trang tương ứng.
