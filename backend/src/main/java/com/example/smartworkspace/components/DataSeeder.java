package com.example.smartworkspace.components;

import java.io.InputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import com.example.smartworkspace.entities.Category;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.ProductImage;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.repositories.CategoryRepository;
import com.example.smartworkspace.repositories.ProductImageRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Value("${app.upload.product-image-dir:uploads/products}")
    private String productImageDir;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (productRepository.count() > 8) {
            log.info("Products already exist. Skipping seed.");
            return;
        }

        log.info("Seeding data...");

        Category deskCategory = null;
        Category chairCategory = null;
        Category accessoryCategory = null;

        if (categoryRepository.count() == 0) {
            deskCategory = new Category();
            deskCategory.setName("Bàn nâng hạ");
            deskCategory.setSlug("ban-nang-ha");
            deskCategory.setStatus(CommonStatus.ACTIVE);
            deskCategory = categoryRepository.save(deskCategory);

            chairCategory = new Category();
            chairCategory.setName("Ghế công thái học");
            chairCategory.setSlug("ghe-cong-thai-hoc");
            chairCategory.setStatus(CommonStatus.ACTIVE);
            chairCategory = categoryRepository.save(chairCategory);

            accessoryCategory = new Category();
            accessoryCategory.setName("Phụ kiện");
            accessoryCategory.setSlug("phu-kien");
            accessoryCategory.setStatus(CommonStatus.ACTIVE);
            accessoryCategory = categoryRepository.save(accessoryCategory);
        } else {
            // Lấy danh mục cũ nếu đã có (tạm thời lấy các record đầu tiên)
            var categories = categoryRepository.findAll();
            deskCategory = categories.stream().filter(c -> c.getSlug().equals("ban-nang-ha")).findFirst().orElse(categories.get(0));
            chairCategory = categories.stream().filter(c -> c.getSlug().equals("ghe-cong-thai-hoc")).findFirst().orElse(categories.get(0));
            accessoryCategory = categories.stream().filter(c -> c.getSlug().equals("phu-kien")).findFirst().orElse(categories.get(0));
        }

        // 2. Create products and download images
        createProduct("Smart Standing Desk S1", "smart-standing-desk-s1", "Dual motor, 100kg load, Bluetooth", 8500000, 10000000, deskCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuBXSodoyR9Qr6jRVl96UvgDXO3DA--qOSE6lWceBD58aVOjiAX6-69fJ_FLp5jcJ-Yh9ypZA0aD_Y8sjzYaUx_juXms7L8tOZMDnx1JdfJuHZlC009qJZU8j6FNCE_Tt5OZZib7Yc0_-HafFS22mqdqGP6_oNOJv2gbcETKmvhtKZ6QFC1_JIoQLB3rMyJzoyEfXv3KohhdB98ZeyxGXUQNrwFnrW70Bd1zp4Dof6TRxPgtmvAegl-eVg");

        createProduct("Ergo Mesh Chair M2", "ergo-mesh-chair-m2", "3D Armrest, Dynamic Lumbar Support", 5200000, 5490000, chairCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuB32ZQwrCRb7NoaLeHRhDnsdPX9NILXrxBmvBUueyGtujwNFPohb90vbuGR1ASvXTN1XyftFaTKf9vO3mKSzcTfBTl0zSO3eFdcdktXUJNTWoMnWXq8uMeooOQyHCFd0QbjCQSjKtEsX6fRAqyxYvzLU9i1crguxkmymZRSHKM0jxz080pVXy_1mZnAR5LuDMFB1MxhHiciG0yLi6g_gJSKvy1pZHCtTEu5YllBWMAM4BB6gMSjQuQhOw");

        createProduct("Monitor Light Bar", "monitor-light-bar", "Auto-dimming, CRI > 95, USB-C", 1250000, 1490000, accessoryCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuAbRWfuWdYSDIax-qKlZ7-NXueVhmXrITmSvADQPjr4MhNp3gmxUKneudSCQTZYMktuaKx9rH1cLz8Cp7D6-uzT4q2T1kCuH4Ss8_QxQF54XRg8jqSGrl4gwwUq6GWfcKdB1iewKuI5hcKjxZIlqUboqojJEyJkFw4GFr0sSKilK4sWrWNa-NqhZoR6iJoWgya7PiPTd_vZ-Mis9663_5gK2in92vSmfD1HbvWiJZnI8KiYtxfnaCZmBQ");

        createProduct("Aluminum Laptop Stand", "aluminum-laptop-stand", "6-level tilt, portable", 450000, 890000, accessoryCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuC_8JksOM7CndbqdQjJ8CxK-j1OfFfaKTyg4wmZQkEzoJWiPcsc46ZSi08cxkPygzWmARHvCFyT9XDPLulmONnLQTHR2PYRA4T0EZCw0SqRzxKMXPejtT1kRKkRN9kRu2X9qkBOS7exPVdwmon3HonHsk2VaDeBbjg9yMpPtfYnZyn4fc5ZCv1pdND4DLHoaBiM7PEo85m3ThqwHHzlMwKAVkxxoRMdguVOTmBZQ87WVP8I7uNlBXM39g");

        createProduct("Wireless Charging Mat", "wireless-charging-mat", "15W Fast Charge, Felt Finish", 890000, 1290000, accessoryCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuBqvolD6P0kvAd-fRQbYTtvAs0lrKZqTjeTAdvXZyvq0S3uHVR3ZrIP5FnxcqwvT7G09iuGtF_94U_Jmeu2B9zGlwJFYRn-t-HFibg6UgndX2cAFmgPM9WzIoNQdxrjOd61VrwdP4eLW1p3xQUNLzpDde3AQo8fOsf9gSJ4Lv8GEFTO5ood9YkqooeM-YO1BqE2rrpT9j0p7slpRw78Jg3U6pKtpAqdFSAzZFYcPOMoq6b6n-WCNJeMtQ");

        createProduct("Cable Management Kit", "cable-management-kit", "Under-desk tray, 10 clips", 350000, 590000, accessoryCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuBhyCQCDBVoy25buZ8dVFSYzmbVw7FzgMaKMHAzeZ2vDQCtqUJwH7wzYfsdRTcGm-tn9sFls1Roerp1O27At_dnwRB5NY0F9ErQt1kHq6iMBNZub33jJmxZxpW0t1_ZERfS6FJl3ydpfIQzDpZMpQIgSt1EMv1FJtyRf_SeSRoWeMen97pQLR4D_2Ei2H4q7BnXE3MBiVSOC3jAP04K0hhc0wQbpV47RDOO7G1QVSjovjCHdhUJS6gpNw");

        createProduct("Creator Setup", "creator-setup", "Tập trung vào thẩm mỹ, ánh sáng đẹp", 11990000, 14990000, deskCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuB5wv56NmyUt2VtM6JIAaOMju_5OIY2iDw6JMLe0sLSfXFOva3XvHfGlrtUfUXuS5HJ-3XWTksyf3ur9vvuZfzlpb4SxHy9kvFb0IFmPDPyaXHKO4pfcSDqZKkeEHXnl5hPsJ4yBW-nQYg3KvSVTscXtXxb1CIJHshHSUTxyzBXL1y44Z564kR_OcFVIpMvMN6teZKZy-Mj-L3rvJwdDr1xx3w29qIEkNe_dyBeMm6nX30wAcn3StRLeA");

        createProduct("Coder Elite", "coder-elite", "Tối ưu sự tập trung, màn hình kép", 13490000, 16990000, deskCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuDj1LT9DX5FktKZlVsXKv3FBptAHF066yHERUyh_gIr6CI8Wpiiu9FQQOaagVuq1wcb7l1EE9XkRAhtkwnhFPorf9MU-z0z9Zym-NhiWk-X8SmiEyW_mKGXfubN_WkNEyN3oRjCva-fRbQ_R3dsy0AAXpY5PEXsmJGG902cLfrJCwQBcmQviR402UfY1OdbkVPuCS6vOWz-2d4VsoolalAGV7CA6_nqwkXy8fQ-KahDJrEilvCw-_CMRA");

        createProduct("Hybrid Focus", "hybrid-focus", "Cân bằng giữa chuyên nghiệp và gọn gàng", 9990000, 12990000, deskCategory, "https://lh3.googleusercontent.com/aida-public/AB6AXuBaNLiXl_umLCjoZeLJzcCy2-SyZsN9KPl45QRuTV4F9gfUIUEIddYM-DZ1XGKaJAM-SMb4UZlbSiZVLXHNmjHZGTKlA-u4Mm012-Ka8JHxD3FRalme08L-hTuvVpBaV-GR0WbxTJFsYxIilOC47agvZJsLixj-BbZLqRSYpfI_h_XGgheKI2SEIxg8Q2caqmCSPv1lRkL1bl3_8zHEYiPwUXQwuucygooHY6LYLN5OsGIe5jXUvtfr_g");

        log.info("Data seeding completed!");
    }

    private void createProduct(String name, String slug, String desc, double price, double oldPrice, Category category, String imageUrl) {
        if (productRepository.existsBySlug(slug)) {
            log.info("Product already exists, skipping: {}", name);
            return;
        }

        try {
            Product p = new Product();
            p.setName(name);
            p.setSlug(slug);
            p.setShortDescription(desc);
            p.setDescription(desc);
            p.setPrice(BigDecimal.valueOf(price));
            p.setOldPrice(BigDecimal.valueOf(oldPrice));
            p.setStockQuantity(100);
            p.setSku("SW-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            p.setStatus(ProductStatus.ACTIVE);
            p.setCategory(category);
            p = productRepository.save(p);

            // download image
            Path uploadDir = Paths.get(productImageDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String fileName = UUID.randomUUID().toString() + ".webp";
            Path targetPath = uploadDir.resolve(fileName);

            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            try (InputStream in = connection.getInputStream()) {
                Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            ProductImage pi = new ProductImage();
            pi.setProduct(p);
            pi.setImageUrl("/uploads/products/" + fileName);
            pi.setAltText(name);
            pi.setIsPrimary(true);
            pi.setSortOrder(0);
            productImageRepository.save(pi);

            log.info("Saved product and image for: {}", name);
        } catch (Exception e) {
            log.error("Failed to seed product: " + name, e);
        }
    }
}
