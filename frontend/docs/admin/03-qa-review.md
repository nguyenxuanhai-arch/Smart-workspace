# Admin QA Review Checklist

Ngày review: 2026-07-06

## Routing

- `/admin` khi chưa login chuyển về `/admin/login`.
- `/admin/*` render admin app.
- `/*` render client placeholder.
- Route cũ `/login`, `/san-pham`, `/don-hang` redirect sang `/admin/*`.

## Auth

- Login sai hiển thị lỗi.
- Login đúng tài khoản admin lưu session.
- Tài khoản không có role `ADMIN` bị chặn.
- Logout xóa session và quay về `/admin/login`.
- Access token hết hạn được refresh; refresh thất bại thì xóa session.

## Dashboard

- Stats tổng quan tải từ `GET /api/admin/dashboard`.
- Revenue series 7 ngày gần nhất hiển thị trên chart.
- Top sản phẩm bán chạy hiển thị theo `topProducts`.
- Khi chưa có đơn hoàn tất, top sản phẩm hiển thị empty state.

## Sản phẩm

- Admin thấy cả `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`.
- Search và pagination hoạt động.
- Ảnh hiển thị qua `resolveAssetUrl`.
- Xóa sản phẩm reload danh sách.

## Khách hàng

- Danh sách tải từ `GET /api/admin/customers`.
- Search và filter trạng thái hoạt động.
- Khóa/mở khóa gọi `PUT /api/admin/customers/{id}/status`.

## Đánh giá

- Danh sách review tải từ `GET /api/admin/reviews`.
- Search/filter trạng thái hoạt động.
- Ẩn/hiện review gọi `PUT /api/admin/reviews/{id}/status`.

## Marketing

- Voucher tải từ `GET /api/admin/vouchers`.
- Tạo/sửa/xóa voucher gọi đúng API admin.
- Banner tải từ `GET /api/admin/banners`.
- Tạo/sửa/xóa banner gọi đúng API admin.
- Promotion tải từ `GET /api/admin/promotions`.
- Tạo/sửa/xóa promotion gọi đúng API admin.

## Kiểm tra tự động

```bash
cd backend
.\mvnw.cmd -q test

cd frontend
npm.cmd test
npm.cmd run build
```
