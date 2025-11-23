package com.c43.portfolio_manager.endpoints;
import java.sql.SQLException;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.User;
import com.c43.portfolio_manager.service.UserService;

@RestController
@RequestMapping("/")
public class UserEndpoint {
	private final UserService service;

    public UserEndpoint(UserService service) {
        this.service = service;
    }
    
    @PostMapping("/signup")
    public int create(@RequestBody User user) {
        return service.createUser(user.username, user.password);
    }
    
    @PostMapping("/signin")
    public int get(@RequestBody User user) {
        return service.getUser(user.username, user.password);
    }
}
