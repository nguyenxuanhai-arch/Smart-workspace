package com.example.smartworkspace;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import com.example.smartworkspace.dtos.product.ProductRequest;
import com.example.smartworkspace.entities.Category;
import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.enums.RoleName;
import com.example.smartworkspace.enums.UserStatus;
import com.example.smartworkspace.repositories.CategoryRepository;
import com.example.smartworkspace.repositories.ProductImageRepository;
import com.example.smartworkspace.repositories.RoleRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import com.example.smartworkspace.securities.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = "app.upload.product-image-dir=target/test-uploads/products")
@AutoConfigureMockMvc
@Transactional
class ProductImageUploadIntegrationTest {
    private static final Path TEST_UPLOAD_DIR = Path.of("target/test-uploads/products");
    private static final byte[] PNG_BYTES = new byte[] {
            (byte) 0x89, 'P', 'N', 'G', '\r', '\n', 0x1A, '\n'
    };

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        cleanUploadDir();
        adminToken = createAdminToken();
    }

    @AfterEach
    void tearDown() throws Exception {
        cleanUploadDir();
    }

    @Test
    void adminUploadsProductImageToLocalFolder() throws Exception {
        MvcResult result = uploadProductImage();
        JsonNode data = responseData(result);
        String fileName = data.get("fileName").asText();
        String url = data.get("url").asText();

        assertThat(url).isEqualTo("/uploads/products/" + fileName);
        assertThat(Files.exists(TEST_UPLOAD_DIR.resolve(fileName))).isTrue();

        mockMvc.perform(get(url))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.IMAGE_PNG));
    }

    @Test
    void adminCreatesProductWithUploadedLocalImageUrl() throws Exception {
        MvcResult uploadResult = uploadProductImage();
        String imageUrl = responseData(uploadResult).get("url").asText();
        Category category = categoryRepository.findBySlug("ban-lam-viec").orElseThrow();
        String uniquePart = UUID.randomUUID().toString().substring(0, 8);
        String slug = "local-image-test-product-" + uniquePart;
        String sku = "TEST-LOCAL-" + uniquePart.toUpperCase();

        ProductRequest request = new ProductRequest();
        request.setCategoryId(category.getId());
        request.setName("Local Image Test Product");
        request.setSlug(slug);
        request.setShortDescription("Product created by local image upload integration test");
        request.setDescription("This product verifies that local upload URLs are persisted in product images.");
        request.setPrice(BigDecimal.valueOf(1200000));
        request.setOldPrice(BigDecimal.valueOf(1500000));
        request.setStockQuantity(5);
        request.setSku(sku);
        request.setStatus(ProductStatus.ACTIVE);
        request.setImageUrls(List.of(imageUrl));

        MvcResult createResult = mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value(slug))
                .andExpect(jsonPath("$.data.images[0].imageUrl").value(imageUrl))
                .andExpect(jsonPath("$.data.images[0].isPrimary").value(true))
                .andReturn();

        Long productId = responseData(createResult).get("id").asLong();
        assertThat(productImageRepository.findByProductIdOrderBySortOrderAsc(productId))
                .singleElement()
                .satisfies(image -> {
                    assertThat(image.getImageUrl()).isEqualTo(imageUrl);
                    assertThat(image.getIsPrimary()).isTrue();
                    assertThat(image.getSortOrder()).isEqualTo(1);
                });
    }

    private MvcResult uploadProductImage() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "desk-test.png",
                MediaType.IMAGE_PNG_VALUE,
                PNG_BYTES
        );

        return mockMvc.perform(multipart("/api/admin/uploads/product-images")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Upload product image successfully"))
                .andExpect(jsonPath("$.data.originalFileName").value("desk-test.png"))
                .andExpect(jsonPath("$.data.contentType").value(MediaType.IMAGE_PNG_VALUE))
                .andExpect(jsonPath("$.data.size").value(PNG_BYTES.length))
                .andExpect(jsonPath("$.data.url").value(org.hamcrest.Matchers.startsWith("/uploads/products/")))
                .andReturn();
    }

    private JsonNode responseData(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray()).get("data");
    }

    private String createAdminToken() {
        Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
        String uniquePart = UUID.randomUUID().toString();

        User user = new User();
        user.setFullName("Upload Test Admin");
        user.setEmail("upload-test-admin-" + uniquePart + "@smartworkspace.local");
        user.setPhone("09" + uniquePart.replace("-", "").substring(0, 8));
        user.setPasswordHash(passwordEncoder.encode("123456"));
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(adminRole);

        User savedUser = userRepository.saveAndFlush(user);
        return jwtService.generateToken(new CustomUserDetails(savedUser));
    }

    private void cleanUploadDir() throws Exception {
        if (!Files.exists(TEST_UPLOAD_DIR)) {
            return;
        }

        try (var paths = Files.walk(TEST_UPLOAD_DIR)) {
            paths
                    .filter(path -> !path.equals(TEST_UPLOAD_DIR))
                    .sorted((left, right) -> right.compareTo(left))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (Exception exception) {
                            throw new IllegalStateException("Could not delete test upload file", exception);
                        }
                    });
        }
    }
}
