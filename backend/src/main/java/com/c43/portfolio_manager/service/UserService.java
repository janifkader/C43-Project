package com.c43.portfolio_manager.service;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.repository.UserRepo;

@Service
public class UserService {
    private UserRepo repo = new UserRepo();
    
    public int createUser(String username, String password) {
        return repo.createUser(username, password);
    }
    
    public int getUser(String username, String password) {
        return repo.getUser(username, password);
    }
    
    public String getUsername(int user_id) {
        return repo.getUsername(user_id);
    }
}
