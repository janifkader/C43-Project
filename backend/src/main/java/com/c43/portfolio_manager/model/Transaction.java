package com.c43.portfolio_manager.model;
import java.sql.Date;

import jakarta.validation.constraints.*;

public class Transaction {
	
	@Min(value = 0, message = "Transaction ID must be positive")
	public int transaction_id;
	
	@NotBlank(message = "Symbol cannot be empty")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Symbol can only contain letters")
	public String symbol;
	
	@Min(value = 0, message = "Portfolio ID must be positive")
	public int port_id;
	
	@Pattern(regexp = "BUY|SELL", message = "Type must be either BUY or SELL")
	public String type;
	
	@Min(value = 0, message = "Amount must be positive")
	public int amount;
	
	@Min(value = 0, message = "Unit Cost must be positive")
	public double unit_cost;
	
	
	public Date date;
	
	public Transaction(int transaction_id, String symbol, int port_id, String type, int amount, double unit_cost, Date date) {
		this.transaction_id = transaction_id;
		this.symbol = symbol;
		this.port_id = port_id;
		this.type = type;
		this.amount = amount;
		this.unit_cost = unit_cost;
		this.date = date;
	}
	
}
