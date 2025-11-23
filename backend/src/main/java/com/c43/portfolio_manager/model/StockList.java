package com.c43.portfolio_manager.model;

public class StockList {
	public int sl_id;
	public int user_id;
	public String visibility;
	
	public StockList(int sl_id, int user_id, String visibility) {
		this.sl_id = sl_id;
		this.user_id = user_id;
		this.visibility = visibility;
	}
}
