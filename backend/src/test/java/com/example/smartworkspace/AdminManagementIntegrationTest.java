package com.example.smartworkspace;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import java.util.UUID;

import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.RoleName;
import com.example.smartworkspace.enums.UserStatus;
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
class AdminManagementIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Test
    void adminVoucherCrudWorks() throws Exception {
        String adminToken = createToken();
        String code = "QA" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();

        MvcResult createResult = mockMvc.perform(post("/api/admin/vouchers")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "code", code,
                                "name", "QA Voucher",
                                "description", "Integration test voucher",
                                "discountType", "PERCENT",
                                "discountValue", 15,
                                "minOrderAmount", 100000,
                                "usageLimit", 10,
                                "startDate", "2026-07-01T00:00:00",
                                "endDate", "2026-07-31T23:59:00",
                                "status", "ACTIVE"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.code").value(code))
                .andExpect(jsonPath("$.data.usedCount").value(0))
                .andReturn();

        long id = responseData(createResult).get("id").asLong();

        mockMvc.perform(get("/api/admin/vouchers")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("search", code))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].id").value(id));

        mockMvc.perform(put("/api/admin/vouchers/{id}", id)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "code", code,
                                "name", "QA Voucher Updated",
                                "description", "Updated voucher",
                                "discountType", "FIXED_AMOUNT",
                                "discountValue", 50000,
                                "minOrderAmount", 200000,
                                "usageLimit", 12,
                                "startDate", "2026-07-01T00:00:00",
                                "endDate", "2026-08-31T23:59:00",
                                "status", "INACTIVE"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("QA Voucher Updated"))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        mockMvc.perform(delete("/api/admin/vouchers/{id}", id)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void adminBannerCrudWorks() throws Exception {
        String adminToken = createToken();
        String marker = "QA Banner " + UUID.randomUUID().toString().substring(0, 8);

        MvcResult createResult = mockMvc.perform(post("/api/admin/banners")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "title", marker,
                                "imageUrl", "/uploads/products/banner.png",
                                "linkUrl", "/san-pham",
                                "position", "HOME_HERO",
                                "sortOrder", 1,
                                "startDate", "2026-07-01T00:00:00",
                                "endDate", "2026-07-31T23:59:00",
                                "status", "ACTIVE"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value(marker))
                .andReturn();

        long id = responseData(createResult).get("id").asLong();

        mockMvc.perform(get("/api/admin/banners")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("search", marker))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].id").value(id));

        mockMvc.perform(put("/api/admin/banners/{id}", id)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "title", marker + " Updated",
                                "imageUrl", "/uploads/products/banner-updated.png",
                                "linkUrl", "/admin",
                                "position", "HOME_SECONDARY",
                                "sortOrder", 2,
                                "startDate", "2026-07-01T00:00:00",
                                "endDate", "2026-08-31T23:59:00",
                                "status", "INACTIVE"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.position").value("HOME_SECONDARY"))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        mockMvc.perform(delete("/api/admin/banners/{id}", id)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void dashboardContainsRevenueSeriesAndTopProductsFields() throws Exception {
        String adminToken = createToken();

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.revenueSeries", hasSize(7)))
                .andExpect(jsonPath("$.data.revenueSeries[0].date").exists())
                .andExpect(jsonPath("$.data.topProducts").isArray());
    }

    private String createToken() {
        Role role = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
        String uniquePart = UUID.randomUUID().toString();

        User user = new User();
        user.setFullName("Admin Management Test User");
        user.setEmail("admin-management-" + uniquePart + "@smartworkspace.local");
        user.setPhone("08" + uniquePart.replace("-", "").substring(0, 8));
        user.setPasswordHash(passwordEncoder.encode("123456"));
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(role);

        User savedUser = userRepository.saveAndFlush(user);
        return jwtService.generateToken(new CustomUserDetails(savedUser));
    }

    private byte[] json(Object value) throws Exception {
        return objectMapper.writeValueAsBytes(value);
    }

    private JsonNode responseData(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray()).get("data");
    }
}
