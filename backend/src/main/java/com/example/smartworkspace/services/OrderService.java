package com.example.smartworkspace.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.order.BuyNowOrderRequest;
import com.example.smartworkspace.dtos.order.OrderRequest;
import com.example.smartworkspace.dtos.order.OrderResponse;
import com.example.smartworkspace.dtos.order.OrderStatusUpdateRequest;
import com.example.smartworkspace.entities.Cart;
import com.example.smartworkspace.entities.CartItem;
import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.entities.OrderItem;
import com.example.smartworkspace.entities.Payment;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.Shipment;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.CartStatus;
import com.example.smartworkspace.enums.OrderStatus;
import com.example.smartworkspace.enums.PaymentMethod;
import com.example.smartworkspace.enums.PaymentStatus;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.enums.ShipmentStatus;
import com.example.smartworkspace.mappers.OrderMapper;
import com.example.smartworkspace.repositories.CartItemRepository;
import com.example.smartworkspace.repositories.CartRepository;
import com.example.smartworkspace.repositories.OrderItemRepository;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.PaymentRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import com.example.smartworkspace.repositories.ShipmentRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final int MAX_PAGE_SIZE = 100;
    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(30000);
    private static final BigDecimal FREE_SHIPPING_THRESHOLD = BigDecimal.valueOf(2000000);
    private static final BigDecimal DISCOUNT_THRESHOLD = BigDecimal.valueOf(5000000);
    private static final BigDecimal DISCOUNT_AMOUNT = BigDecimal.valueOf(200000);
    private static final DateTimeFormatter ORDER_CODE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PaymentRepository paymentRepository;
    private final ShipmentRepository shipmentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.example.smartworkspace.repositories.VoucherRepository voucherRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse createOrderFromCart(OrderRequest request) {
        Long userId = getCurrentUserId();
        User user = getUser(userId);
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Cart is empty"));
        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByCreatedAtAsc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Cart is empty");
        }

        List<OrderLine> orderLines = cartItems.stream()
                .map(cartItem -> new OrderLine(
                        cartItem.getProduct(),
                        getUnitPrice(cartItem),
                        cartItem.getQuantity()
                ))
                .toList();
        OrderResponse response = createOrder(userId, user, request, orderLines);

        cartItemRepository.deleteAll(cartItems);
        cart.setStatus(CartStatus.ORDERED);
        cartRepository.save(cart);

        return response;
    }

    @Transactional
    public OrderResponse createBuyNowOrder(BuyNowOrderRequest request) {
        Long userId = getCurrentUserId();
        User user = getUser(userId);
        Product product = productRepository.findById(request.getProductId())
                .filter(item -> item.getStatus() == ProductStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return createOrder(userId, user, request, List.of(
                new OrderLine(product, product.getPrice(), request.getQuantity())
        ));
    }

    private OrderResponse createOrder(Long userId, User user, OrderRequest request, List<OrderLine> orderLines) {
        BigDecimal subtotalAmount = calculateSubtotal(orderLines);
        BigDecimal discountAmount = BigDecimal.ZERO;
        String voucherCodeToSave = null;
        com.example.smartworkspace.enums.DiscountType voucherTypeToSave = null;
        BigDecimal voucherValueToSave = null;
        
        if (request.getVoucherCode() != null && !request.getVoucherCode().isBlank()) {
            String code = request.getVoucherCode().trim().toUpperCase();
            com.example.smartworkspace.entities.Voucher voucher = voucherRepository.findByCodeForUpdate(code)
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá không hợp lệ"));
            
            if (voucher.getStatus() != com.example.smartworkspace.enums.CommonStatus.ACTIVE) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá không hoạt động");
            }
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá đã hết hạn hoặc chưa bắt đầu");
            }
            if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá đã hết lượt sử dụng chung");
            }
            if (subtotalAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này");
            }
            if (orderRepository.countByUserIdAndVoucherCodeAndStatusNot(userId, code, OrderStatus.CANCELLED) > 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Bạn đã sử dụng hết lượt của voucher này");
            }
            
            if (voucher.getDiscountType() == com.example.smartworkspace.enums.DiscountType.PERCENT) {
                discountAmount = subtotalAmount.multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100), 0, java.math.RoundingMode.DOWN);
            } else {
                discountAmount = voucher.getDiscountValue();
            }
            
            if (discountAmount.compareTo(subtotalAmount) > 0) {
                discountAmount = subtotalAmount;
            }
            
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);
            voucherCodeToSave = code;
            voucherTypeToSave = voucher.getDiscountType();
            voucherValueToSave = voucher.getDiscountValue();
        }

        BigDecimal amountAfterDiscount = subtotalAmount.subtract(discountAmount);
        BigDecimal shippingFee = calculateShippingFee(amountAfterDiscount, request.getShippingMethod());
        BigDecimal totalAmount = amountAfterDiscount.add(shippingFee);

        if (totalAmount.signum() < 0) {
            throw new IllegalStateException("Order total cannot be negative");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderCode(generateOrderCode(userId));
        order.setReceiverName(trim(request.getReceiverName()));
        order.setReceiverPhone(trim(request.getReceiverPhone()));
        order.setShippingAddress(trim(request.getShippingAddress()));
        order.setShippingMethod(request.getShippingMethod());
        order.setVoucherCode(voucherCodeToSave);
        order.setVoucherType(voucherTypeToSave);
        order.setVoucherValue(voucherValueToSave);
        order.setSubtotalAmount(subtotalAmount);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        order.setNote(trim(request.getNote()));
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> savedItems = orderItemRepository.saveAll(createOrderItems(savedOrder, orderLines));
        Payment savedPayment = paymentRepository.save(createPayment(savedOrder, request.getPaymentMethod()));
        Shipment savedShipment = shipmentRepository.save(createShipment(savedOrder));

        return orderMapper.toResponse(savedOrder, savedItems, savedPayment, savedShipment);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        Long userId = getCurrentUserId();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrderDetail(Long id) {
        Long userId = getCurrentUserId();
        Order order = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAdminOrders(int page, int size) {
        Pageable pageable = PageRequest.of(
                safePage(page),
                safeSize(size),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<OrderResponse> orderPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
        return PageResponse.from(orderPage);
    }

    @Transactional(readOnly = true)
    public OrderResponse getAdminOrderDetail(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
                
        if (request.getStatus() == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            if (order.getVoucherCode() != null) {
                voucherRepository.findByCodeForUpdate(order.getVoucherCode()).ifPresent(voucher -> {
                    if (voucher.getUsedCount() > 0) {
                        voucher.setUsedCount(voucher.getUsedCount() - 1);
                        voucherRepository.save(voucher);
                    }
                });
            }
        }
        
        order.setStatus(request.getStatus());
        return toResponse(orderRepository.save(order));
    }

    private BigDecimal calculateSubtotal(List<OrderLine> orderLines) {
        BigDecimal subtotalAmount = BigDecimal.ZERO;
        for (OrderLine orderLine : orderLines) {
            ensureProductCanBeOrdered(orderLine.product(), orderLine.quantity());
            BigDecimal itemSubtotal = orderLine.unitPrice().multiply(BigDecimal.valueOf(orderLine.quantity()));
            subtotalAmount = subtotalAmount.add(itemSubtotal);
        }
        return subtotalAmount;
    }

    private List<OrderItem> createOrderItems(Order order, List<OrderLine> orderLines) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderLine orderLine : orderLines) {
            Product product = orderLine.product();
            BigDecimal unitPrice = orderLine.unitPrice();
            int quantity = orderLine.quantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setProductSku(product.getSku());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setQuantity(quantity);
            orderItem.setSubtotal(unitPrice.multiply(BigDecimal.valueOf(quantity)));
            orderItems.add(orderItem);

            product.setStockQuantity(product.getStockQuantity() - quantity);
        }
        return orderItems;
    }

    private Payment createPayment(Order order, PaymentMethod paymentMethod) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus(PaymentStatus.UNPAID);
        payment.setAmount(order.getTotalAmount());
        payment.setTransactionCode(generateTransactionCode(paymentMethod, order.getId()));
        return payment;
    }

    private Shipment createShipment(Order order) {
        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setShippingStatus(ShipmentStatus.PENDING);
        shipment.setCarrierName("Smart Workspace Express");
        shipment.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(3));
        return shipment;
    }

    private OrderResponse toResponse(Order order) {
        return orderMapper.toResponse(
                order,
                orderItemRepository.findByOrderIdOrderByIdAsc(order.getId()),
                paymentRepository.findByOrderId(order.getId()).orElse(null),
                shipmentRepository.findByOrderId(order.getId()).orElse(null)
        );
    }

    private void ensureProductCanBeOrdered(Product product, int quantity) {
        if (product.getStatus() != ProductStatus.ACTIVE
                || product.getStockQuantity() == null
                || product.getStockQuantity() < quantity) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
    }

    private BigDecimal getUnitPrice(CartItem cartItem) {
        return cartItem.getUnitPrice() == null ? cartItem.getProduct().getPrice() : cartItem.getUnitPrice();
    }

    private BigDecimal calculateShippingFee(BigDecimal amountAfterDiscount, com.example.smartworkspace.enums.ShippingMethod shippingMethod) {
        if (shippingMethod == com.example.smartworkspace.enums.ShippingMethod.INSTALLATION) {
            return BigDecimal.valueOf(150000);
        }
        return amountAfterDiscount.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
    }

    private String generateOrderCode(Long userId) {
        for (int attempt = 0; attempt < 5; attempt++) {
            String timestamp = LocalDateTime.now().format(ORDER_CODE_FORMATTER);
            int suffix = ThreadLocalRandom.current().nextInt(1000);
            String code = String.format("ORD-%s-%d-%03d", timestamp, userId, suffix);
            if (orderRepository.findByOrderCode(code).isEmpty()) {
                return code;
            }
        }
        throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    private String generateTransactionCode(PaymentMethod paymentMethod, Long orderId) {
        if (paymentMethod == PaymentMethod.COD) {
            return null;
        }
        return paymentMethod.name() + "-" + orderId + "-" + System.currentTimeMillis();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userDetails.getUser().getId();
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private int safePage(int page) {
        return Math.max(page, 0);
    }

    private int safeSize(int size) {
        if (size <= 0) {
            return 10;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private record OrderLine(Product product, BigDecimal unitPrice, int quantity) {
    }
}
