package com.c43.portfolio_manager.model;
public class Portfolio {
	
	public int port_id;
	public int user_id;
	public double cash_amt;
	
	public Portfolio(int port_id, int user_id, double cash_amt) {
		this.port_id = port_id;
		this.user_id = user_id;
		this.cash_amt = cash_amt;
	}
}
