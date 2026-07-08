# Admin Backlog Review

Ngày review: 2026-07-06

## Còn lại

### 1. Chuẩn hóa component bảng

Nhiều màn admin đang lặp table với loading row, empty row, action column và pagination. Có thể tạo `AdminTable` khi UI ổn định hơn.

### 2. Thêm confirm dialog chung

Hiện một số thao tác xóa dùng `window.confirm`. Nên thay bằng dialog chung để UX đồng nhất và dễ kiểm soát keyboard/focus.

### 3. Mở rộng frontend tests

Đã có test cơ bản cho protected route và token storage. Có thể mở rộng thêm test cho form voucher/banner/promotion, token refresh và route root admin/client.

## Definition of Done cho admin

- Build frontend pass.
- Admin route nằm dưới `/admin`.
- Client route có boundary riêng dưới `src/client`.
- Màn dùng dữ liệu thật có loading/empty/error.
- API mới đặt trong `src/admin/api`.
- Backend endpoint admin có test tích hợp tối thiểu.
- Docs review được cập nhật khi thêm hoặc đổi endpoint.
