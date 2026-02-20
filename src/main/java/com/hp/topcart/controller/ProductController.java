package com.hp.topcart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hp.topcart.entity.Product;
import com.hp.topcart.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllproducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String name,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String category,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Double minPrice,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Double maxPrice) {
        List<Product> searchResults = productService.searchProducts(name, category, minPrice, maxPrice);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Image Upload Endpoint
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @org.springframework.web.bind.annotation.RequestParam("image") org.springframework.web.multipart.MultipartFile file,
            @org.springframework.web.bind.annotation.RequestParam("productName") String productName) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }
            if (productName == null || productName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product Name is required for image upload");
            }

            // Define the upload directory
            String uploadDir = "d:/learn/ecommerce/topcart/frontend/public/images/";
            java.io.File directory = new java.io.File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate filename from Product Name (Slugify)
            // "Gaming PC" -> "gaming-pc.jpg"
            String slug = productName.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
            // Remove trailing/leading dashes
            slug = slug.replaceAll("^-|-$", "");

            String fileName = slug + ".jpg"; // Force .jpg extension as expected by frontend

            java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + fileName);
            java.nio.file.Files.write(path, file.getBytes());

            // Return the public URL
            String imageUrl = "/images/" + fileName;
            return ResponseEntity.ok(imageUrl);

        } catch (java.io.IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload image: " + e.getMessage());
        }
    }
}
