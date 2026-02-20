package com.hp.topcart.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_users")
public class ChatUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private LocalDateTime sessionStartedAt;

    public ChatUser() {
        this.sessionStartedAt = LocalDateTime.now();
    }

    public ChatUser(String name, String email) {
        this.name = name;
        this.email = email;
        this.sessionStartedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getSessionStartedAt() {
        return sessionStartedAt;
    }

    public void setSessionStartedAt(LocalDateTime sessionStartedAt) {
        this.sessionStartedAt = sessionStartedAt;
    }
}
