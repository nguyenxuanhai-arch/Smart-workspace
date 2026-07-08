# DESIGN.md - Smart Workspace Frontend

## 1. Design objective

Tài liệu này mô tả định hướng thiết kế frontend cho Smart Workspace: một website thương mại điện tử bán sản phẩm và combo setup phòng làm việc thông minh.

Frontend cần đạt 3 mục tiêu chính:

1. Trình bày thương hiệu Smart Workspace hiện đại, gọn gàng và đáng tin.
2. Dẫn khách hàng đi qua luồng mua hàng rõ ràng: khám phá, chọn sản phẩm, thêm giỏ, thanh toán, đánh giá.
3. Cung cấp giao diện admin đủ để demo quản lý sản phẩm, đơn hàng, khách hàng, feedback, khuyến mại và chính sách.

---

## 2. Brand direction

### Brand positioning

Smart Workspace nằm ở phân khúc Affordable Premium. Thiết kế cần tạo cảm giác cao cấp vừa phải, không quá xa xỉ, không quá bình dân.

### Design keywords

- Clean
- Smart
- Ergonomic
- Minimal
- Productive
- Trustworthy
- Setup-focused

### Visual feeling

Giao diện nên gợi cảm giác một góc làm việc hiện đại: sáng, gọn, có tổ chức, nhiều khoảng trắng, ảnh sản phẩm rõ, CTA nổi bật.

---

## 3. Target users

### Sinh viên

Nhu cầu: góc học tập gọn, đẹp, chi phí hợp lý.

Thiết kế nên nhấn mạnh: combo tiết kiệm, phụ kiện hữu ích, dễ mua, dễ lắp đặt.

### Lập trình viên / IT

Nhu cầu: ngồi lâu, nhiều thiết bị, cần giảm đau mỏi và tối ưu tập trung.

Thiết kế nên nhấn mạnh: công thái học, quản lý cáp, ánh sáng chống lóa, bàn ghế hỗ trợ làm việc lâu.

### Freelancer / Content creator

Nhu cầu: setup đẹp, có tính thẩm mỹ, phù hợp quay/chụp nội dung.

Thiết kế nên nhấn mạnh: ảnh setup mẫu, combo Creator Setup, phong cách đẹp như Pinterest.

### Nhân viên hybrid / remote worker

Nhu cầu: không gian làm việc tại nhà chuyên nghiệp và đáng tin.

Thiết kế nên nhấn mạnh: giải pháp trọn gói, bảo hành, vận chuyển, chính sách đổi trả.

---

## 4. Information architecture

```text
Customer site
├── Home
├── Products
│   ├── Category listing
│   ├── Search results
│   └── Product detail
├── Combo Setup
├── Cart
├── Checkout
├── My Orders
├── Reviews / Comments
├── Contact / Feedback
├── Policies
└── Auth
    ├── Login
    └── Register

Admin site
├── Admin Login
├── Dashboard
├── Products
├── Categories
├── Orders
├── Customers
├── Reviews / Comments
├── Feedbacks
├── Promotions / Banners
├── Policies
└── Store Settings
```

---

## 5. Main customer pages

### 5.1 Home page

Mục tiêu: tạo ấn tượng thương hiệu và dẫn người dùng đến sản phẩm/combo.

Nội dung nên có:

- Header có logo, menu, search, cart, login/account.
- Hero section với thông điệp chính: `Setup thông minh cho góc làm việc hiện đại`.
- CTA chính: `Khám phá sản phẩm`, CTA phụ: `Xem combo setup`.
- Danh mục nổi bật: bàn, ghế, đèn, giá đỡ, phụ kiện, combo.
- Sản phẩm nổi bật.
- Combo setup theo nhu cầu: Creator Setup, Coder Setup, Hybrid Worker Setup.
- Khuyến mại / giá mới / giá cũ.
- Section niềm tin: bảo hành, đổi trả, giao hàng, thanh toán an toàn.
- Feedback hoặc đánh giá nổi bật.
- Footer có chính sách, liên hệ, Google Maps, mạng xã hội.

### 5.2 Product listing page

Mục tiêu: giúp người dùng tìm đúng sản phẩm nhanh.

Bắt buộc có:

- Search input.
- Filter sidebar hoặc filter drawer trên mobile.
- Lọc theo danh mục, khoảng giá, nhu cầu sử dụng, phong cách setup, trạng thái khuyến mại.
- Sort theo mới nhất, giá tăng dần, giá giảm dần, bán chạy, đánh giá cao.
- Product card có ảnh, tên, rating, giá cũ, giá mới, badge sale, CTA thêm giỏ.
- Empty state khi không có kết quả.

