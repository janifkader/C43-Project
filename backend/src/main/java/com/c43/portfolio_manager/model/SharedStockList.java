package com.c43.portfolio_manager.model;

public class SharedStockList {
	public int sl_id;
	public int user_id;
	public String username;
	public String visibility;
	
	public SharedStockList(int sl_id, int user_id, String username, String visibility) {
		this.sl_id = sl_id;
		this.user_id = user_id;
		this.username = username;
		this.visibility = visibility;
	}
}
