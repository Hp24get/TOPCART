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
                                        // 10 PC Devices (Prices in INR)
                                        new Product(null, "Alienware Aurora R16", "High-performance gaming desktop",
                                                        205000.00, 4.8, "Dell", 15, 25, "PC Devices"),
                                        new Product(null, "HP Omen 45L", "Ultimate gaming machine", 245000.00, 4.7,
                                                        "HP", 10, 18, "PC Devices"),
                                        new Product(null, "ASUS ROG Strix G16", "Powerful gaming laptop", 165000.00,
                                                        4.6, "ASUS", 20, 45, "PC Devices"),
                                        new Product(null, "Lenovo Legion Pro 7i", "AI-tuned gaming laptop", 185000.00,
                                                        4.9, "Lenovo", 12, 30, "PC Devices"),
                                        new Product(null, "MSI Raider GE78", "Desktop caliber performance", 295000.00,
                                                        4.8, "MSI", 8, 15, "PC Devices"),
                                        new Product(null, "Acer Predator Helios 16", "Fast 165Hz display", 195000.00,
                                                        4.5, "Acer", 18, 22, "PC Devices"),
                                        new Product(null, "Razer Blade 16", "Sleek and ultra-portable", 325000.00, 4.7,
                                                        "Razer", 5, 12, "PC Devices"),
                                        new Product(null, "Apple Mac Mini M2", "Small footprint, giant performance",
                                                        59900.00, 4.8, "Apple", 25, 50, "PC Devices"),
                                        new Product(null, "Corsair Vengeance i7400", "Custom-built feel", 215000.00,
                                                        4.6, "Corsair", 7, 10, "PC Devices"),
                                        new Product(null, "CyberPowerPC Gamer Supreme", "Pro-level gaming desktop",
                                                        145000.00, 4.4, "CyberPowerPC", 15, 20, "PC Devices"),

                                        // 10 Mobile Devices
                                        new Product(null, "iPhone 15 Pro Max", "Titanium design with A17 Pro",
                                                        159900.00, 4.9, "Apple", 30, 100, "Mobile Devices"),
                                        new Product(null, "Samsung Galaxy S24 Ultra", "Galaxy AI and titanium",
                                                        129999.00, 4.8, "Samsung", 25, 85, "Mobile Devices"),
                                        new Product(null, "Google Pixel 8 Pro", "Best pro camera with AI", 106999.00,
                                                        4.7, "Google", 20, 60, "Mobile Devices"),
                                        new Product(null, "OnePlus 12", "Snapdragon 8 Gen 3 power", 64999.00, 4.6,
                                                        "OnePlus", 35, 90, "Mobile Devices"),
                                        new Product(null, "Xiaomi 14 Ultra", "Leica optics photography", 99999.00, 4.7,
                                                        "Xiaomi", 15, 40, "Mobile Devices"),
                                        new Product(null, "Samsung Galaxy Z Flip 5", "Foldable innovation", 99999.00,
                                                        4.7,
                                                        "Samsung", 15, 40, "Mobile Devices"),
                                        new Product(null, "Motorola Razr 40 Ultra", "Flip into the future", 69999.00,
                                                        4.4, "Motorola", 18, 30, "Mobile Devices"),
                                        new Product(null, "ASUS ROG Phone 8", "Premium gaming daily driver", 94999.00,
                                                        4.8, "ASUS", 10, 25, "Mobile Devices"),
                                        new Product(null, "Vivo X100 Pro", "Zeiss APO camera", 89999.00, 4.6, "Vivo",
                                                        12, 35, "Mobile Devices"),
                                        new Product(null, "iQOO 12", "Performance flagship", 52999.00, 4.5, "iQOO", 20,
                                                        45, "Mobile Devices"),

                                        // 10 Accessories
                                        new Product(null, "Sony WH-1000XM5", "Best noise canceling headphones",
                                                        29990.00, 4.8, "Sony", 20, 150, "Accessories"),
                                        new Product(null, "Logitech MX Master 3S", "Ultimate productivity mouse",
                                                        9995.00, 4.9, "Logitech", 25, 200, "Accessories"),
                                        new Product(null, "Keychron K2 V2", "Wireless mechanical keyboard", 8499.00,
                                                        4.7, "Keychron", 15, 60, "Accessories"),
                                        new Product(null, "Apple AirPods Pro 2", "MagSafe charging case", 24900.00, 4.8,
                                                        "Apple", 30, 120, "Accessories"),
                                        new Product(null, "Samsung T7 Shield 1TB", "Rugged portable SSD", 10499.00, 4.8,
                                                        "Samsung", 20, 45, "Accessories"),
                                        new Product(null, "Anker 737 Power Bank", "24,000mAh portable charger",
                                                        14999.00, 4.9, "Anker", 10, 30, "Accessories"),
                                        new Product(null, "Razer DeathAdder V3", "Ultra-lightweight mouse", 6499.00,
                                                        4.7, "Razer", 18, 55, "Accessories"),
                                        new Product(null, "HyperX Cloud III", "Comfortable gaming headset", 8990.00,
                                                        4.6, "HyperX", 22, 80, "Accessories"),
                                        new Product(null, "Belkin 3-in-1 Charger", "Wireless charging stand", 12999.00,
                                                        4.5, "Belkin", 12, 25, "Accessories"),
                                        new Product(null, "Dell 4K Webcams", "Pro webcam for streaming", 18500.00, 4.4,
                                                        "Dell", 8, 15, "Accessories"),

                                        // 15 New Accessories (Laptop & Mobile)
                                        new Product(null, "Havit RGB Cooling Pad",
                                                        " cooling pad for 15.6-17 inch laptops", 2499.00, 4.5, "Havit",
                                                        20, 50, "Accessories"),
                                        new Product(null, "UGREEN USB-C Hub", "6-in-1 adapter with 4K HDMI", 3299.00,
                                                        4.6, "UGREEN", 25, 100, "Accessories"),
                                        new Product(null, "Tomtoc 360 Case", "Protective sleeve for MacBook/Laptop",
                                                        2999.00, 4.8, "Tomtoc", 15, 40, "Accessories"),
                                        new Product(null, "Logitech R500s", "Laser presentation remote", 3495.00, 4.7,
                                                        "Logitech", 10, 30, "Accessories"),
                                        new Product(null, "Webcam Cover 3-Pack", "Privacy slider for laptops", 299.00,
                                                        4.4, "Generic", 50, 200, "Accessories"),
                                        new Product(null, "JBL Flip 6 Speaker", "Powerful portable bluetooth speaker",
                                                        9999.00, 4.6, "JBL", 25, 120, "Accessories"),
                                        new Product(null, "Backbone One Controller",
                                                        "Gaming controller for iPhone/Android", 9999.00, 4.7,
                                                        "Backbone", 12, 25, "Accessories"),
                                        new Product(null, "DJI Osmo Mobile 6", "3-Axis smartphone gimbal stabilizer",
                                                        13990.00, 4.6, "DJI", 8, 20, "Accessories"),
                                        new Product(null, "Xiaomi Selfie Stick", "Bluetooth tripod selfie stick",
                                                        1299.00, 4.5, "Xiaomi", 20, 60, "Accessories"),
                                        new Product(null, "Spigen ArcStation Charger", "45W GaN USB-C charger", 2499.00,
                                                        4.8, "Spigen", 25, 90, "Accessories"),
                                        new Product(null, "ESR HaloLock Car Mount", "MagSafe dashboard holder", 2999.00,
                                                        4.6, "ESR", 15, 45, "Accessories"),
                                        new Product(null, "Lamicall Tablet Stand", "Adjustable desktop holder", 1199.00,
                                                        4.7, "Lamicall", 18, 70, "Accessories"),
                                        new Product(null, "Tukzer Stylus Pen", "Universal capacitive stylus", 699.00,
                                                        4.3, "Tukzer", 40, 100, "Accessories"),
                                        new Product(null, "Cable Management Clips", "Self-adhesive cord organizers",
                                                        399.00, 4.5, "Generic", 50, 150, "Accessories"),
                                        new Product(null, "SanDisk Ultra Dual Drive", "128GB USB Type-C OTG Pendrive",
                                                        1899.00, 4.6, "SanDisk", 30, 120, "Accessories"));

                        productRepository.saveAll(products);
                        System.out.println("✅ DataSeeder: Successfully inserted 30 products!");
                } else {
                        System.out.println("ℹ️ DataSeeder: Products already exist, skipping seed.");
                }
        }
}
