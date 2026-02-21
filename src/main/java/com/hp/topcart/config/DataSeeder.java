package com.hp.topcart.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.hp.topcart.entity.Product;
import com.hp.topcart.repository.ProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final com.hp.topcart.repository.UserRepository userRepository;

        public DataSeeder(ProductRepository productRepository,
                        com.hp.topcart.repository.UserRepository userRepository) {
                this.productRepository = productRepository;
                this.userRepository = userRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                // Seed Admin User
                if (userRepository.findByMobileNumber("9876543210").isEmpty()) {
                        com.hp.topcart.entity.User admin = new com.hp.topcart.entity.User("Admin", "9876543210",
                                        "ADMIN");
                        userRepository.save(admin);
                        System.out.println("✅ DataSeeder: Admin user created (Mobile: 9876543210)");
                }

                // Only seed if the products table is empty to avoid duplicating or breaking
                // foreign keys
                if (productRepository.count() == 0) {
                        List<Product> products = Arrays.asList(
                                        // 10 PC Devices
                                        createProduct("Alienware Aurora R16", "High-performance gaming desktop",
                                                        205000.00, 4.8, "Dell", 15, 25, "PC Devices",
                                                        "/images/alienware-aurora-r16.jpg"),
                                        createProduct("HP Omen 45L", "Ultimate gaming machine", 245000.00, 4.7, "HP",
                                                        10, 18, "PC Devices", "/images/hp-omen-45l.jpg"),
                                        createProduct("ASUS ROG Strix G16", "Powerful gaming laptop", 165000.00, 4.6,
                                                        "ASUS", 20, 45, "PC Devices", "/images/asus-rog-strix-g16.jpg"),
                                        createProduct("Lenovo Legion Pro 7i", "AI-tuned gaming laptop", 185000.00, 4.9,
                                                        "Lenovo", 12, 30, "PC Devices",
                                                        "/images/lenovo-legion-pro-7i.jpg"),
                                        createProduct("MSI Raider GE78", "Desktop caliber performance", 295000.00, 4.8,
                                                        "MSI", 8, 15, "PC Devices", "/images/msi-raider-ge78.jpg"),
                                        createProduct("Acer Predator Helios 16", "Fast 165Hz display", 195000.00, 4.5,
                                                        "Acer", 18, 22, "PC Devices",
                                                        "/images/acer-predator-helios-16.jpg"),
                                        createProduct("Razer Blade 16", "Sleek and ultra-portable", 325000.00, 4.7,
                                                        "Razer", 5, 12, "PC Devices", "/images/razer-blade-16.jpg"),
                                        createProduct("Apple Mac Mini M2", "Small footprint, giant performance",
                                                        59900.00, 4.8, "Apple", 25, 50, "PC Devices",
                                                        "/images/apple-mac-mini-m2.jpg"),
                                        createProduct("Corsair Vengeance i7400", "Custom-built feel", 215000.00, 4.6,
                                                        "Corsair", 7, 10, "PC Devices",
                                                        "/images/corsair-vengeance-i7400.jpg"),
                                        createProduct("CyberPowerPC Gamer Supreme", "Pro-level gaming desktop",
                                                        145000.00, 4.4, "CyberPowerPC", 15, 20, "PC Devices",
                                                        "/images/cyberpowerpc-gamer-supreme.jpg"),

                                        // 10 Mobile Devices
                                        createProduct("iPhone 15 Pro Max", "Titanium design with A17 Pro", 159900.00,
                                                        4.9, "Apple", 30, 100, "Mobile Devices",
                                                        "/images/iphone-15-pro-max.jpg"),
                                        createProduct("Samsung Galaxy S24 Ultra", "Galaxy AI and titanium", 129999.00,
                                                        4.8, "Samsung", 25, 85, "Mobile Devices",
                                                        "/images/samsung-galaxy-s24-ultra.jpg"),
                                        createProduct("Google Pixel 8 Pro", "Best pro camera with AI", 106999.00, 4.7,
                                                        "Google", 20, 60, "Mobile Devices",
                                                        "/images/google-pixel-8-pro.jpg"),
                                        createProduct("OnePlus 12", "Snapdragon 8 Gen 3 power", 64999.00, 4.6,
                                                        "OnePlus", 35, 90, "Mobile Devices", "/images/oneplus-12.jpg"),
                                        createProduct("Xiaomi 14 Ultra", "Leica optics photography", 99999.00, 4.7,
                                                        "Xiaomi", 15, 40, "Mobile Devices",
                                                        "/images/xiaomi-14-ultra.jpg"),
                                        createProduct("Samsung Galaxy Z Flip 5", "Foldable innovation", 99999.00, 4.7,
                                                        "Samsung", 15, 40, "Mobile Devices",
                                                        "/images/samsung-galaxy-z-flip-5.jpg"),
                                        createProduct("Motorola Razr 40 Ultra", "Flip into the future", 69999.00, 4.4,
                                                        "Motorola", 18, 30, "Mobile Devices",
                                                        "/images/motorola-razr-40-ultra.jpg"),
                                        createProduct("ASUS ROG Phone 8", "Premium gaming daily driver", 94999.00, 4.8,
                                                        "ASUS", 10, 25, "Mobile Devices",
                                                        "/images/asus-rog-phone-8.jpg"),
                                        createProduct("Vivo X100 Pro", "Zeiss APO camera", 89999.00, 4.6, "Vivo", 12,
                                                        35, "Mobile Devices", "/images/vivo-x100-pro.jpg"),
                                        createProduct("iQOO 12", "Performance flagship", 52999.00, 4.5, "iQOO", 20, 45,
                                                        "Mobile Devices", "/images/iqoo-12.jpg"),

                                        // 10 Accessories
                                        createProduct("Sony WH-1000XM5", "Best noise canceling headphones", 29990.00,
                                                        4.8, "Sony", 20, 150, "Accessories",
                                                        "/images/sony-wh-1000xm5.jpg"),
                                        createProduct("Logitech MX Master 3S", "Ultimate productivity mouse", 9995.00,
                                                        4.9, "Logitech", 25, 200, "Accessories",
                                                        "/images/logitech-mx-master-3s.jpg"),
                                        createProduct("Keychron K2 V2", "Wireless mechanical keyboard", 8499.00, 4.7,
                                                        "Keychron", 15, 60, "Accessories",
                                                        "/images/keychron-k2-v2.jpg"),
                                        createProduct("Apple AirPods Pro 2", "MagSafe charging case", 24900.00, 4.8,
                                                        "Apple", 30, 120, "Accessories",
                                                        "/images/apple-airpods-pro-2.jpg"),
                                        createProduct("Samsung T7 Shield 1TB", "Rugged portable SSD", 10499.00, 4.8,
                                                        "Samsung", 20, 45, "Accessories",
                                                        "/images/samsung-t7-shield-1tb.jpg"),
                                        createProduct("Anker 737 Power Bank", "24,000mAh portable charger", 14999.00,
                                                        4.9, "Anker", 10, 30, "Accessories",
                                                        "/images/anker-737-power-bank.jpg"),
                                        createProduct("Razer DeathAdder V3", "Ultra-lightweight mouse", 6499.00, 4.7,
                                                        "Razer", 18, 55, "Accessories",
                                                        "/images/razer-deathadder-v3.jpg"),
                                        createProduct("HyperX Cloud III", "Comfortable gaming headset", 8990.00, 4.6,
                                                        "HyperX", 22, 80, "Accessories",
                                                        "/images/hyperx-cloud-iii.jpg"),
                                        createProduct("Belkin 3-in-1 Charger", "Wireless charging stand", 12999.00, 4.5,
                                                        "Belkin", 12, 25, "Accessories",
                                                        "/images/belkin-3-in-1-charger.jpg"),
                                        createProduct("Dell 4K Webcams", "Pro webcam for streaming", 18500.00, 4.4,
                                                        "Dell", 8, 15, "Accessories", "/images/dell-4k-webcams.jpg"));

                        productRepository.saveAll(products);
                        System.out.println("✅ DataSeeder: Successfully inserted " + products.size()
                                        + " products with images!");
                } else {
                        System.out.println("ℹ️ DataSeeder: Products already exist (" + productRepository.count()
                                        + "), skipping seed.");
                }
        }

        private Product createProduct(String name, String desc, Double price, Double rating, String seller,
                        Integer stock, Integer reviews, String category, String imageUrl) {
                Product p = new Product(null, name, desc, price, rating, seller, stock, reviews, category);
                com.hp.topcart.entity.ProductImage img = new com.hp.topcart.entity.ProductImage(null,
                                name.toLowerCase().replace(" ", "-"), imageUrl);
                p.setImages(java.util.Collections.singletonList(img));
                return p;
        }
}
