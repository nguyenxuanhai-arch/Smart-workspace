# AGENTS.md - Smart Workspace Frontend

## 1. Project context

Smart Workspace là frontend cho website thương mại điện tử bán sản phẩm setup phòng làm việc thông minh. Frontend phải phục vụ tốt demo môn Thương mại điện tử, ưu tiên giao diện rõ ràng, đầy đủ luồng nghiệp vụ, dễ chạy cục bộ và dễ thuyết trình.

Sản phẩm chính:

- Bàn nâng hạ thông minh
- Ghế công thái học
- Giá đỡ laptop
- Đèn màn hình chống lóa
- Phụ kiện setup bàn làm việc
- Combo setup: Creator Setup, Coder Setup, Hybrid Worker Setup

Định vị thương hiệu: Affordable Premium, bán giải pháp không gian làm việc trọn gói thay vì chỉ bán sản phẩm lẻ.

---

## 2. Frontend goals

Frontend cần thể hiện được toàn bộ hành trình mua hàng:

1. Khách hàng truy cập trang chủ.
2. Xem banner, sản phẩm nổi bật, combo setup và khuyến mại.
3. Tìm kiếm, lọc, sắp xếp sản phẩm.
4. Xem chi tiết sản phẩm, ảnh, giá cũ, giá mới, chính sách và đánh giá.
5. Thêm sản phẩm vào giỏ hàng.
6. Thanh toán bằng COD, chuyển khoản hoặc mô phỏng ví điện tử.
7. Theo dõi trạng thái đơn hàng.
8. Gửi đánh giá, bình luận, feedback hoặc liên hệ.
9. Admin đăng nhập và quản lý dữ liệu website.

Mục tiêu của code frontend là chạy ổn định khi demo, không over-engineer, không thêm kiến trúc phức tạp nếu không cần.

---

## 3. Required frontend features

### Customer site

- Trang chủ có hero banner, danh mục nổi bật, sản phẩm nổi bật, combo setup, khuyến mại và CTA rõ ràng.
- Trang danh mục sản phẩm có tìm kiếm, lọc theo danh mục/giá/nhu cầu/phong cách và sắp xếp theo giá, mới nhất, bán chạy, đánh giá.
- Trang chi tiết sản phẩm có gallery ảnh, mô tả, thông số, giá cũ, giá mới, nhãn khuyến mại, tồn kho, đánh giá, bình luận và chính sách giao hàng/bảo hành.
- Giỏ hàng cho phép thêm, sửa số lượng, xóa sản phẩm và tính tổng tiền.
- Checkout có thông tin người nhận, địa chỉ, số điện thoại, ghi chú, phương thức thanh toán và xác nhận đơn hàng.
- Trang đơn hàng của tôi hiển thị lịch sử mua hàng và trạng thái đơn.
- Trang liên hệ có form feedback, hotline, email, địa chỉ và Google Maps.
- Trang chính sách gồm đổi trả, bảo hành, vận chuyển, thanh toán và bảo mật.
- Responsive đầy đủ cho desktop, tablet và mobile.

### Admin site

- Đăng nhập admin.
- Dashboard tổng quan: doanh thu, đơn hàng, khách hàng, sản phẩm bán chạy.
- Quản lý sản phẩm: thêm, sửa, xóa, ẩn/hiện, ảnh sản phẩm, giá cũ/giá mới.
- Quản lý danh mục sản phẩm.
- Quản lý đơn hàng và cập nhật trạng thái.
- Quản lý khách hàng.
- Quản lý đánh giá, bình luận và feedback.
- Quản lý khuyến mại, banner và mã giảm giá.
- Quản lý chính sách và thông tin cửa hàng.

---

## 4. Development rules

- Giữ code dễ đọc, đặt tên biến/hàm/component rõ nghĩa.
- Không commit file build output, cache, dependency folder hoặc secret.
- Không hard-code dữ liệu nhạy cảm như API key, token, mật khẩu.
- Tách UI thành component nhỏ: Header, Footer, ProductCard, ProductGrid, FilterSidebar, CartItem, CheckoutForm, AdminLayout, DataTable, StatusBadge.
- Với dữ liệu demo, gom vào file riêng như `data/products.js`, `data/categories.js`, `data/orders.js` hoặc service mock tương đương.
- Khi tích hợp backend, gom logic gọi API vào service layer, không gọi API rải rác trong component.
- Mọi form phải validate tối thiểu ở frontend: required, số điện thoại, email, số lượng, địa chỉ giao hàng.
- UI phải có trạng thái loading, empty, error cho danh sách sản phẩm, giỏ hàng, đơn hàng và dashboard.
- Khi sửa giao diện, kiểm tra lại desktop và mobile.

---

## 5. Suggested folder organization

Có thể điều chỉnh theo source thực tế, nhưng nên giữ cấu trúc tương tự:

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── admin/
├── data/
├── layouts/
├── pages/
│   ├── customer/
│   └── admin/
├── routes/
├── services/
├── styles/
└── utils/
```

Nếu frontend hiện tại dùng HTML/CSS/JS thuần, vẫn áp dụng nguyên tắc tách file theo page/component/assets.

---

## 6. UI and content tone

- Ngôn ngữ chính: tiếng Việt.
- Giọng thương hiệu: hiện đại, gọn gàng, đáng tin, phù hợp sinh viên, lập trình viên, freelancer và người làm việc hybrid.
- Ưu tiên thông điệp: setup đẹp, làm việc khỏe hơn, không gian gọn hơn, mua combo tiết kiệm thời gian.
- CTA nên rõ: `Khám phá sản phẩm`, `Xem combo`, `Thêm vào giỏ`, `Mua ngay`, `Gửi feedback`.

---

## 7. API integration contract

Khi kết nối backend, ưu tiên các nhóm endpoint sau:

```text
GET    /api/products
GET    /api/products/{id}
GET    /api/categories
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/{id}
DELETE /api/cart/items/{id}
POST   /api/orders
GET    /api/orders/my
POST   /api/products/{id}/reviews
POST   /api/feedbacks
GET    /api/policies
GET    /api/store-locations
```

Admin:

```text
GET    /api/admin/dashboard
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
PATCH  /api/admin/orders/{id}/status
GET    /api/admin/customers
GET    /api/admin/feedbacks
POST   /api/admin/promotions
PUT    /api/admin/policies/{id}
```

---

## 8. Done criteria

Một feature frontend được xem là xong khi:

- Có UI hoàn chỉnh cho desktop và mobile.
- Có dữ liệu demo hoặc kết nối API rõ ràng.
- Có xử lý loading, empty và error nếu liên quan đến dữ liệu.
- Có validate form nếu có input.
- Không làm hỏng luồng mua hàng chính.
- Không làm mất yêu cầu case study: tìm kiếm, lọc, sắp xếp, đăng nhập/đăng xuất, giỏ hàng, thanh toán, ảnh sản phẩm, responsive, liên hệ/feedback, khuyến mại, chính sách, Google Maps, đánh giá/bình luận và trang quản trị.

---

## 9. Avoid

- Không đổi chủ đề dự án sang ngành hàng khác.
- Không bỏ các chức năng bắt buộc của bài case study.
- Không dùng mock data lung tung trong nhiều component.
- Không để layout vỡ trên mobile.
- Không thêm dependency nặng nếu chỉ để làm một hiệu ứng nhỏ.
- Không viết code quá phức tạp khiến nhóm khó giải thích khi thuyết trình.
