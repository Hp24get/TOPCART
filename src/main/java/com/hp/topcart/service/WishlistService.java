package com.hp.topcart.service;

import com.hp.topcart.entity.Product;
import com.hp.topcart.entity.User;
import com.hp.topcart.entity.Wishlist;
import com.hp.topcart.repository.ProductRepository;
import com.hp.topcart.repository.UserRepository;
import com.hp.topcart.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getWishlistByUserId(Long userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);
        return wishlists.stream().map(Wishlist::getProduct).collect(Collectors.toList());
    }

    @Transactional
    public void addProductToWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            Wishlist wishlist = new Wishlist(user, product);
            wishlistRepository.save(wishlist);
        }
    }

    @Transactional
    public void removeProductFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isProductInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
}
