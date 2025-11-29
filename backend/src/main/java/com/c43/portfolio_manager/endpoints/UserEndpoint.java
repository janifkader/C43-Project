package com.c43.portfolio_manager.endpoints;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.User;
import com.c43.portfolio_manager.service.UserService;

@RestController
@RequestMapping("/user")
public class UserEndpoint {
    private final UserService service;
    
    public UserEndpoint(UserService service) {
        this.service = service;
    }
    
    @PostMapping("/register/")
    public int register(@RequestBody User user) {
        return service.createUser(user.username, user.password);
    }
    
    @PostMapping("/login/")
    public int login(@RequestBody User user) {
        return service.getUser(user.username, user.password);
    }
    
    @GetMapping("/{user_id}")
    public String getUsername(@PathVariable int user_id) {
    	return service.getUserByID(user_id);
    }
    
    @GetMapping("/users/")
    public List<User> getUsers() {
    	return service.getUsers();
    }
}