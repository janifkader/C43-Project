package com.c43.portfolio_manager.endpoints;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.User;
import com.c43.portfolio_manager.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.*;

@RestController
@RequestMapping("/user")
public class UserEndpoint {
    private final UserService service;
    
    public UserEndpoint(UserService service) {
        this.service = service;
    }
    
    @PostMapping("/register/")
    public int register(@Valid @RequestBody User user, HttpServletResponse response) {
    	int user_id = service.createUser(user.username, user.password);
    	if (user_id >= 0) {
    		Cookie cookie = new Cookie("user_id", String.valueOf(user_id));
    		cookie.setPath("/");
    		response.addCookie(cookie);
    	}
    	return user_id;
    }
    
    @PostMapping("/login/")
    public int login(@Valid @RequestBody User user, HttpServletResponse response) {
    	int user_id = service.getUser(user.username, user.password);
    	if (user_id >= 0) {
    		Cookie cookie = new Cookie("user_id", String.valueOf(user_id));
    		cookie.setPath("/");
    		response.addCookie(cookie);
    	}
    	return user_id;
    }
    
    @PostMapping("/logout/")
    public int logout(@CookieValue(value = "user_id", defaultValue = "-1") int user_id, HttpServletResponse response) {
    	if (user_id >= 0) {
    		Cookie cookie = new Cookie("user_id", null);
    		cookie.setPath("/");
    		response.addCookie(cookie);
    	}
    	return 0;
    }
    
    @GetMapping("/")
    public Map<String, String> getUsername(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
    	String name = service.getUserByID(user_id);
    	return Collections.singletonMap("username", name);
    }
    
    @GetMapping("/users/")
    public List<User> getUsers() {
    	return service.getUsers();
    }
}