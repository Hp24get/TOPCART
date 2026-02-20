package com.hp.topcart.service;

import com.hp.topcart.entity.Product;
import com.hp.topcart.entity.ProductReview;
import com.hp.topcart.entity.User;
import com.hp.topcart.repository.ProductRepository;
import com.hp.topcart.repository.ProductReviewRepository;
import com.hp.topcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProductReview> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Transactional
    public ProductReview addReview(Long productId, Long userId, Integer rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductReview review = new ProductReview(rating, comment, user, product);
        ProductReview savedReview = reviewRepository.save(review);

        recalculateProductRating(product);

        return savedReview;
    }

    private void recalculateProductRating(Product product) {
        List<ProductReview> reviews = reviewRepository.findByProductId(product.getId());

        if (reviews.isEmpty()) {
            product.setRating(0.0);
        } else {
            double totalRating = reviews.stream().mapToInt(ProductReview::getRating).sum();
            double avgRating = totalRating / reviews.size();

            // Round to 1 decimal place
            avgRating = Math.round(avgRating * 10.0) / 10.0;
            product.setRating(avgRating);
        }

        productRepository.save(product);
    }
}
