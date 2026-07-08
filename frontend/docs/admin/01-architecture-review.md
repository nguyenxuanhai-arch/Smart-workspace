# Admin Architecture Review

Ngày review: 2026-07-06

## Kết luận nhanh

Phần admin đã được tách đúng hướng vào `src/admin`. Root `src/main.jsx` chỉ còn nhiệm vụ mount admin app, giúp chuẩn bị tốt hơn cho việc thêm client app sau này.

## Cấu trúc hiện tại

```text
src/
├── admin/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── routes.js
├── client/
│   └── README.md
├── index.css
└── main.jsx
```

## Router

`src/admin/routes.js` đang là nguồn khai báo route tập trung:

| Route | Mục đích |
|---|---|
| `/admin` | Dashboard |
| `/admin/login` | Đăng nhập admin |
| `/admin/san-pham` | Danh sách sản phẩm |
| `/admin/danh-muc` | Form thêm/sửa sản phẩm và quản lý danh mục |
| `/admin/don-hang` | Quản lý đơn hàng |
| `/admin/khach-hang` | Quản lý khách hàng |
| `/admin/danh-gia` | Quản lý đánh giá |
| `/admin/marketing` | Voucher, banner, chương trình khuyến mại |
| `/admin/chinh-sach` | Chính sách |
| `/admin/chi-nhanh` | Chi nhánh/cửa hàng |

Các route cũ như `/login`, `/san-pham`, `/don-hang` vẫn được redirect về route `/admin/*`, giúp tránh gãy link trong lúc chuyển cấu trúc.

## Điểm tốt

- Admin đã có boundary rõ trong `src/admin`.
- API layer nằm riêng trong `src/admin/api`, không gọi axios trực tiếp rải rác ở nhiều nơi.
- Auth, protected route và redirect login đều dùng `ADMIN_ROUTES`.
- Layout admin được tách thành `Layout`, `Header`, `Sidebar`, `ProtectedRoute`.
- Các màn dữ liệu quan trọng đều có loading/empty/error ở mức cơ bản.

## Điểm cần chú ý

- `main.jsx` hiện mount trực tiếp admin app. Khi thêm client, nên đổi sang root router cấp cao hơn hoặc entry app chung để chọn `/admin/*` và client routes.
- `src/client` mới là placeholder, chưa có app thật.
- Một số màn admin vẫn chứa mock data trong component, nên cần tách ra file mock hoặc thay bằng API thật.
- Chưa thấy test frontend cho route/auth/API behavior.

## Khuyến nghị kiến trúc tiếp theo

1. Giữ mọi file quản trị trong `src/admin`, không import ngược từ `src/client`.
2. Khi tạo client app, thêm `src/client/App.jsx` và một `src/App.jsx` root để route `/admin/*` vào admin, các route còn lại vào client.
3. Nếu API dùng chung cho admin và client, cân nhắc tách `src/shared/api/http.js`; còn hiện tại giữ trong `src/admin/api` là hợp lý vì frontend mới có admin.
4. Tạo component dùng chung trong admin như `AdminTable`, `StatusBadge`, `ConfirmDialog`, `Pagination` khi bắt đầu lặp lại nhiều.
