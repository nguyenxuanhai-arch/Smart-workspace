# Tích hợp API Giỏ hàng và Thanh toán (Cart API Integration)

Lỗi `400 Bad Request` khi thanh toán xảy ra do backend đang cố gắng tạo đơn hàng từ giỏ hàng trong database, nhưng giỏ hàng của bạn trên DB hiện tại đang trống. Nguyên nhân gốc rễ là do Frontend vẫn đang dùng `localStorage` (`cartStorage.js`) thay vì đồng bộ giỏ hàng với Backend API.

Kế hoạch này sẽ giải quyết triệt để lỗi thanh toán hiện tại, đồng thời hoàn thành hai yêu cầu còn nợ của bạn:
1. Tích hợp API vào `gio-hang` và `thanh-toan`
2. Kết hợp `cartStorage.js` và `cart.js`

## User Review Required

> [!WARNING]
> Việc chuyển đổi sang Cart API yêu cầu người dùng phải đăng nhập để lưu trữ giỏ hàng. Nếu người dùng chưa đăng nhập, họ có thể sử dụng `localStorage` tạm thời hoặc bị yêu cầu đăng nhập. Trong kế hoạch này, chúng tôi sẽ ưu tiên đồng bộ tự động `localStorage` lên server ngay khi người dùng đăng nhập.

## Open Questions

> [!IMPORTANT]
> - Nếu khách hàng CHƯA đăng nhập mà ấn "Thêm vào giỏ hàng", bạn muốn:
>   a) Bắt buộc đăng nhập ngay lập tức?
>   b) Vẫn lưu vào `localStorage`, và khi họ đăng nhập thì gộp (merge) giỏ hàng local lên server? (Khuyên dùng - trải nghiệm tốt nhất)

## Proposed Changes

---

### API Clients

#### [MODIFY] [cart.js](file:///c:/Users/TP/Smart-workspace/frontend/src/client/api/cart.js)
- Thêm đầy đủ các phương thức gọi API cho `/api/cart`: `getMyCart()`, `addItem(productId, quantity, optionId)`, `updateItem(itemId, quantity)`, `deleteItem(itemId)`.

### Context & Storage

#### [MODIFY] [CartContext.jsx](file:///c:/Users/TP/Smart-workspace/frontend/src/client/context/CartContext.jsx)
- Đổi từ việc đọc/ghi thuần tuý `localStorage` (qua `cartStorage.js`) sang gọi API `cart.js`.
- Cung cấp cơ chế tự động lấy `getMyCart()` khi component mount (nếu user đã đăng nhập).
- Gộp `cartStorage.js` vào luồng xử lý: Nếu chưa đăng nhập, dùng `localStorage`. Khi đăng nhập thành công, gọi API để đồng bộ dữ liệu lên server.

#### [DELETE] [cartStorage.js](file:///c:/Users/TP/Smart-workspace/frontend/src/client/utils/cartStorage.js)
- Xóa bỏ file `cartStorage.js` do mọi logic sẽ được gộp chung vào Context và API.

### UI Components

#### [MODIFY] [Cart.jsx](file:///c:/Users/TP/Smart-workspace/frontend/src/client/pages/Cart.jsx)
- Sửa lại giao diện để lấy `cartId` và `itemId` thực tế từ server trả về.
- Xử lý trạng thái loading khi thêm/sửa/xoá số lượng.

#### [MODIFY] [Checkout.jsx](file:///c:/Users/TP/Smart-workspace/frontend/src/client/pages/Checkout.jsx)
- Xoá các dữ liệu dummy/mock.
- Truyền danh sách `items` từ CartContext đã được đồng bộ với DB. (Khi submit, backend sẽ đọc trực tiếp từ DB nên Frontend không cần gửi mảng items lên nữa, tránh lỗi 400).

## Verification Plan

### Manual Verification
1. Đăng nhập vào một tài khoản.
2. Ấn thêm sản phẩm vào giỏ hàng ở trang Chi tiết. Kiểm tra DB (`cart_items`) xem có được lưu không.
3. Vào `/gio-hang` sửa số lượng, kiểm tra giá thay đổi và DB cập nhật đúng.
4. Nhấn Thanh toán, điền địa chỉ, chọn phương thức thanh toán. Submit và không còn lỗi `400 Bad Request`. Đơn hàng tạo thành công.