### 5.3 Product detail page

Mục tiêu: tăng niềm tin trước khi mua.

Bố cục đề xuất:

- Gallery ảnh sản phẩm và ảnh setup thực tế.
- Tên sản phẩm, rating, số lượt đánh giá.
- Giá mới, giá cũ, phần trăm giảm.
- Mô tả ngắn.
- Chọn số lượng.
- CTA `Thêm vào giỏ` và `Mua ngay`.
- Thông số kỹ thuật.
- Chính sách giao hàng, đổi trả, bảo hành.
- Đánh giá và bình luận.
- Sản phẩm liên quan / combo gợi ý.

### 5.4 Cart page

Mục tiêu: cho phép kiểm tra đơn trước checkout.

Cần có:

- Danh sách sản phẩm trong giỏ.
- Ảnh, tên, giá, số lượng, tạm tính.
- Cập nhật số lượng.
- Xóa sản phẩm.
- Tổng tiền hàng, giảm giá, phí ship demo, tổng thanh toán.
- CTA `Tiến hành thanh toán`.
- Empty cart state.

### 5.5 Checkout page

Mục tiêu: hoàn tất đặt hàng đơn giản, ít bước.

Cần có:

- Thông tin người nhận: họ tên, số điện thoại, email, địa chỉ.
- Ghi chú đơn hàng.
- Phương thức thanh toán: COD, chuyển khoản, ví điện tử/cổng thanh toán mô phỏng.
- Tóm tắt đơn hàng.
- Checkbox xác nhận đã đọc chính sách.
- Thông báo đặt hàng thành công.

### 5.6 Contact / Feedback page

Cần có:

- Form liên hệ/feedback.
- Hotline, email, địa chỉ.
- Google Maps embed.
- Thời gian làm việc.
- Link chính sách hỗ trợ.

### 5.7 Policies page

Nên chia thành tab hoặc accordion:

- Chính sách đổi trả.
- Chính sách bảo hành.
- Chính sách vận chuyển.
- Chính sách thanh toán.
- Chính sách bảo mật.

---

## 6. Admin design

### 6.1 Admin layout

- Sidebar bên trái trên desktop.
- Topbar có tên admin, nút logout.
- Nội dung chính dùng card, table và form.
- Mobile có sidebar dạng drawer.

### 6.2 Dashboard

Widgets đề xuất:

- Tổng doanh thu.
- Tổng đơn hàng.
- Đơn chờ xử lý.
- Số khách hàng.
- Sản phẩm bán chạy.
- Đơn hàng mới nhất.

### 6.3 Product management

Table columns:

- Ảnh
- Tên sản phẩm
- Danh mục
- Giá cũ
- Giá mới
- Tồn kho
- Trạng thái
- Hành động

Form fields:

- Tên sản phẩm
- Danh mục
- Mô tả ngắn
- Mô tả chi tiết
- Giá cũ
- Giá mới
- Số lượng tồn
- Ảnh sản phẩm
- Trạng thái hiển thị
- Badge khuyến mại

### 6.4 Order management

Order status nên dùng badge:

```text
PENDING        Chờ xác nhận
CONFIRMED      Đã xác nhận
PACKING        Đang chuẩn bị
SHIPPING       Đang giao
DELIVERED      Đã giao
CANCELLED      Đã hủy
RETURNED       Hoàn/đổi trả
```

Admin có thể xem chi tiết đơn và cập nhật trạng thái.

---

## 7. Component guidelines

### Common components

- `Header`
- `Footer`
- `Button`
- `Input`
- `Modal`
- `Toast`
- `Breadcrumb`
- `Pagination`
- `StatusBadge`
- `LoadingState`
- `EmptyState`
- `ErrorState`

### Product components

- `ProductCard`
- `ProductGrid`
- `ProductGallery`
- `ProductFilter`
- `SortSelect`
- `PriceRangeFilter`
- `RatingStars`
- `ReviewList`

### Cart and checkout components

- `CartItem`
- `CartSummary`
- `CheckoutForm`
- `PaymentMethodSelector`
- `OrderSuccess`

### Admin components

- `AdminLayout`
- `AdminSidebar`
- `AdminTopbar`
- `DashboardCard`
- `DataTable`
- `ProductForm`
- `OrderStatusSelect`

