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

## 9. Deploy tu dong len Azure VM bang cloud-init

Lua chon deploy don gian nhat, gan giong local va khong can setup server thu cong:

- Azure Virtual Machine.
- Ubuntu Server 22.04 LTS.
- Docker Engine va Docker Compose duoc cloud-init tu cai.
- Source code duoc clone truc tiep tu GitHub.
- Fullstack duoc khoi dong bang `docker compose up -d --build`.
- Cloud-init tao swap 4 GB de VM nho van build duoc Maven/npm on dinh hon.

Cloud-init chay trong lan boot dau tien cua VM, co the cai package, ghi file va chay lenh khoi tao. Azure CLI truyen file cloud-init vao VM bang tham so `--custom-data`. Ubuntu 22.04 va Ubuntu 24.04 tren Azure deu ho tro cloud-init. Xem them tai Microsoft Learn: [cloud-init VM deployment][1].

### 9.1. Kien truc tren Azure VM

```txt
Internet
   |
   | port 80
   v
Frontend Nginx container
   |
   | /api va /uploads
   v
Backend Spring Boot container
   |
   v
MySQL container
```

Chi mo inbound public:

```txt
22  SSH, dung de du phong
80  HTTP
443 HTTPS, mo sau khi gan domain
```

Khong mo public:

```txt
3306 MySQL
8080 Backend
```

Compose da bind MySQL va backend vao `127.0.0.1`. Frontend Nginx la entrypoint duy nhat va proxy `/api`, `/uploads` sang backend.

### 9.2. Thu muc Azure deployment

Repo co them cau truc:

```txt
infra/
`-- azure-vm/
    |-- cloud-init.yml
    `-- deploy-azure.sh
```

### 9.3. File cloud-init.yml

File `infra/azure-vm/cloud-init.yml` tu dong:

- Cai Docker Engine va Docker Compose plugin.
- Clone repo vao `/opt/smart-workspace`.
- Sinh password database va JWT secret bang `openssl`.
- Tao `/opt/smart-workspace/.env`.
- Chay `docker compose up -d --build`.
- Ghi log vao `/var/log/smart-workspace-deploy.log`.

Khong ghi truc tiep password hay JWT secret vao `cloud-init.yml`. Script tu sinh secret ben trong VM va ghi vao `.env` local cua VM. Microsoft khuyen khong dat du lieu nhay cam trong Azure Custom Data, nen khong truyen secret tu Cloud Shell vao cloud-init. Xem them: [Azure custom data][2].

### 9.4. File deploy-azure.sh

File `infra/azure-vm/deploy-azure.sh` tao Resource Group, Ubuntu VM, public DNS, mo port 80, truyen cloud-init vao VM va doi deployment hoan thanh.

Co the override bien khi chay:

```bash
RESOURCE_GROUP=rg-smart-workspace-prod \
LOCATION=malaysiawest \
VM_NAME=vm-smart-workspace \
VM_SIZE=Standard_DS1_v2 \
bash infra/azure-vm/deploy-azure.sh
```

Mac dinh:

```txt
RESOURCE_GROUP=rg-smart-workspace-dev-malaysiawest
LOCATION=malaysiawest
VM_NAME=vm-smart-workspace
VM_SIZE=Standard_DS1_v2
ADMIN_USERNAME=azureuser
```

### 9.5. Deploy bang Azure Cloud Shell

Mo Azure Portal, sau do mo:

```txt
Cloud Shell
```

Chon Bash.

Clone repository:

```bash
git clone https://github.com/nguyenxuanhai-arch/Smart-workspace.git
cd Smart-workspace
```

Chay deploy:

```bash
bash infra/azure-vm/deploy-azure.sh
```

Day la lenh deploy duy nhat.

Script se tu dong:

```txt
1. Tao Resource Group.
2. Tao Ubuntu VM.
3. Tao SSH key neu chua co.
4. Tao public IP va DNS.
5. Mo port 80.
6. Gui cloud-init vao VM.
7. Cai Docker Engine.
8. Cai Docker Compose plugin.
9. Clone source code.
10. Sinh database password va JWT secret.
11. Tao file .env production.
12. Build MySQL, backend va frontend.
13. Khoi dong fullstack.
14. Kiem tra trang thai container.
15. In URL website.
```

Azure CLI co the truyen cloud-init vao VM bang `az vm create --custom-data`. Lenh tao VM co the tra ket qua truoc khi tat ca tac vu cloud-init hoan tat, vi vay script dung `cloud-init status --wait` de cho qua trinh build va deploy xong.

Lan deploy dau co the mat vai phut vi VM phai:

```txt
Tai Docker image MySQL.
Build backend bang Maven.
Build frontend bang npm.
Khoi tao MySQL.
Chay Flyway migration va seed data.
```

### 9.6. Truy cap ung dung

Sau khi script hoan thanh, terminal se in URL dang:

```txt
http://smart-workspace-abc123.malaysiawest.cloudapp.azure.com
```

