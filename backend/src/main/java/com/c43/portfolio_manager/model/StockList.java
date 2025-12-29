package com.c43.portfolio_manager.model;

import jakarta.validation.constraints.*;

public class StockList {
	
	@Min(value = 0, message = "Stocklist ID must be positive")
	public int sl_id;
	
	@Pattern(regexp = "private|public", message = "Visibility must be either private or public")
	public String visibility;
	
	public StockList(int sl_id, String visibility) {
		this.sl_id = sl_id;
		this.visibility = visibility;
	}
}
