package com.hp.topcart.controller;

import com.hp.topcart.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String response = chatService.processMessage(message);
        return Map.of("response", response);
    }

    @PostMapping("/user")
    public Map<String, String> saveUser(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        chatService.saveUser(name, email);
        return Map.of("status", "success");
    }
}