---

## 8. Responsive behavior

### Desktop >= 1024px

- Header full menu.
- Product listing có filter sidebar cố định bên trái.
- Product detail dùng layout 2 cột: gallery trái, thông tin phải.
- Admin có sidebar cố định.

### Tablet 768px - 1023px

- Grid sản phẩm 2-3 cột.
- Filter có thể thu gọn.
- Admin table có horizontal scroll nếu cần.

### Mobile < 768px

- Header rút gọn thành menu icon.
- Product grid 1-2 cột tùy chiều rộng.
- Filter chuyển thành drawer/bottom sheet.
- Cart item xếp dọc.
- Checkout một cột.
- Admin sidebar chuyển thành drawer.

---

## 9. Data model for frontend mock

Product object đề xuất:

```js
{
  id: 1,
  name: "Ghế công thái học ErgoFlex",
  slug: "ghe-cong-thai-hoc-ergoflex",
  categoryId: 2,
  images: ["/assets/products/chair-1.jpg"],
  oldPrice: 3500000,
  price: 2890000,
  discountPercent: 17,
  rating: 4.8,
  reviewCount: 128,
  stock: 20,
  tags: ["ergonomic", "coder", "hybrid"],
  isFeatured: true,
  isActive: true,
  shortDescription: "Ghế lưới thoáng khí, hỗ trợ thắt lưng cho người ngồi lâu.",
  specifications: {
    material: "Mesh, nylon frame",
    warranty: "12 tháng"
  }
}
```

Cart item:

```js
{
  productId: 1,
  quantity: 2,
  selected: true
}
```

Order object:

```js
{
  id: 1001,
  customerName: "Nguyễn Văn A",
  phone: "0900000000",
  address: "TP.HCM",
  paymentMethod: "COD",
  status: "PENDING",
  totalAmount: 5780000,
  items: []
}
```

---

## 10. UX states

Mọi trang dữ liệu cần có đủ trạng thái:

- Loading: đang tải dữ liệu.
- Empty: không có dữ liệu hoặc không có kết quả tìm kiếm.
- Error: lỗi tải dữ liệu, có nút thử lại.
- Success: hành động thành công, ví dụ thêm giỏ hoặc đặt hàng.
- Validation error: form thiếu dữ liệu hoặc nhập sai định dạng.

---

## 11. Accessibility checklist

- Button và link phải có text rõ nghĩa.
- Ảnh sản phẩm phải có `alt`.
- Input phải có label hoặc aria-label.
- Màu chữ đủ tương phản với nền.
- Không chỉ dùng màu để thể hiện trạng thái; nên có thêm text hoặc icon.
- Có thể dùng bàn phím để focus vào menu, form, CTA chính.
- Form lỗi phải hiển thị gần input liên quan.

---

## 12. Performance checklist

- Tối ưu ảnh sản phẩm, tránh ảnh quá nặng.
- Lazy load ảnh ngoài viewport nếu có nhiều sản phẩm.
- Không import thư viện nặng nếu không cần.
- Tách dữ liệu mock khỏi component.
- Tránh render lại danh sách lớn không cần thiết.

---

## 13. Demo checklist

Trước khi thuyết trình, kiểm tra các luồng sau:

1. Trang chủ hiển thị đúng.
2. Tìm kiếm sản phẩm hoạt động.
3. Lọc và sắp xếp sản phẩm hoạt động.
4. Xem chi tiết sản phẩm có ảnh, giá cũ/giá mới, đánh giá và chính sách.
5. Thêm vào giỏ hàng.
6. Cập nhật số lượng trong giỏ.
7. Checkout và hiển thị đặt hàng thành công.
8. Trang liên hệ có feedback form và Google Maps.
9. Đăng nhập admin.
10. Admin xem dashboard.
11. Admin quản lý sản phẩm.
12. Admin cập nhật trạng thái đơn hàng.
13. Giao diện không vỡ trên mobile.

---

## 14. Non-goals for course demo

Không bắt buộc làm phức tạp các phần sau nếu thời gian hạn chế:

- Thanh toán thật với ngân hàng/ví điện tử.
- Realtime chat.
- AI recommendation thật.
- Upload ảnh thật lên cloud.
- Dashboard thống kê nâng cao.
- PWA/offline mode.

Có thể mô phỏng các phần này bằng mock data hoặc UI placeholder, miễn là luồng demo rõ ràng và giải thích được.
