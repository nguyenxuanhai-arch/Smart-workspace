# Huong dan deploy Docker tu A-Z

Tai lieu nay chay fullstack Smart Workspace bang 3 container:

- `db`: MySQL 8.4, luu schema va data Flyway.
- `backend`: Spring Boot Java 21, Maven build thanh jar.
- `frontend`: React/Vite build static, Nginx serve UI va proxy `/api`, `/uploads` sang backend.

## 1. Yeu cau may

Can cai san:

- Docker Desktop hoac Docker Engine.
- Docker Compose V2.

Kiem tra:

```bash
docker --version
docker compose version
```

## 2. Tao file moi truong

Tai thu muc root project:

```bash
cp env.example .env
```

Tren Windows PowerShell:

```powershell
Copy-Item env.example .env
```

Mo `.env` va doi cac gia tri quan trong:

- `JWT_SECRET`: doi sang chuoi dai, kho doan.
- `MYSQL_ROOT_PASSWORD`, `DB_PASSWORD`: doi mat khau neu can.
- `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`: chi dien khi can test PayOS that.
- `FRONTEND_PORT`: doi thanh `8081` neu cong `80` dang bi dung.
- `MYSQL_BIND_ADDRESS`, `BACKEND_BIND_ADDRESS`: giu `127.0.0.1` khi len server de khong public DB/backend.

## 3. Build va chay fullstack

```bash
docker compose up --build
```

Chay nen:

```bash
docker compose up -d --build
```

Lan dau MySQL se tao database `smart_workspace`, backend se doi DB healthy roi Flyway tu chay migration/seed data.

## 4. Truy cap ung dung

Neu giu port mac dinh:

- Frontend customer/admin: `http://localhost`
- Admin route: `http://localhost/admin`
- Backend Swagger tren may host: `http://localhost:8080/swagger-ui.html`
- API truc tiep tren may host: `http://localhost:8080/api`

Frontend container proxy:

- `http://localhost/api/...` -> backend `/api/...`
- `http://localhost/uploads/...` -> backend upload files

Vi vay browser chi lam viec cung origin `http://localhost`, han che loi CORS/cookie khi demo.

Tai khoan demo sau khi Flyway chay:

- Customer: `customer@smartworkspace.local` / `123456`
- Customer co don hang mau: `customer-1@smartworkspace.local` / `123456`
- Admin: `admin-demo@smartworkspace.local` / `123456`

## 5. Xem log va kiem tra trang thai

```bash
docker compose ps
docker compose logs -f db
docker compose logs -f backend
docker compose logs -f frontend
```

Kiem tra nhanh API public:

```bash
curl http://localhost/api/products
curl http://localhost/api/categories
```

Neu dung Windows PowerShell:

```powershell
Invoke-RestMethod http://localhost/api/products
Invoke-RestMethod http://localhost/api/categories
```

## 6. Quan ly data va uploads

Compose tao 2 volume:

- `smart_workspace_mysql`: data MySQL.
- `smart_workspace_uploads`: anh upload san pham cua backend.

Dung container nhung giu data:

```bash
docker compose down
```

Xoa sach database va uploads de chay lai tu dau:

```bash
docker compose down -v
docker compose up -d --build
```

## 7. Rebuild rieng tung phan

Backend:

```bash
docker compose build backend
docker compose up -d backend
```

Frontend:

```bash
docker compose build frontend
docker compose up -d frontend
```

## 8. Loi thuong gap

Cong `80` bi chiem:

- Doi `FRONTEND_PORT=8081` trong `.env`.
- Truy cap `http://localhost:8081`.

Cong `3306` hoac `8080` bi ung dung local chiem:

- Doi `MYSQL_PORT=3307` trong `.env`.
- Hoac doi `BACKEND_PORT=8082` neu cong backend bi chiem.
- Backend van ket noi `db:3306` ben trong Docker, khong can doi `DB_URL`.

Backend loi ket noi database:

- Chay `docker compose logs -f db`.
- Dam bao `DB_USERNAME` va `DB_PASSWORD` trung voi user/password MySQL trong `.env`.
- Neu da doi user/password sau khi volume MySQL da tao, can `docker compose down -v` de tao DB moi.

PayOS checkout loi:

- Dien day du 3 bien `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`.
- Dat `APP_FRONTEND_URL` thanh URL frontend ma PayOS co the redirect ve.

## 9. Len Azure VM/VPS co Docker

Lua chon don gian nhat de deploy gan giong local la:

- Azure Virtual Machine.
- Ubuntu Server 22.04 LTS hoac 24.04 LTS.
- Docker Engine + Docker Compose plugin.

VM demo nen dung toi thieu 2 vCPU va 4 GB RAM. `Standard_B2s` du cho demo; `Standard_B2ms` thoai mai hon khi build Maven, MySQL va frontend cung luc.

Chi can mo inbound public:

- `22`: SSH.
- `80`: HTTP.
- `443`: HTTPS sau nay neu gan domain/chung chi.

Khong can mo `3306` va `8080` ra Internet. Compose mac dinh bind MySQL/backend vao `127.0.0.1`, frontend Nginx se proxy `/api` va `/uploads` vao backend trong Docker network.

Tren server:

```bash
git pull
cp env.example .env
```

Sua `.env`:

```env
FRONTEND_BIND_ADDRESS=0.0.0.0
FRONTEND_PORT=80
BACKEND_BIND_ADDRESS=127.0.0.1
BACKEND_PORT=8080
MYSQL_BIND_ADDRESS=127.0.0.1
MYSQL_PORT=3306
APP_FRONTEND_URL=http://YOUR_SERVER_IP
APP_PUBLIC_API_URL=http://YOUR_SERVER_IP
JWT_SECRET=replace-with-real-long-secret
DB_PASSWORD=replace-with-real-db-password
MYSQL_ROOT_PASSWORD=replace-with-real-root-password
```

Sau do:

```bash
docker compose up -d --build
docker compose logs -f backend
```

Neu dung domain va HTTPS bang reverse proxy ngoai, dat:

```env
APP_FRONTEND_URL=https://your-domain.com
APP_PUBLIC_API_URL=https://your-domain.com
FRONTEND_BIND_ADDRESS=127.0.0.1
FRONTEND_PORT=8081
```

Sau do proxy domain vao `http://127.0.0.1:8081`.
