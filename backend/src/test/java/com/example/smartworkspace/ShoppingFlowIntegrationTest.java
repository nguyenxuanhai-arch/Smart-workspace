package com.example.smartworkspace;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import com.example.smartworkspace.entities.Category;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.ProductImage;
import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.enums.RoleName;
import com.example.smartworkspace.enums.UserStatus;
import com.example.smartworkspace.repositories.CategoryRepository;
import com.example.smartworkspace.repositories.ProductImageRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import com.example.smartworkspace.repositories.RoleRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import com.example.smartworkspace.securities.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ShoppingFlowIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EntityManager entityManager;

    @Test
    void customerShoppingFlowAndAdminOperationsMatchDemoChecklist() throws Exception {
        String customerToken = createToken(RoleName.CUSTOMER);
        String adminToken = createToken(RoleName.ADMIN);
        Product mainProduct = createProduct("shopping-main", BigDecimal.valueOf(1_000_000), 10);
        Product deletedProduct = createProduct("shopping-delete", BigDecimal.valueOf(150_000), 10);

        MvcResult firstAddResult = mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("productId", mainProduct.getId(), "quantity", 2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Add cart item successfully"))
                .andExpect(jsonPath("$.data.totalItems").value(2))
                .andExpect(jsonPath("$.data.totalAmount").value(2_000_000.0))
                .andReturn();

        Long mainCartItemId = findCartItemId(responseData(firstAddResult), mainProduct.getId());

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("productId", mainProduct.getId(), "quantity", 1))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].quantity").value(3))
                .andExpect(jsonPath("$.data.totalItems").value(3));

        mockMvc.perform(put("/api/cart/items/{itemId}", mainCartItemId)
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("quantity", 2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andExpect(jsonPath("$.data.totalAmount").value(2_000_000.0));

        MvcResult addDeletedProductResult = mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("productId", deletedProduct.getId(), "quantity", 1))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(2)))
                .andReturn();

        Long deletedCartItemId = findCartItemId(responseData(addDeletedProductResult), deletedProduct.getId());
        mockMvc.perform(delete("/api/cart/items/{itemId}", deletedCartItemId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Delete cart item successfully"));

        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productId").value(mainProduct.getId()));

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "receiverName", "Nguyen Van Test",
                                "receiverPhone", "0909000000",
                                "shippingAddress", "123 Nguyen Trai, Quan 1, TP.HCM",
                                "paymentMethod", "COD",
                                "shippingMethod", "STANDARD",
                                "note", "Giao gio hanh chinh"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Create order successfully"))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productName").value(mainProduct.getName()))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andExpect(jsonPath("$.data.subtotalAmount").value(2_000_000.0))
                .andExpect(jsonPath("$.data.shippingFee").value(0.0))
                .andExpect(jsonPath("$.data.totalAmount").value(2_000_000.0))
                .andExpect(jsonPath("$.data.payment.paymentMethod").value("COD"))
                .andExpect(jsonPath("$.data.payment.paymentStatus").value("UNPAID"))
                .andExpect(jsonPath("$.data.shipment.shippingStatus").value("PENDING"))
                .andReturn();

        JsonNode orderData = responseData(orderResult);
        Long orderId = orderData.get("id").asLong();
        Long paymentId = orderData.get("payment").get("id").asLong();
        Long shipmentId = orderData.get("shipment").get("id").asLong();

        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(0)))
                .andExpect(jsonPath("$.data.totalItems").value(0));

        mockMvc.perform(get("/api/orders/my")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(orderId));

        mockMvc.perform(get("/api/orders/{id}", orderId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(orderId));

        mockMvc.perform(put("/api/admin/orders/{id}/status", orderId)
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/admin/orders/{id}/status", orderId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("status", "CONFIRMED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"));

        mockMvc.perform(post("/api/payments/{orderId}", orderId)
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("paymentMethod", "MOMO"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.paymentMethod").value("MOMO"))
                .andExpect(jsonPath("$.data.transactionCode").value(startsWith("MOMO-" + orderId)));

        mockMvc.perform(put("/api/admin/payments/{id}/status", paymentId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("paymentStatus", "PAID"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.paymentStatus").value("PAID"))
                .andExpect(jsonPath("$.data.paidAt").isNotEmpty());

        mockMvc.perform(put("/api/admin/shipments/{id}/status", shipmentId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "shippingStatus", "SHIPPING",
                                "carrierName", "GHN",
                                "trackingCode", "GHN-" + orderId
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.shippingStatus").value("SHIPPING"))
                .andExpect(jsonPath("$.data.carrierName").value("GHN"))
                .andExpect(jsonPath("$.data.trackingCode").value("GHN-" + orderId));

        mockMvc.perform(post("/api/products/{productId}/reviews", mainProduct.getId())
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("rating", 6, "content", "Rating khong hop le"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        MvcResult reviewResult = mockMvc.perform(post("/api/products/{productId}/reviews", mainProduct.getId())
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("rating", 5, "content", "San pham tot cho demo"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.rating").value(5))
                .andExpect(jsonPath("$.data.status").value("VISIBLE"))
                .andReturn();

        Long reviewId = responseData(reviewResult).get("id").asLong();
        mockMvc.perform(post("/api/products/{productId}/reviews", mainProduct.getId())
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("rating", 4, "content", "Review lan hai"))))
                .andExpect(status().isConflict());

        mockMvc.perform(get("/api/products/{productId}/reviews", mainProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(reviewId));

        mockMvc.perform(put("/api/admin/reviews/{id}/status", reviewId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("status", "HIDDEN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("HIDDEN"));

        MvcResult commentResult = mockMvc.perform(post("/api/products/{productId}/comments", mainProduct.getId())
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("content", "Ban nay co bao hanh khong?"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.parentId").doesNotExist())
                .andExpect(jsonPath("$.data.status").value("VISIBLE"))
                .andReturn();

        Long commentId = responseData(commentResult).get("id").asLong();
        MvcResult replyResult = mockMvc.perform(post("/api/products/{productId}/comments", mainProduct.getId())
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("content", "Bao hanh 12 thang nhe.", "parentId", commentId))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.parentId").value(commentId))
                .andReturn();

        Long replyId = responseData(replyResult).get("id").asLong();
        mockMvc.perform(get("/api/products/{productId}/comments", mainProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(commentId))
                .andExpect(jsonPath("$.data[0].replies[0].id").value(replyId));

        mockMvc.perform(put("/api/admin/comments/{id}/status", replyId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("status", "HIDDEN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("HIDDEN"));

        MvcResult feedbackResult = mockMvc.perform(post("/api/feedbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "fullName", "Khach Demo",
                                "email", "khach.demo@example.com",
                                "phone", "0909000001",
                                "subject", "Tu van san pham",
                                "message", "Toi muon tu van combo setup."
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("NEW"))
                .andReturn();

        Long feedbackId = responseData(feedbackResult).get("id").asLong();
        mockMvc.perform(get("/api/admin/feedbacks")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].id").value(feedbackId));

        mockMvc.perform(put("/api/admin/feedbacks/{id}/status", feedbackId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("status", "PROCESSING"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PROCESSING"));
    }

    @Test
    void buyNowOrderCreatesSingleProductOrderAndKeepsCurrentCart() throws Exception {
        String customerToken = createToken(RoleName.CUSTOMER);
        Product cartProduct = createProduct("buy-now-cart", BigDecimal.valueOf(400_000), 10);
        Product buyNowProduct = createProduct("buy-now-direct", BigDecimal.valueOf(1_500_000), 5);

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("productId", cartProduct.getId(), "quantity", 2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.totalItems").value(2));

        mockMvc.perform(post("/api/orders/buy-now")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "productId", buyNowProduct.getId(),
                                "quantity", 2,
                                "receiverName", "Buy Now Customer",
                                "receiverPhone", "0909000999",
                                "shippingAddress", "456 Le Loi, Quan 3, TP.HCM",
                                "paymentMethod", "COD",
                                "shippingMethod", "STANDARD",
                                "note", "Buy now order"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Create buy-now order successfully"))
                .andExpect(jsonPath("$.data.orderCode").isNotEmpty())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productId").value(buyNowProduct.getId()))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andExpect(jsonPath("$.data.subtotalAmount").value(3_000_000.0))
                .andExpect(jsonPath("$.data.shippingFee").value(0.0))
                .andExpect(jsonPath("$.data.totalAmount").value(3_000_000.0))
                .andExpect(jsonPath("$.data.payment.paymentMethod").value("COD"))
                .andExpect(jsonPath("$.data.payment.paymentStatus").value("UNPAID"))
                .andExpect(jsonPath("$.data.shipment.shippingStatus").value("PENDING"));

        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].productId").value(cartProduct.getId()))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andExpect(jsonPath("$.data.totalItems").value(2));

        entityManager.flush();
        entityManager.refresh(buyNowProduct);
        assertEquals(3, buyNowProduct.getStockQuantity());
    }

    @Test
    void buyNowOrderRejectsInvalidQuantity() throws Exception {
        String customerToken = createToken(RoleName.CUSTOMER);
        Product product = createProduct("buy-now-invalid-quantity", BigDecimal.valueOf(500_000), 5);

        mockMvc.perform(post("/api/orders/buy-now")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "productId", product.getId(),
                                "quantity", 0,
                                "receiverName", "Invalid Quantity",
                                "receiverPhone", "0909000888",
                                "shippingAddress", "789 Vo Van Tan, TP.HCM",
                                "paymentMethod", "COD",
                                "shippingMethod", "STANDARD"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void buyNowOrderRejectsOutOfStockProduct() throws Exception {
        String customerToken = createToken(RoleName.CUSTOMER);
        Product product = createProduct("buy-now-out-of-stock", BigDecimal.valueOf(500_000), 1);

        mockMvc.perform(post("/api/orders/buy-now")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "productId", product.getId(),
                                "quantity", 2,
                                "receiverName", "Out Of Stock",
                                "receiverPhone", "0909000777",
                                "shippingAddress", "123 Nguyen Hue, TP.HCM",
                                "paymentMethod", "COD",
                                "shippingMethod", "STANDARD"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product is out of stock"));
    }

    private Product createProduct(String slugPrefix, BigDecimal price, int stockQuantity) {
        String uniquePart = UUID.randomUUID().toString().substring(0, 8);
        String slug = slugPrefix + "-" + uniquePart;
        Category category = categoryRepository.findBySlug("phu-kien-setup").orElseThrow();

        Product product = new Product();
        product.setCategory(category);
        product.setName("Flow Product " + uniquePart);
        product.setSlug(slug);
        product.setShortDescription("Product for shopping flow integration test");
        product.setDescription("Product used to verify cart, order, payment, shipment, review and comment flows.");
        product.setPrice(price);
        product.setOldPrice(price.add(BigDecimal.valueOf(250_000)));
        product.setStockQuantity(stockQuantity);
        product.setSku("FLOW-" + uniquePart.toUpperCase());
        product.setStatus(ProductStatus.ACTIVE);
        Product savedProduct = productRepository.saveAndFlush(product);

        ProductImage image = new ProductImage();
        image.setProduct(savedProduct);
        image.setImageUrl("/uploads/products/" + slug + ".png");
        image.setAltText(savedProduct.getName());
        image.setIsPrimary(true);
        image.setSortOrder(1);
        productImageRepository.saveAndFlush(image);

        return savedProduct;
    }

    private String createToken(RoleName roleName) {
        Role role = roleRepository.findByName(roleName).orElseThrow();
        String uniquePart = UUID.randomUUID().toString();

        User user = new User();
        user.setFullName(roleName.name() + " Flow User");
        user.setEmail("flow-" + roleName.name().toLowerCase() + "-" + uniquePart + "@smartworkspace.local");
        user.setPhone("09" + uniquePart.replace("-", "").substring(0, 8));
        user.setPasswordHash(passwordEncoder.encode("123456"));
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(role);

        User savedUser = userRepository.saveAndFlush(user);
        return jwtService.generateToken(new CustomUserDetails(savedUser));
    }

    private Long findCartItemId(JsonNode cartData, Long productId) {
        for (JsonNode item : cartData.get("items")) {
            if (item.get("productId").asLong() == productId) {
                return item.get("id").asLong();
            }
        }
        throw new IllegalStateException("Cart item not found for product " + productId);
    }

    private byte[] json(Object value) throws Exception {
        return objectMapper.writeValueAsBytes(value);
    }

    private JsonNode responseData(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray()).get("data");
    }
}
