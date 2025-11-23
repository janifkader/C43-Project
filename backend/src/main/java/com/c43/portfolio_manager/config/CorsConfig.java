package com.c43.portfolio_manager.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

 @Override
 public void addCorsMappings(CorsRegistry registry) {
     registry.addMapping("/**") // Apply CORS configuration to all endpoints
         .allowedOrigins("http://localhost:3000") // ⬅️ THIS IS CRUCIAL
         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
         .allowedHeaders("*")
         .allowCredentials(true); // Allows the "credentials: 'include'" from your fetch
 }
}