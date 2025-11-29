package com.c43.portfolio_manager.model;

public class User {

	public int user_id;
    public String username;
    public String password;
	
	public User(int user_id, String username, String password) {
        this.user_id = user_id;
		this.username = username;
        this.password = password;
    }
}
