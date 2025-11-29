package com.c43.portfolio_manager.model;

import java.math.BigDecimal;

public class Stock {
	public int id;
	public String symbol;
	public int num_of_shares;
	
	public Stock(int id, String symbol, int num_of_shares) {
		this.id = id;
		this.symbol = symbol;
		this.num_of_shares = num_of_shares;
	}
}