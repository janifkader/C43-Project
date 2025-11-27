package com.c43.portfolio_manager.model;

public class Stock {
	public int sl_id;
	public String symbol;
	public int num_of_shares;
	
	public Stock(int sl_id, String symbol, int num_of_shares) {
		this.sl_id = sl_id;
		this.symbol = symbol;
		this.num_of_shares = num_of_shares;
	}
}