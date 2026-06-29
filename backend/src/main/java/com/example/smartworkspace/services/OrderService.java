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
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponse createOrderFromCart(OrderRequest request) {
        Long userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Cart is empty"));
        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByCreatedAtAsc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Cart is empty");
        }

        BigDecimal subtotalAmount = calculateSubtotal(cartItems);
        BigDecimal shippingFee = calculateShippingFee(subtotalAmount);
        BigDecimal discountAmount = calculateDiscountAmount(subtotalAmount);
        BigDecimal totalAmount = subtotalAmount.add(shippingFee).subtract(discountAmount);

        Order order = new Order();
        order.setUser(user);
        order.setOrderCode(generateOrderCode(userId));
        order.setReceiverName(trim(request.getReceiverName()));
        order.setReceiverPhone(trim(request.getReceiverPhone()));
        order.setShippingAddress(trim(request.getShippingAddress()));
        order.setSubtotalAmount(subtotalAmount);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount.max(BigDecimal.ZERO));
        order.setStatus(OrderStatus.PENDING);
        order.setNote(trim(request.getNote()));
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> savedItems = orderItemRepository.saveAll(createOrderItems(savedOrder, cartItems));
        Payment savedPayment = paymentRepository.save(createPayment(savedOrder, request.getPaymentMethod()));
        Shipment savedShipment = shipmentRepository.save(createShipment(savedOrder));

        cartItemRepository.deleteAll(cartItems);
        cart.setStatus(CartStatus.ORDERED);
        cartRepository.save(cart);

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
        order.setStatus(request.getStatus());
        return toResponse(orderRepository.save(order));
    }

    private BigDecimal calculateSubtotal(List<CartItem> cartItems) {
        BigDecimal subtotalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            ensureProductCanBeOrdered(cartItem);
            BigDecimal itemSubtotal = getUnitPrice(cartItem).multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotalAmount = subtotalAmount.add(itemSubtotal);
        }
        return subtotalAmount;
    }

    private List<OrderItem> createOrderItems(Order order, List<CartItem> cartItems) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            BigDecimal unitPrice = getUnitPrice(cartItem);
            int quantity = cartItem.getQuantity();

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

    private void ensureProductCanBeOrdered(CartItem cartItem) {
        Product product = cartItem.getProduct();
        if (product.getStatus() != ProductStatus.ACTIVE
                || product.getStockQuantity() == null
                || product.getStockQuantity() < cartItem.getQuantity()) {
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }
    }

    private BigDecimal getUnitPrice(CartItem cartItem) {
        return cartItem.getUnitPrice() == null ? cartItem.getProduct().getPrice() : cartItem.getUnitPrice();
    }

    private BigDecimal calculateShippingFee(BigDecimal subtotalAmount) {
        return subtotalAmount.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
    }

    private BigDecimal calculateDiscountAmount(BigDecimal subtotalAmount) {
        return subtotalAmount.compareTo(DISCOUNT_THRESHOLD) >= 0 ? DISCOUNT_AMOUNT : BigDecimal.ZERO;
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
}
