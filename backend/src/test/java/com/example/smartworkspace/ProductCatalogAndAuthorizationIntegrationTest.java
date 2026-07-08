package com.example.smartworkspace;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.UUID;

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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductCatalogAndAuthorizationIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

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

    @Test
    void publicCatalogSupportsDetailSearchFilterSortAndPagination() throws Exception {
        String marker = "catalog-test-" + UUID.randomUUID().toString().substring(0, 8);
        Category category = categoryRepository.findBySlug("phu-kien-setup").orElseThrow();
        Product lowPriceProduct = createProduct(
                category,
                "QA " + marker + " Aluminum Stand",
                marker + "-stand",
                "QA-" + marker.toUpperCase() + "-LOW",
                BigDecimal.valueOf(1_200_000),
                BigDecimal.valueOf(1_500_000)
        );
        Product highPriceProduct = createProduct(
                category,
                "QA " + marker + " Desk Mat",
                marker + "-mat",
                "QA-" + marker.toUpperCase() + "-HIGH",
                BigDecimal.valueOf(2_400_000),
                BigDecimal.valueOf(2_900_000)
        );

        mockMvc.perform(get("/api/products/{id}", lowPriceProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value(lowPriceProduct.getSlug()))
                .andExpect(jsonPath("$.data.category.id").value(category.getId()))
                .andExpect(jsonPath("$.data.images", hasSize(1)))
                .andExpect(jsonPath("$.data.images[0].imageUrl").value(startsWith("/uploads/products/")))
                .andExpect(jsonPath("$.data.oldPrice").value(1_500_000.0));

        mockMvc.perform(get("/api/products/slug/{slug}", lowPriceProduct.getSlug()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(lowPriceProduct.getId()));

        mockMvc.perform(get("/api/products")
                        .param("search", marker)
                        .param("categoryId", category.getId().toString())
                        .param("minPrice", "1000000")
                        .param("maxPrice", "2500000")
                        .param("sort", "price_asc")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(2)))
                .andExpect(jsonPath("$.data.items[0].slug").value(lowPriceProduct.getSlug()))
                .andExpect(jsonPath("$.data.items[1].slug").value(highPriceProduct.getSlug()))
                .andExpect(jsonPath("$.data.totalElements").value(2));

        mockMvc.perform(get("/api/products")
                        .param("search", marker)
                        .param("sort", "price_desc")
                        .param("page", "0")
                        .param("size", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].slug").value(highPriceProduct.getSlug()))
                .andExpect(jsonPath("$.data.page").value(0))
                .andExpect(jsonPath("$.data.size").value(1))
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.totalPages").value(2));
    }

    @Test
    void adminProductCatalogReturnsProductsAcrossStatuses() throws Exception {
        String marker = "admin-catalog-test-" + UUID.randomUUID().toString().substring(0, 8);
        Category category = categoryRepository.findBySlug("phu-kien-setup").orElseThrow();
        Product activeProduct = createProduct(
                category,
                "QA " + marker + " Active Stand",
                marker + "-active",
                "QA-" + marker.toUpperCase() + "-ACTIVE",
                BigDecimal.valueOf(1_200_000),
                BigDecimal.valueOf(1_500_000)
        );
        Product inactiveProduct = createProduct(
                category,
                "QA " + marker + " Hidden Stand",
                marker + "-inactive",
                "QA-" + marker.toUpperCase() + "-INACTIVE",
                BigDecimal.valueOf(2_400_000),
                BigDecimal.valueOf(2_900_000)
        );
        inactiveProduct.setStatus(ProductStatus.INACTIVE);
        productRepository.saveAndFlush(inactiveProduct);
        Product outOfStockProduct = createProduct(
                category,
                "QA " + marker + " Out Of Stock Stand",
                marker + "-out-of-stock",
                "QA-" + marker.toUpperCase() + "-OUT",
                BigDecimal.valueOf(3_600_000),
                BigDecimal.valueOf(3_900_000)
        );
        outOfStockProduct.setStatus(ProductStatus.OUT_OF_STOCK);
        productRepository.saveAndFlush(outOfStockProduct);
        String adminToken = createToken(RoleName.ADMIN);

        mockMvc.perform(get("/api/products")
                        .param("search", marker)
                        .param("sort", "price_asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].slug").value(activeProduct.getSlug()))
                .andExpect(jsonPath("$.data.totalElements").value(1));

        mockMvc.perform(get("/api/admin/products")
                        .param("search", marker)
                        .param("sort", "price_asc")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(3)))
                .andExpect(jsonPath("$.data.items[0].slug").value(activeProduct.getSlug()))
                .andExpect(jsonPath("$.data.items[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.items[1].slug").value(inactiveProduct.getSlug()))
                .andExpect(jsonPath("$.data.items[1].status").value("INACTIVE"))
                .andExpect(jsonPath("$.data.items[2].slug").value(outOfStockProduct.getSlug()))
                .andExpect(jsonPath("$.data.items[2].status").value("OUT_OF_STOCK"))
                .andExpect(jsonPath("$.data.totalElements").value(3));

        mockMvc.perform(get("/api/admin/products/{id}", inactiveProduct.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(inactiveProduct.getId()))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));
    }

    @Test
    void securityAllowsPublicApisBlocksAnonymousUserApisAndRequiresAdminRole() throws Exception {
        String customerToken = createToken(RoleName.CUSTOMER);
        String adminToken = createToken(RoleName.ADMIN);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalProducts").isNumber())
                .andExpect(jsonPath("$.data.totalOrders").isNumber());
    }

    private Product createProduct(
            Category category,
            String name,
            String slug,
            String sku,
            BigDecimal price,
            BigDecimal oldPrice
    ) {
        Product product = new Product();
        product.setCategory(category);
        product.setName(name);
        product.setSlug(slug);
        product.setShortDescription("Searchable " + name);
        product.setDescription("Integration test product for catalog flow.");
        product.setPrice(price);
        product.setOldPrice(oldPrice);
        product.setStockQuantity(20);
        product.setSku(sku);
        product.setStatus(ProductStatus.ACTIVE);
        Product savedProduct = productRepository.saveAndFlush(product);

        ProductImage image = new ProductImage();
        image.setProduct(savedProduct);
        image.setImageUrl("/uploads/products/" + slug + ".png");
        image.setAltText(name);
        image.setIsPrimary(true);
        image.setSortOrder(1);
        productImageRepository.saveAndFlush(image);

        return savedProduct;
    }

    private String createToken(RoleName roleName) {
        Role role = roleRepository.findByName(roleName).orElseThrow();
        String uniquePart = UUID.randomUUID().toString();

        User user = new User();
        user.setFullName(roleName.name() + " Test User");
        user.setEmail(roleName.name().toLowerCase() + "-" + uniquePart + "@smartworkspace.local");
        user.setPhone("09" + uniquePart.replace("-", "").substring(0, 8));
        user.setPasswordHash(passwordEncoder.encode("123456"));
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(role);

        User savedUser = userRepository.saveAndFlush(user);
        return jwtService.generateToken(new CustomUserDetails(savedUser));
    }
}
