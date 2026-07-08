# Admin Feature And API Review

Ngày review: 2026-07-06

## Tổng quan

Admin frontend hiện đã nối backend thật cho các luồng chính: đăng nhập, dashboard, sản phẩm, danh mục, đơn hàng, khách hàng, đánh giá, marketing, chính sách và chi nhánh.

## Mapping màn hình và API

| Màn admin | File chính | Trạng thái | API đang dùng |
|---|---|---|---|
| Đăng nhập | `src/admin/pages/Login.jsx` | Dùng API thật | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` |
| Dashboard | `src/admin/pages/Dashboard.jsx` | Dùng API thật | `GET /api/admin/dashboard` gồm stats, revenue series và top sản phẩm |
| Sản phẩm | `src/admin/pages/Products.jsx` | Dùng API thật | `GET /api/admin/products`, `DELETE /api/admin/products/{id}` |
| Thêm/sửa sản phẩm | `src/admin/pages/AddProduct.jsx` | Dùng API thật | `GET /api/admin/products/{id}`, `POST /api/admin/products`, `PUT /api/admin/products/{id}`, `POST /api/admin/uploads/product-images` |
| Danh mục | `src/admin/pages/AddProduct.jsx` | Dùng API thật | `GET /api/categories`, `POST /api/admin/categories`, `DELETE /api/admin/categories/{id}` |
| Đơn hàng | `src/admin/pages/Orders.jsx` | Dùng API thật | `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` |
| Khách hàng | `src/admin/pages/Customers.jsx` | Dùng API thật | `GET /api/admin/customers`, `PUT /api/admin/customers/{id}/status` |
| Đánh giá | `src/admin/pages/Reviews.jsx` | Dùng API thật | `GET /api/admin/reviews`, `PUT /api/admin/reviews/{id}/status` |
| Marketing | `src/admin/pages/Marketing.jsx` | Dùng API thật | `/api/admin/vouchers`, `/api/admin/banners`, `/api/admin/promotions` |
| Chính sách | `src/admin/pages/Policy.jsx` | Dùng API thật | `GET /api/policies`, `POST /api/admin/policies`, `PUT /api/admin/policies/{id}` |
| Chi nhánh | `src/admin/pages/Branches.jsx` | Dùng API thật | `GET /api/store-locations`, `POST/PUT/DELETE /api/admin/store-locations` |

## API layer

`src/admin/api/http.js` xử lý `VITE_API_BASE_URL`, `VITE_ASSET_BASE_URL`, access token, refresh token, redirect `/admin/login` khi hết session và helper `unwrap()`.

Các domain API đã có:

```text
auth.js
banners.js
categories.js
customers.js
dashboard.js
orders.js
policies.js
products.js
promotions.js
reviews.js
storeLocations.js
uploads.js
vouchers.js
```

## Marketing

Voucher:

```text
GET    /api/admin/vouchers
GET    /api/admin/vouchers/{id}
POST   /api/admin/vouchers
PUT    /api/admin/vouchers/{id}
DELETE /api/admin/vouchers/{id}
```

Banner:

```text
GET    /api/admin/banners
GET    /api/admin/banners/{id}
POST   /api/admin/banners
PUT    /api/admin/banners/{id}
DELETE /api/admin/banners/{id}
```

Promotion:

```text
GET    /api/admin/promotions
GET    /api/admin/promotions/{id}
POST   /api/admin/promotions
PUT    /api/admin/promotions/{id}
DELETE /api/admin/promotions/{id}
```

## Dashboard

`GET /api/admin/dashboard` trả:

- Tổng sản phẩm.
- Tổng đơn hàng.
- Tổng doanh thu từ đơn `COMPLETED`.
- Đơn chờ xử lý.
- Feedback mới.
- `revenueSeries` 7 ngày gần nhất.
- `topProducts` top 5 sản phẩm bán chạy từ đơn `COMPLETED`.

## Rủi ro còn lại

- Nhiều màn admin đang lặp pattern table/form, có thể refactor component dùng chung sau.
- Một số thao tác xóa còn dùng `window.confirm`, nên thay bằng confirm dialog chung khi polish UI.
