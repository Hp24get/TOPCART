package com.hp.topcart.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hp.topcart.entity.User;
import com.hp.topcart.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User loginOrRegister(String name, String mobileNumber) {
        Optional<User> existingUser = userRepository.findByMobileNumber(mobileNumber);

        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            // Register new user
            // Default role is USER. Admin is seeded manually.
            User newUser = new User(name, mobileNumber, "USER");
            return userRepository.save(newUser);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
