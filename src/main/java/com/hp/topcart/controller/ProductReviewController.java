package com.hp.topcart.controller;

import com.hp.topcart.entity.ProductReview;
import com.hp.topcart.service.ProductReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService productReviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getProductReviews(@PathVariable Long productId) {
        List<ProductReview> reviews = productReviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/add")
    public ResponseEntity<ProductReview> addReview(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        Integer rating = Integer.valueOf(payload.get("rating").toString());
        String comment = payload.get("comment") != null ? payload.get("comment").toString() : "";

        ProductReview newReview = productReviewService.addReview(productId, userId, rating, comment);
        return ResponseEntity.ok(newReview);
    }
}
