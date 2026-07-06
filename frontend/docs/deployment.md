# Frontend Deployment

Tài liệu này triển khai admin frontend React/Vite cho Smart Workspace. Backend Spring Boot hiện chưa bật CORS, vì vậy cấu hình khuyến nghị là deploy frontend và backend cùng origin, sau đó proxy `/api` và `/uploads` về backend.

## Yêu cầu

- Node.js 20 LTS hoặc mới hơn để build frontend.
- Backend chạy Java 21, Spring Boot 3.3.5, MySQL và Flyway migration đầy đủ.
- Backend public các route:
  - `/api/**`
  - `/uploads/products/**`

## Biến môi trường frontend

Các biến này là build-time variables của Vite, cần có trước khi chạy `npm run build`.

```env
VITE_API_BASE_URL=/api
VITE_ASSET_BASE_URL=
VITE_DEV_API_TARGET=http://localhost:8080
```

Ý nghĩa:

| Biến | Mặc định | Khi dùng |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL cho axios. Giữ `/api` nếu Nginx proxy cùng origin. |
| `VITE_ASSET_BASE_URL` | rỗng | Origin cho ảnh `/uploads/...` khi frontend/backend tách domain. |
| `VITE_DEV_API_TARGET` | `http://localhost:8080` | Target proxy khi chạy `npm run dev`. |

Ví dụ tách domain:

```env
VITE_API_BASE_URL=https://api.smart-workspace.example/api
VITE_ASSET_BASE_URL=https://api.smart-workspace.example
```

Nếu tách domain, backend cần cấu hình CORS cho domain frontend. Nếu chưa bổ sung CORS, hãy dùng reverse proxy cùng origin như phần dưới.

## Build local

```bash
cd frontend
npm ci
npm run build
npm run preview
```

Preview chạy ở:

```txt
http://localhost:4173
```

## Deploy bằng Nginx cùng origin

Luồng khuyến nghị:

```txt
Browser -> https://admin.smart-workspace.example
  /              -> static files trong dist
  /api/**        -> proxy backend:8080/api/**
  /uploads/**    -> proxy backend:8080/uploads/**
```

Build:

```bash
cd frontend
cp .env.example .env.production
npm ci
npm run build
```

Copy thư mục `frontend/dist` lên server Nginx. Dùng `frontend/nginx.conf` làm mẫu, sửa upstream `http://backend:8080` thành địa chỉ backend thật nếu không chạy Docker cùng network.

Các điểm bắt buộc trong Nginx:

- `try_files $uri $uri/ /index.html;` để React Router refresh được các route như `/san-pham`.
- Proxy `/api/` về backend.
- Proxy `/uploads/` về backend để ảnh sản phẩm render đúng.
- `client_max_body_size 5m;` khớp giới hạn upload ảnh backend.

## Deploy bằng Docker

Build image:

```bash
cd frontend
docker build -t smart-workspace-admin .
```

Nếu backend chạy trong cùng Docker network với service name `backend`, chạy:

```bash
docker run --rm -p 8081:80 --network smart-workspace smart-workspace-admin
```

Nếu backend không tên là `backend`, sửa `frontend/nginx.conf` hoặc mount file cấu hình Nginx riêng khi chạy container.

Build với API tách domain:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.smart-workspace.example/api \
  --build-arg VITE_ASSET_BASE_URL=https://api.smart-workspace.example \
  -t smart-workspace-admin .
```

## Checklist sau deploy

- Mở `/login`, đăng nhập bằng tài khoản có role `ADMIN`.
- Refresh trực tiếp các route `/`, `/san-pham`, `/don-hang`, `/danh-gia`.
- Gọi được `GET /api/auth/me` sau đăng nhập.
- Upload ảnh sản phẩm trả URL dạng `/uploads/products/...`.
- Ảnh upload hiển thị được trong form thêm/sửa và bảng sản phẩm.
- Khi access token hết hạn, frontend gọi được `/api/auth/refresh`.
- Nếu dùng HTTPS ở frontend, backend/proxy cũng phải phục vụ API qua HTTPS hoặc cùng origin để tránh mixed content.
