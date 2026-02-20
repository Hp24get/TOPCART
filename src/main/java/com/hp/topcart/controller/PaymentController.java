package com.hp.topcart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    /**
     * Simulates a payment processing endpoint.
     * Expects a JSON body with at least 'amount' and basic 'cardData'.
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Simulate processing delay (network latency / bank communication)
            Thread.sleep(2000);

            // Basic validation
            if (!payload.containsKey("amount") || payload.get("amount") == null) {
                response.put("success", false);
                response.put("message", "Payment amount is required.");
                return ResponseEntity.badRequest().body(response);
            }

            Double amount = Double.valueOf(payload.get("amount").toString());
            String cardNumber = (String) payload.getOrDefault("cardNumber", "");

            // Simulate failure condition: if card ends in '0000', decline it
            if (cardNumber.endsWith("0000")) {
                response.put("success", false);
                response.put("message", "Payment Declined: Insufficient Funds or Invalid Card.");
                response.put("transactionId", null);
                return ResponseEntity.ok(response);
            }

            // Simulate success
            response.put("success", true);
            response.put("message", "Payment processed successfully.");
            response.put("transactionId", "txn_mock_" + UUID.randomUUID().toString().substring(0, 8));
            response.put("amountProcessed", amount);

            return ResponseEntity.ok(response);

        } catch (InterruptedException e) {
            response.put("success", false);
            response.put("message", "Payment processing interrupted.");
            return ResponseEntity.internalServerError().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An unexpected error occurred during payment.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
