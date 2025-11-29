package com.c43.portfolio_manager.endpoints;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.service.UserService;

@RestController
@RequestMapping("/user")
public class UserEndpoint {
    private final UserService service;
    
    public UserEndpoint(UserService service) {
        this.service = service;
    }
    
    @PostMapping("/register")
    public int register(@RequestParam String username, @RequestParam String password) {
        return service.createUser(username, password);
    }
    
    @PostMapping("/login")
    public int login(@RequestParam String username, @RequestParam String password) {
        return service.getUser(username, password);
    }
    
    @GetMapping("/{user_id}")
    public String getUsername(@PathVariable int user_id) {
        return service.getUsername(user_id);
    }
}
