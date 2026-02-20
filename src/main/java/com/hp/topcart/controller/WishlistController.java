package com.hp.topcart.controller;

import com.hp.topcart.entity.Product;
import com.hp.topcart.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Get all wishlisted products for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Product>> getWishlist(@PathVariable Long userId) {
        List<Product> products = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(products);
    }

    // Add a product to the wishlist
    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.addProductToWishlist(userId, productId);
        return ResponseEntity.ok().build();
    }

    // Remove a product from the wishlist
    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.removeProductFromWishlist(userId, productId);
        return ResponseEntity.ok().build();
    }

    // Check if a product is in the wishlist
    @GetMapping("/{userId}/check/{productId}")
    public ResponseEntity<Boolean> checkWishlistStatus(@PathVariable Long userId, @PathVariable Long productId) {
        boolean status = wishlistService.isProductInWishlist(userId, productId);
        return ResponseEntity.ok(status);
    }
}
