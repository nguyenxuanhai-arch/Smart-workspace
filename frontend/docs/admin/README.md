# Admin Frontend Reviews

Thư mục này gom các tài liệu review riêng cho phần admin frontend hiện nằm tại `src/admin`.

## Danh sách file

- `01-architecture-review.md`: review cấu trúc thư mục, router và ranh giới admin/client.
- `02-feature-api-review.md`: review từng màn admin và API backend đang dùng.
- `03-qa-review.md`: checklist kiểm thử thủ công trước khi demo hoặc triển khai.
- `04-backlog-review.md`: các điểm còn thiếu, rủi ro và thứ tự ưu tiên xử lý.
- `05-admin-task-checklist.md`: task checklist có tick `[x]` cho phần đã hoàn thành.

## Phạm vi hiện tại

Admin app được mount từ `src/main.jsx` vào `src/admin/App.jsx`. Toàn bộ route quản trị dùng namespace `/admin`, ví dụ `/admin/login`, `/admin/san-pham`, `/admin/don-hang`.

Phần client hiện chưa có app riêng; `src/client/README.md` đang giữ chỗ để tách giao diện khách hàng về sau.
