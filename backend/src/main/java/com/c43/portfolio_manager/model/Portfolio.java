package com.c43.portfolio_manager.model;

import jakarta.validation.constraints.*;

public class Portfolio {
	
	@Min(value = 0, message = "Portfolio ID must be positive")
	public int port_id;
	
	@Min(value = 0, message = "Cash Amount must be positive")
	public double cash_amt;
	
	public Portfolio(int port_id, double cash_amt) {
		this.port_id = port_id;
		this.cash_amt = cash_amt;
	}
}
