package com.hp.topcart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration
                            .setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:5174"));
                    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/*.js", "/*.css", "/*.png",
                                "/*.ico", "/*.svg")
                        .permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().permitAll()); // Permit all for now to ensure React Router paths work, or use a
                                                    // better pattern later
        return http.build();
    }
}
