package com.c43.portfolio_manager.model;
import jakarta.validation.constraints.*;

public class User {
	
	@NotBlank(message = "User ID cannot be empty")
	@Pattern(regexp = "^[0-9]+$", message = "User ID can only contain numbers")
	public int user_id;
	
	@NotBlank(message = "Username cannot be empty")
	@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username can only contain letters and numbers")
    public String username;
	
	@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Password can only contain letters and numbers")
    public String password;
	
	public User(int user_id, String username, String password) {
        this.user_id = user_id;
		this.username = username;
        this.password = password;
    }
}
