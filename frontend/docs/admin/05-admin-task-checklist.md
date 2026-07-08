# Admin Task Checklist

Ngày cập nhật: 2026-07-06

## Đã hoàn thành

- [x] Tách toàn bộ admin frontend vào `src/admin`.
- [x] Namespace router admin dưới `/admin`.
- [x] Tạo root app tách `/admin/*` và `/*` cho client.
- [x] Giữ redirect route admin cũ về route `/admin/*`.
- [x] Thêm `GET /api/admin/products` để admin thấy cả `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`.
- [x] Nối màn sản phẩm với `GET /api/admin/products`.
- [x] Thêm `GET /api/admin/customers`.
- [x] Thêm `PUT /api/admin/customers/{id}/status`.
- [x] Nối màn khách hàng với API thật.
- [x] Thêm `GET /api/admin/reviews`.
- [x] Nối màn đánh giá với API admin thật.
- [x] Thêm `productName` vào response review admin.
- [x] Thêm CRUD `Promotion` ở backend qua `/api/admin/promotions`.
- [x] Nối tab chương trình khuyến mại với API promotion thật.
- [x] Thiết kế schema/API riêng cho voucher code.
- [x] Nối tab mã giảm giá với API voucher thật.
- [x] Thiết kế schema/API riêng cho banner.
- [x] Nối tab banner với API banner thật.
- [x] Thêm dashboard revenue series thật.
- [x] Thêm top sản phẩm bán chạy vào dashboard admin.
- [x] Thêm backend integration test cho voucher/banner/dashboard.
- [x] Thêm frontend test cơ bản cho protected route và token storage.
- [x] Thêm docs review admin trong `frontend/docs/admin`.
- [x] Chạy `backend: .\mvnw.cmd -q -DskipTests compile`.
- [x] Chạy `backend: .\mvnw.cmd -q test`.
- [x] Chạy `frontend: npm.cmd test`.
- [x] Chạy `frontend: npm.cmd run build`.

## Còn lại

- [ ] Chuẩn hóa component bảng dùng chung cho admin.
- [ ] Thay `window.confirm` bằng confirm dialog chung.
- [ ] Mở rộng frontend tests cho form voucher/banner/promotion.

## Endpoint admin mới

```text
GET    /api/admin/customers
PUT    /api/admin/customers/{id}/status
GET    /api/admin/reviews
PUT    /api/admin/reviews/{id}/status
GET    /api/admin/promotions
GET    /api/admin/promotions/{id}
POST   /api/admin/promotions
PUT    /api/admin/promotions/{id}
DELETE /api/admin/promotions/{id}
GET    /api/admin/vouchers
GET    /api/admin/vouchers/{id}
POST   /api/admin/vouchers
PUT    /api/admin/vouchers/{id}
DELETE /api/admin/vouchers/{id}
GET    /api/admin/banners
GET    /api/admin/banners/{id}
POST   /api/admin/banners
PUT    /api/admin/banners/{id}
DELETE /api/admin/banners/{id}
```
