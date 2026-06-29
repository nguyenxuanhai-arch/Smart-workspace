# 00 - Project Context

## 1. Tên dự án

**Smart Workspace - Phòng Làm Việc Thông Minh**

Đây là website thương mại điện tử bán sản phẩm và combo setup phòng làm việc thông minh.

---

## 2. Mô hình kinh doanh

Mô hình: **D2C E-commerce / Dropshipping - Brand Hybrid**

Ý tưởng chính:
- Không chỉ bán từng sản phẩm lẻ.
- Tập trung bán giải pháp setup góc làm việc trọn gói.
- Giai đoạn đầu có thể xem như dropshipping/testing.
- Website lab chỉ cần mô phỏng đúng nghiệp vụ thương mại điện tử.

---

## 3. Khách hàng mục tiêu

Nhóm khách hàng chính:
- Sinh viên
- Gen Z / Millennials
- Lập trình viên
- Freelancer
- Content creator
- Nhân viên văn phòng làm hybrid/remote

Nhu cầu chính:
- Góc làm việc đẹp
- Gọn dây cáp
- Công thái học
- Tăng tập trung
- Mua combo tiện hơn mua lẻ

---

## 4. Sản phẩm chính

Nhóm sản phẩm:

1. Bàn làm việc
   - Bàn nâng hạ thông minh
   - Bàn setup nhỏ gọn

2. Ghế
   - Ghế công thái học
   - Ghế lưới hỗ trợ lưng

3. Phụ kiện
   - Giá đỡ laptop
   - Đèn màn hình chống lóa
   - Lót chuột tích hợp sạc
   - Kệ màn hình
   - Phụ kiện quản lý dây cáp

4. Combo setup
   - Creator Setup
   - Coder Setup
   - Hybrid Worker Setup

---

## 5. Chức năng website cần hỗ trợ

Backend cần hỗ trợ các nhóm chức năng:

- Đăng ký, đăng nhập, lấy thông tin user
- Refresh token để gia hạn phiên đăng nhập
- Blacklist access token khi logout để token cũ không dùng lại được
- Phân quyền user/admin
- Quản lý sản phẩm
- Quản lý danh mục
- Ảnh sản phẩm
- Tìm kiếm sản phẩm
- Lọc sản phẩm
- Sắp xếp sản phẩm
- Khuyến mại, giá cũ, giá mới
- Giỏ hàng
- Đặt hàng
- Thanh toán mock
- Vận chuyển mock
- Đánh giá sản phẩm
- Bình luận sản phẩm
- Liên hệ/feedback
- Chính sách đổi trả, bảo hành, vận chuyển
- Địa điểm cửa hàng và Google Maps URL
- Trang quản trị

---

## 6. Thanh toán

Dự án hỗ trợ các phương thức thanh toán:

- COD
- Chuyển khoản ngân hàng
- MoMo
- ZaloPay
- VNPay
- Thẻ nội địa/quốc tế

Trong bản lab, các cổng thanh toán như MoMo, ZaloPay, VNPay chỉ cần làm **mock**, không tích hợp thanh toán thật.

---

## 7. Giao hàng và hậu mãi

Chính sách mô phỏng:

- Giao hàng tại TP.HCM/Hà Nội khoảng 2-5 ngày làm việc
- Sản phẩm đặt trước hoặc tùy chỉnh có thời gian riêng
- Cho phép kiểm tra ngoại quan khi nhận hàng
- Hỗ trợ đổi trả trong 7 ngày nếu lỗi kỹ thuật, giao sai mẫu, sai màu hoặc hư hỏng vận chuyển
- Bảo hành 6-12 tháng cho sản phẩm chính như ghế công thái học và bàn nâng hạ
- Phụ kiện nhỏ có thể bảo hành 1-3 tháng

---

## 8. Mục tiêu kỹ thuật

Backend cần:
- Chạy được local
- Kết nối MySQL
- Dùng Flyway để tạo database
- Có Swagger hoặc Postman để demo API
- Có dữ liệu seed mẫu
- Có phân quyền admin/user
- Có access token, refresh token và blacklist token cho auth flow
- Không cần triển khai production thật
