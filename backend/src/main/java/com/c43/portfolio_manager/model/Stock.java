package com.c43.portfolio_manager.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;

public class Stock {
	
	@Min(value = 0, message = "ID must be positive")
	public int id;
	
	@NotBlank(message = "Symbol cannot be empty")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Symbol can only contain letters")
	public String symbol;
	
	@Min(value = 0, message = "Number of shares must be positive")
	public int num_of_shares;
	
	public Stock(int id, String symbol, int num_of_shares) {
		this.id = id;
		this.symbol = symbol;
		this.num_of_shares = num_of_shares;
	}
}