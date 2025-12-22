package com.c43.portfolio_manager.model;

import jakarta.validation.constraints.*;

public class Portfolio {
	
	@NotBlank(message = "User ID cannot be empty")
	@Pattern(regexp = "^[0-9]+$", message = "User ID can only contain numbers")
	public int port_id;
	
	@NotBlank(message = "Cash Amount cannot be empty")
	@Pattern(regexp = "^[0-9]+$", message = "User ID can only contain numbers")
	public double cash_amt;
	
	public Portfolio(int port_id, double cash_amt) {
		this.port_id = port_id;
		this.cash_amt = cash_amt;
	}
}
