package com.c43.portfolio_manager.model;

import jakarta.validation.constraints.*;

public class SharedStockList {
	
	@Min(value = 0, message = "Stock List ID must be positive")
	public int sl_id;
	
	@Min(value = 0, message = "User ID must be positive")
	public int user_id;
	
	@NotBlank(message = "Symbol cannot be empty")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Symbol can only contain letters")
	public String username;
	
	@Pattern(regexp = "private|public", message = "Visibility must be either private or public")
	public String visibility;
	
	public SharedStockList(int sl_id, int user_id, String username, String visibility) {
		this.sl_id = sl_id;
		this.user_id = user_id;
		this.username = username;
		this.visibility = visibility;
	}
}
