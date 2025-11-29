package com.c43.portfolio_manager.model;

public class User {

	private int user_id;
    private String username;
    private String password;
	
	public User(int user_id, String username, String password) {
        this.user_id = user_id;
		this.username = username;
        this.password = password;
    }
}
