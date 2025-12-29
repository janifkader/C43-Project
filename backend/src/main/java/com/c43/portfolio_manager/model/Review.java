package com.c43.portfolio_manager.model;

import jakarta.validation.constraints.*;

public class Review {
	
	@Min(value = 0, message = "Review ID must be positive")
	public int review_id;
	
	@Min(value = 0, message = "User ID must be positive")
	public int user_id;
	
	@Min(value = 0, message = "Stock List ID must be positive")
	public int sl_id;
	
	@NotBlank(message = "Text cannot be empty")
	@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Text can only contain letters and numbers")
	public String text;
	
	@NotBlank(message = "Username cannot be empty")
	@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username can only contain letters and numbers")
	public String username;
	
	public Review(int review_id, int user_id, int sl_id, String text, String username) {
		this.review_id = review_id;
		this.user_id = user_id;
		this.sl_id = sl_id;
		this.text = text;
		this.username = username;
	}
}