Cac duong dan:

```txt
Frontend:
http://smart-workspace-abc123.malaysiawest.cloudapp.azure.com

Admin:
http://smart-workspace-abc123.malaysiawest.cloudapp.azure.com/admin

API:
http://smart-workspace-abc123.malaysiawest.cloudapp.azure.com/api/products

Uploads:
http://smart-workspace-abc123.malaysiawest.cloudapp.azure.com/uploads/products/...
```

Khong truy cap backend bang port `8080`. Browser goi API cung origin qua Nginx:

```txt
/api -> backend:8080/api
/uploads -> backend:8080/uploads
```

### 9.7. Kiem tra deployment ma khong can SSH

Xem trang thai cloud-init:

```bash
az vm run-command invoke \
  --resource-group rg-smart-workspace-dev-malaysiawest \
  --name vm-smart-workspace \
  --command-id RunShellScript \
  --scripts "cloud-init status --long" \
  --query "value[0].message" \
  --output tsv
```

Xem log deploy:

```bash
az vm run-command invoke \
  --resource-group rg-smart-workspace-dev-malaysiawest \
  --name vm-smart-workspace \
  --command-id RunShellScript \
  --scripts "tail -n 200 /var/log/smart-workspace-deploy.log" \
  --query "value[0].message" \
  --output tsv
```

Xem container:

```bash
az vm run-command invoke \
  --resource-group rg-smart-workspace-dev-malaysiawest \
  --name vm-smart-workspace \
  --command-id RunShellScript \
  --scripts "cd /opt/smart-workspace && docker compose ps" \
  --query "value[0].message" \
  --output tsv
```

Xem backend log:

```bash
az vm run-command invoke \
  --resource-group rg-smart-workspace-dev-malaysiawest \
  --name vm-smart-workspace \
  --command-id RunShellScript \
  --scripts "cd /opt/smart-workspace && docker compose logs --tail=200 backend" \
  --query "value[0].message" \
  --output tsv
```

Cloud-init log chuan tren Azure Linux VM nam tai `/var/log/cloud-init.log`; log rieng cua deployment nay duoc ghi vao `/var/log/smart-workspace-deploy.log`. Xem them: [cloud-init support for Linux VMs][3].

### 9.8. Cap nhat code sau nay bang Azure Run Command

Sau khi push code moi len GitHub, co the cap nhat VM ma khong can SSH:

```bash
az vm run-command invoke \
  --resource-group rg-smart-workspace-dev-malaysiawest \
  --name vm-smart-workspace \
  --command-id RunShellScript \
  --scripts '
    set -e

    cd /opt/smart-workspace

    git pull origin main

    docker compose up -d --build
    docker image prune -f

    docker compose ps
  ' \
  --query "value[0].message" \
  --output tsv
```

### 9.9. Tu dong rebuild khi push GitHub

Repo co workflow `.github/workflows/deploy-azure-vm.yml`.

Workflow nay chay khi push vao branch:

```txt
main
frontend
```

Moi lan chay, GitHub Actions se:

```txt
1. Dang nhap Azure bang secret AZURE_CREDENTIALS.
2. Goi Azure Run Command vao VM `vm-smart-workspace`.
3. Tren VM, checkout dung branch vua push.
4. Chay `docker compose up -d --build --remove-orphans`.
5. Xoa image rac bang `docker image prune -f`.
6. Health check frontend va `/api/products`.
```

Workflow dung GitHub OIDC de dang nhap Azure, khong can luu Azure password trong GitHub Secrets.

```txt
Azure Entra app: github-smart-workspace-vm-deploy
Client ID: de3b8ab5-c38b-4929-b6a1-b0c443d51485
```

Service principal cua app nay chi co quyen Contributor tren resource group deploy:

```txt
rg-smart-workspace-dev-malaysiawest
```

Federated credentials da duoc tao cho:

```txt
repo:nguyenxuanhai-arch/Smart-workspace:ref:refs/heads/main
repo:nguyenxuanhai-arch/Smart-workspace:ref:refs/heads/frontend
```

### 9.10. Xoa toan bo moi truong Azure

Khi demo xong va khong can giu database:

```bash
az group delete \
  --name rg-smart-workspace-dev-malaysiawest \
  --yes \
  --no-wait
```

Lenh nay xoa:

```txt
VM
Public IP
DNS
Network Security Group
Virtual Network
Managed Disk
Toan bo Docker volume nam tren VM
```

Neu database va uploads con can su dung, phai backup truoc khi xoa Resource Group.

Luong cuoi cung:

```txt
Azure Cloud Shell
-> bash infra/azure-vm/deploy-azure.sh
-> Azure tao VM
-> cloud-init cai Docker
-> clone GitHub
-> docker compose up -d --build
-> website online
```

[1]: https://learn.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-automate-vm-deployment
[2]: https://learn.microsoft.com/en-us/azure/virtual-machines/custom-data
[3]: https://learn.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init
