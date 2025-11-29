package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.repository.UserRepo;
import com.c43.portfolio_manager.model.User;

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
