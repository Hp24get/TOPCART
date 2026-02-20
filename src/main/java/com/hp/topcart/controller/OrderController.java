package com.hp.topcart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // Temporary In-Memory Storage since we don't have Order Entity yet
    private final List<Map<String, Object>> orders = new ArrayList<>();

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> orderData) {
        // Simulate processing
        System.out.println("📦 Order Received!");

        // Add ID and Timestamp
        Map<String, Object> newOrder = new HashMap<>(orderData);
        newOrder.put("id", "ORD-" + System.currentTimeMillis());
        newOrder.put("status", "Pending");
        newOrder.put("date", new Date());

        orders.add(newOrder);

        // Simulate Email Sending
        String email = (String) orderData.get("email");
        if (email != null) {
            System.out.println("📧 Sending simulated email to: " + email);
        }

        return ResponseEntity.ok(Map.of("message", "Order received successfully!", "orderId", newOrder.get("id")));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        return ResponseEntity.ok(orders);
    }

    // Optional: Update Order Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> statusMap) {
        for (Map<String, Object> order : orders) {
            if (order.get("id").equals(id)) {
                order.put("status", statusMap.get("status"));
                return ResponseEntity.ok(order);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Get Orders for a specific user (My Orders)
    @GetMapping("/my-orders")
    public ResponseEntity<List<Map<String, Object>>> getMyOrders(@RequestParam String email) {
        List<Map<String, Object>> userOrders = new ArrayList<>();
        for (Map<String, Object> order : orders) {
            String orderEmail = (String) order.get("email");
            if (orderEmail != null && orderEmail.equalsIgnoreCase(email)) {
                userOrders.add(order);
            }
        }
        return ResponseEntity.ok(userOrders);
    }
}
