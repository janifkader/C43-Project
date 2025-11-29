package com.c43.portfolio_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.User;
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
	
	public String getUserByID(int user_id) {
		return repo.getUsername(user_id);
	}
	
	public List<User> getUsers() {
		return repo.getUsers();
	}
	
}
