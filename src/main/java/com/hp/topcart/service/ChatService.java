package com.hp.topcart.service;

import com.hp.topcart.entity.Product;
import com.hp.topcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private com.hp.topcart.repository.ChatUserRepository chatUserRepository;

    public void saveUser(String name, String email) {
        if (name != null && email != null) {
            chatUserRepository.save(new com.hp.topcart.entity.ChatUser(name, email));
        }
    }

    public String processMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "I didn't catch that. Could you please repeat?";
        }

        String lowerCaseMessage = message.toLowerCase(Locale.ROOT);

        if (lowerCaseMessage.contains("hello") || lowerCaseMessage.contains("hi") || lowerCaseMessage.contains("hey")) {
            return "Hello! Welcome to TopCart. How can I assist you today?";
        }

        if (lowerCaseMessage.contains("price") || lowerCaseMessage.contains("cost")
                || lowerCaseMessage.contains("how much")) {
            return handlePriceQuery(lowerCaseMessage);
        }

        if (lowerCaseMessage.contains("laptop") || lowerCaseMessage.contains("phone")
                || lowerCaseMessage.contains("mobile") || lowerCaseMessage.contains("camera")) {
            return handleProductSearch(lowerCaseMessage);
        }

        return "I'm still learning! You can ask me about product prices or search for items like laptops or phones.";
    }

    private String handlePriceQuery(String message) {
        // Simple keyword extraction for demo purposes
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            if (message.contains(product.getName().toLowerCase())) {
                return "The price of " + product.getName() + " is $" + product.getPrice();
            }
        }
        return "I couldn't find the price for that product. Please specify the full product name.";
    }

    private String handleProductSearch(String message) {
        List<Product> products = productRepository.findAll();
        List<String> matches = products.stream()
                .filter(p -> message.contains(p.getCategory().toLowerCase())
                        || message.contains(p.getName().toLowerCase())
                        || p.getDescription().toLowerCase().contains(message)) // broadened search
                .map(Product::getName)
                .limit(5)
                .collect(Collectors.toList());

        if (matches.isEmpty()) {
            // Fallback for categories if specific product name match failed but category
            // might accept it
            if (message.contains("laptop") || message.contains("pc")) {
                return "We have great PC devices! Check out our Alienware, HP Omen, and ASUS ROG laptops.";
            }
            if (message.contains("phone") || message.contains("mobile")) {
                return "We have the latest smartphones including iPhone 15, Samsung S24, and Pixel 8.";
            }

            return "I couldn't find any products matching your description.";
        }

        return "Here are some products I found: " + String.join(", ", matches);
    }
}
